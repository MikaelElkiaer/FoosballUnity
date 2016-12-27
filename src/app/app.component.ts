import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

import { Player } from './player';
import { PlayerService } from './player.service';

import { RankingItem } from './ranking-item';
import { RankingItemService } from './ranking-item.service';

import { Game } from './game';
import { GameService } from './game.service';

import { TournamentGame } from './tournament-game';

import { TournamentGameRound } from './tournament-game-round';
import { TournamentGameRoundService } from './tournament-game-round.service';

import { IndividualResultsComponent } from './individual-results.component';

import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [PlayerService, RankingItemService, GameService, TournamentGameRoundService]
})
export class AppComponent {

  @ViewChild(IndividualResultsComponent)
  private individualResultsComponent: IndividualResultsComponent;

  oneRoundAtATime = true;
  title = 'app works!';
  newPlayer: Player;
  players: Player[];
  intenseArray: string[];
  selectedPlayers: number;
  rankingItems: RankingItem[];
  rankingItemsForIntense: RankingItem[];
  currentPositionForPlayer: number[];
  currentPointsForPlayer: number[];
  resultBackFromGettingPlayers = false;
  experiencedProblemWithGettingPlayers = false;
  showRankingPeriod = 'hour';
  showMatchesPeriod = 'hour';
  games: Game[];

  tempTournamentGameRounds: TournamentGameRound[];
  tournamentGameRounds: TournamentGameRound[];
  playerForStatistics = null;
  promise:any;
  soundFire:any;

  private mySelectedPlayers: Player[];

  constructor(
    private playerService: PlayerService,
    private rankingItemService: RankingItemService,
    private gameService: GameService,
    private tournamentGameRoundService: TournamentGameRoundService
  ) {
      this.soundFire= new Audio("/assets/sounds/fire.wav");
  }

  ngOnInit(): void {
    this.getPlayers();
    this.getRankingItems();
    this.showGamesForPeriod(this.showMatchesPeriod);
  }

  // PLAYER RELATED

  getImageUrl(playerName : string) : string {
    if (playerName == null) {
      return "assets/img/Wildcard.jpg";
    } else {
      return "assets/img/" + playerName + ".jpg";
    }
  }

  deselectAll() {
    for (let player of this.players) {
      player.playerReady = false;
    }
    this.countSelectedPlayers()
  }

  add(name: string): void {

    this.playerAlerts =  [];
    name = name.trim();
    if (!name) {
      this.addPlayerAlert('Du skal indtaste navn eller initialer', 'danger');
       return;
    }
    var upperCaseVersion = name.toUpperCase();
    var alreadyExist = false;
    var theNameThatExists = '';
    for (let play of this.players) {
      if (play.name.toUpperCase() == upperCaseVersion) {
        alreadyExist = true;
        theNameThatExists = play.name;
      }
    }
    if (alreadyExist) {
      this.addPlayerAlert('Navn/initialer \'' + name + '\' kan ikke benyttes, da der allerede findes en spiller med dette navn/initialer (\'' + theNameThatExists + '\')', 'danger');
       return;
    }
    if (name.length > 10) {
       this.addPlayerAlert('Navn/initialer må maks. bestå af 10 bogstaver/tal', 'danger');
        return;
    }
    if (name.includes(' ')) {
      this.addPlayerAlert('Navn/initialer må ikke indeholde mellemrum', 'danger');
       return;
    }

    var today = new Date();
    var dd : number = today.getDate();
    var mm : number = (today.getMonth()+1); //January is 0!
    var yyyy = today.getFullYear();

    var hours = today.getHours();
    var newHOURS;
    newHOURS = hours;
    if(hours<10) {
        newHOURS='0'+hours;
    }

    var minutes = today.getMinutes();
    var newMINUTES;
    newMINUTES = minutes;

    if(minutes<10) {
        newMINUTES='0'+minutes;
    }

    var seconds = today.getSeconds();
    var newSECONDS;
    newSECONDS = seconds;
    if(seconds<10) {
        newSECONDS='0'+seconds;
    }

    var newToday;
    var newDD;
    newDD = dd;
    if(dd<10) {
        newDD='0'+dd;
    }
    var newMM;
    newMM = mm;
    if(mm<10) {
        newMM='0'+mm;
    }


    //2016-10-22 23:21:30.0
    newToday = yyyy+'/'+newMM+'/'+newDD + " " + newHOURS + ":" + newMINUTES + ":" + newSECONDS + "." + today.getMilliseconds();


    this.newPlayer = new Player(name, true, new Date(newToday));

    this.playerService.create(name, true, new Date(newToday))
    .then((strRes : string) => {
    //alert(strRes);
       this.players.push(this.newPlayer);
       this.players = this.sortedPlayers();
       this.countSelectedPlayers();
        this.addPlayerAlert('Spilleren \'' + name + '\' er nu oprettet og markeret i listen', 'success');
      //this.players.push(player);
    }).catch(err  => {

        this.addPlayerAlert('Noget gik galt i forsøget på at oprette spilleren. Fejlen var: \'' + err + '\'', 'danger');

      })
    }

  getPlayers(): void {
    //alert("starting");
      this.playerService.getPlayers().then(
     (players : Player[]) =>
     {
       this.setPlayers(players) ;
       //this.problemWithGettingPlayers = false;
       this.resultBackFromGettingPlayers = true;
       //alert("1");
       this.experiencedProblemWithGettingPlayers = false;
     }
   )
     .catch(err => {
       this.resultBackFromGettingPlayers = true;
       //alert("2");
       this.experiencedProblemWithGettingPlayers = true;
       return Promise.reject(err.message || err);
     });
     //alert("ending");
   }


   setPlayers(players: Player[]): void {
    this.players = players;
    this.players = this.sortedPlayers();
    this.countSelectedPlayers();
   }

   countSelectedPlayers(): void {
      let playerReady = this.players.filter((x) => x.playerReady)
      this.selectedPlayers = playerReady.length;
    }

    setMySelectedPlayers(): void {
      let playerReady = this.players.filter((x) => x.playerReady);
      this.mySelectedPlayers = playerReady;
    }
    sortedPlayers() {

      var sortedArray: Player[] = this.players.sort((n1,n2) => {
      if (n1.name.toLocaleLowerCase() > n2.name.toLocaleLowerCase()) {
          return 1;
      }

      if (n1.name.toLocaleLowerCase() < n2.name.toLocaleLowerCase()) {
          return -1;
      }

      return 0;
      });
      return sortedArray;
    }

    // TABS RELATED
    public showRankingForPeriod(period: string):void {
      //alert("i ts: " + period)
      this.noRankingListAlerts = [];
      this.showRankingPeriod = period;
      this.rankingItems  = null;
      this.rankingItemService.getRankingItems(period).then(
        (rankingItems : RankingItem[]) => this.rankingItems = rankingItems)
      .catch(err => {
        console.log('Problemer med at hente ranking-liste for perioden ' + period);
        this.addNoRankingListAlert('Kunne ikke hente ranglisten for den valgte periode. Tjek evt. om der er problemer med adgangen til serveren?', 'danger');
      });
    };

    // RANKINGITEMS RELATED
    getRankingItems(): void {
      this.rankingItemService.getRankingItems(this.showRankingPeriod).then((rankingItems : RankingItem[]) => this.rankingItems = rankingItems);
    }

    public getRankingItemsForIntense(): void {
      var intenseFound = false;
      //alert("a");
      //alert ('a1 længde af this.tempTournamentGameRounds[0].tournamentGames.length "' + this.tempTournamentGameRounds[0].tournamentGames.length + '"')
      if (this.oneRoundAtATime) {
        //alert("Gør klar i Fiddler")
        //alert("UDE this.tempTournamentGameRounds:" + this.tempTournamentGameRounds);
          this.intenseArray = new Array(this.tempTournamentGameRounds[0].tournamentGames.length);
          this.currentPointsForPlayer = new Array();
          this.currentPositionForPlayer = new Array();
          var firstTournamentGameRound = this.tempTournamentGameRounds[0];
          //alert('der er : "' + firstTournamentGameRound.tournamentGames.length + "'")

        this.rankingItemService.getRankingItems('alltime').
        then((rankingItems : RankingItem[]) => {
            //alert("før b");
            //alert("b");
                        //alert("Noget her")
            //alert ('2 længde af this.tempTournamentGameRounds[0].tournamentGames.length "' + this.tempTournamentGameRounds[0].tournamentGames.length + '"')
          //  alert("INDE this.tempTournamentGameRounds:" + this.tempTournamentGameRounds);
            //alert(" en c")
          //  alert("this.tempTournamentGameRounds[0].tournamentGames:" + this.tempTournamentGameRounds[0].tournamentGames)
          //  alert("this.tempTournamentGameRounds[0].tournamentGames.length: " + this.tempTournamentGameRounds[0].tournamentGames.length)

              //alert("c");


            this.rankingItemsForIntense = rankingItems;
            // Hiv ud fra tempTournamentGames og se om er er intense for nogle af kampene
            var i = 0;
              //alert("d");

            for (let game of firstTournamentGameRound.tournamentGames) {
              var combinedPointsTeamRed = 0;
              var combinedPointsTeamBlue = 0;
              for (let rankingItem of this.rankingItemsForIntense) {

                //NIKL - Her skal jeg skrive ind hvis jeg fandt spilelre, hvad han har af point og position
                //  og så skal jeg i app.component.html hente dette frem via funktion
                //  det sal ikke være array men noget andet
                console.log("Før jeg tjekker for rankingItem.name")
                if (rankingItem.name == game.player_red_1 ||
                    rankingItem.name == game.player_red_2 ||
                    rankingItem.name == game.player_blue_1 ||
                    rankingItem.name == game.player_blue_2) {

                    this.currentPointsForPlayer[rankingItem.name.toLocaleLowerCase()] = rankingItem.points;
                    this.currentPositionForPlayer[rankingItem.name.toLocaleLowerCase()] = rankingItem.position;

                    //console.log(rankingItem.name + " fik " + rankingItem.points + " point, som vist her: ")
                    //console.log(this.currentPointsForPlayer[rankingItem.name.toLocaleLowerCase()]);
                }
                if (rankingItem.name == game.player_red_1 || (rankingItem.name == game.player_red_2)) {
                  combinedPointsTeamRed = combinedPointsTeamRed + rankingItem.points;

                }
                if (rankingItem.name == game.player_blue_1 || (rankingItem.name == game.player_blue_2)) {
                  combinedPointsTeamBlue = combinedPointsTeamBlue + rankingItem.points;
                }
              }

              console.log("red: " + combinedPointsTeamRed);
              console.log("blue: " + combinedPointsTeamBlue);
              if (combinedPointsTeamRed > combinedPointsTeamBlue + 5) {
                this.intenseArray[i] = "blue";
                intenseFound = true;
              } else if (combinedPointsTeamRed + 5 < combinedPointsTeamBlue) {
                this.intenseArray[i] = "red";
                intenseFound = true;
              } else {
                this.intenseArray[i] = "";
              }
              i++;
            }
            if (intenseFound) {
              this.soundFire.play();
            }

            //alert("point for NIKL:" + this.currentPointsForPlayer['NIKL']);
            //alert("point for nikl:" + this.currentPointsForPlayer['nikl']);
          })
          .catch(err => {
            console.log('xxxder var fejl omkring generering af kampe');

            this.addNoGameGenerationAlert('Noget gik galt i forsøget på at generere kampe. Tjek venligst at der er forbindelse til serveren og prøv så igen. Fejlen var: \'' + err + '\'', 'danger');
            this.tempTournamentGameRounds = null;
            //this.rankingItemsForIntense = null;
          })
      }

      // Nulstil så formodenligt nogle af tingene
      console.log("this.tempTournamentGameRounds" + this.tempTournamentGameRounds)
      this.tournamentGameRounds = this.tempTournamentGameRounds;
      this.tempTournamentGameRounds = null;
      //this.rankingItemsForIntense = null;
    }


    // GAMES RELATED
   showGamesForPeriod(period : string): void {
      this.noGamesAlerts = [];
      this.showMatchesPeriod = period;
      this.games  = null;
      this.gameService.getGames(period).then(
        (games : Game[] ) => this.games = games)
        .catch(err => {
          console.log('Problemer med at hente kampene for perioden ' + period);
          this.addNoGamesAlert('Kunne ikke hente kampene for den valgte periode. Tjek evt. om der er problemer med adgangen til serveren?', 'danger');
        });
    }



    indmeldResultat(roundIndex : number, player_red_1 : string, player_red_2 : string, player_blue_1 : string, player_blue_2 : string, table: string, resultat : string,  updateTime: string, points_at_stake: number): void {
      this.noGameGenerationAlerts = [];
    if (this.tournamentGameRounds[roundIndex].tournamentGames[+table - 1].id == 0) {
      alert('Du kan ikke indmelde samme kamp 2 gange!');
      return;
    }

    //alert("hertil");
      this.gameService.indmeldResultat(player_red_1, player_red_2, player_blue_1, player_blue_2, table, resultat, updateTime, points_at_stake)
      .then((strRes : string) => {
        //alert('Kamp registreret');
        this.tournamentGameRounds[roundIndex].tournamentGames[+table - 1].id = 0;
        this.showGamesForPeriod(this.showMatchesPeriod);
        this.showRankingForPeriod(this.showRankingPeriod);
        this.getPlayerStatistics();
      }).catch(err => {
        this.addNoGameGenerationAlert('Noget gik galt i forsøget på at indmelde resultatet af kampen på dette bord. Tjek venligst at der er forbindelse til serveren og prøv så igen. Fejlen var: \'' + err + '\'', 'danger');

      })
    }

    getPlayerStatistics() {
      this.individualResultsComponent.getPlayerStatistics();
    }

    // TOURNAMENTGAMES RELATED
    getTournamentGameRounds(): void {
      //INTENSE - Her sætte gang i ranglisten for at udregne INTENSE
      // DEn skal vi lige vente på, før vi kan sætte tournamentGames helt?
      // Dvs. at tournamentgames her måske kun er noget midlertidigt, som så bliver hel/korrekt, når vi også har intenseKnowledge som area?
      this.noGameGenerationAlerts = [];
      this.setMySelectedPlayers();
      this.tournamentGameRoundService.getTournamentGameRounds(2, this.mySelectedPlayers).then((tournamentGameRounds : TournamentGameRound[] ) =>
      {

       this.tempTournamentGameRounds = tournamentGameRounds;
       //alert("this.tempTournamentGameRounds:" + this.tempTournamentGameRounds);
       //alert("this.tempTournamentGameRounds[0]:" + this.tempTournamentGameRounds[0]);
       //alert("this.tempTournamentGameRounds[0].tournamentGames:" + this.tempTournamentGameRounds[0].tournamentGames);
       console.log('så har jeg kampene')
       //alert("Husk at sætte tiderne, NÅR man indmelder")
       // Set the same timestamp for the download (so the order of clicking the buttons won't matter)
       var today = new Date()
       var dd : number = today.getDate();
       var mm : number = (today.getMonth()+1); //January is 0!
       var yyyy = today.getFullYear();

       var hours = today.getHours();
       //console.log("hours er: " + hours);
       //var hours2 = today.getUTCHours();
       //console.log("hours2 er: " + hours2);
       var newHOURS;
       newHOURS = hours;
       if(hours<10) {
           newHOURS='0'+hours;
       }

       var minutes = today.getMinutes();
       var newMINUTES;
       newMINUTES = minutes;

       if(minutes<10) {
           newMINUTES='0'+minutes;
       }

       var seconds = today.getSeconds();
       var newSECONDS;
       newSECONDS = seconds;
       if(seconds<10) {
           newSECONDS='0'+seconds;
       }

       var newToday;
       var newDD;
       newDD = dd;
       if(dd<10) {
           newDD='0'+dd;
       }
       var newMM;
       newMM = mm;
       if(mm<10) {
           newMM='0'+mm;
       }


//2016-10-22 23:21:30.0
       newToday = yyyy+'/'+newMM+'/'+newDD + " " + newHOURS + ":" + newMINUTES + ":" + newSECONDS + "." + today.getMilliseconds();
       console.log(newToday);
       //alert('1')
       //alert ('1 længde af this.tempTournamentGameRounds "' + this.tempTournamentGameRounds.length + '"')
       //alert ('1 længde af this.tempTournamentGameRounds[0].tournamentGames.length "' + this.tempTournamentGameRounds[0].tournamentGames.length + '"')
       for (let tournamentGameRound of this.tempTournamentGameRounds) {

          //alert('2')
          //alert ('2 længde af tournamentGameRound.tournamentGames "' + tournamentGameRound.tournamentGames + '"')
         for (let game of tournamentGameRound.tournamentGames) {
            //alert('3')
           game.lastUpdated = newToday;
           console.log("game:  + game")
         }
        //alert('5')
         // Start med at få data til intense

       }
       this.getRankingItemsForIntense();
     }
   ).catch(err => {
     console.log('der var fejl omkring generering af kampe');

         this.addNoGameGenerationAlert('Noget gik galt i forsøget på at generere kampe. Tjek venligst at der er forbindelse til serveren og prøv så igen. Fejlen var: \'' + err + '\'', 'danger');

       })
   ;


    }




    public playerAlerts:Array<Object> = [];

    public addPlayerAlert(msg: string, type: string):void {
      this.playerAlerts.push({msg: msg, type: type, closable: false});
    }

    public noGameGenerationAlerts:Array<Object> = [];

    public addNoGameGenerationAlert(msg: string, type: string):void {
      this.noGameGenerationAlerts.push({msg: msg, type: type, closable: false});
    }

    public noRankingListAlerts:Array<Object> = [];

    public addNoRankingListAlert(msg: string, type: string):void {
      this.noRankingListAlerts.push({msg: msg, type: type, closable: false});
    }

    public noGamesAlerts:Array<Object> = [];


    public addNoGamesAlert(msg: string, type: string):void {
      this.noGamesAlerts.push({msg: msg, type: type, closable: false});
    }

}
