import { Component, OnInit } from '@angular/core';

import { RankingItem } from './ranking-item';
import { RankingItemService } from './ranking-item.service';

import { Game } from './game';
import { GameService } from './game.service';

import { Player } from './player';

import { TournamentGame } from './tournament-game';

import { TournamentGameRound } from './tournament-game-round';
import { TournamentGameRoundService } from './tournament-game-round.service';

import { SharedCommunicationService } from './shared-communication.service';

@Component({
  selector: 'games-overview',
  templateUrl: './games-overview.component.html',
  styleUrls: ['./games-overview.component.css']
})
export class GamesOverviewComponent implements OnInit {

  soundFire:any;
  oneRoundAtATime = true;
  intenseArray: string[];

  rankingItemsForIntense: RankingItem[];
  currentPositionForPlayer: number[];
  currentPointsForPlayer: number[];

  tempTournamentGameRounds: TournamentGameRound[];
  tournamentGameRounds: TournamentGameRound[];

  playerForStatistics : string;


  selectedPlayers: Player[];
  //getMySelectedPlayers() { return null };

  public noGameGenerationAlerts:Array<Object> = [];

  public addNoGameGenerationAlert(msg: string, type: string):void {
    this.noGameGenerationAlerts.push({msg: msg, type: type, closable: false});
  }

  constructor(
    private rankingItemService: RankingItemService,
    private gameService: GameService,
    private tournamentGameRoundService: TournamentGameRoundService,
    private sharedCommunicationService: SharedCommunicationService

  ) {
    this.soundFire= new Audio("/assets/sounds/fire.wav");
    sharedCommunicationService.playerForStatisticsChanged$.subscribe(
      playerForStatistics => {
        this.playerForStatistics = playerForStatistics;
      }
    )
    sharedCommunicationService.selectedPlayersChanged$.subscribe(
      selectedPlayers => {
        this.selectedPlayers = selectedPlayers;
      }
    )
   }

  ngOnInit() {
  }

  getNumberOfSelectedPlayers() : string {
    if (this.selectedPlayers == null) {
      return "0";
    } else {
      return this.selectedPlayers.length.toString();
    }
  }

  getImageUrl(playerName : string) : string {
    if (playerName == null) {
      return "assets/img/Wildcard.jpg";
    } else {
      return "assets/img/" + playerName + ".jpg";
    }
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
      //NIKLHUSK - Når ny kamp er indmeldt, skal vi vise nyt i bunden - this.showGamesForPeriod(this.showMatchesPeriod);
      //NIKLHUSK - Dette måske bare væk? this.showRankingForPeriod(this.showRankingPeriod);
      //NIKLHUSK - Når ny kamp, så også vise ny personlig statistick for valgt spiller - this.getPlayerStatistics();
      this.informAboutNewMatchReported(strRes);
    }).catch(err => {
      this.addNoGameGenerationAlert('Noget gik galt i forsøget på at indmelde resultatet af kampen på dette bord. Tjek venligst at der er forbindelse til serveren og prøv så igen. Fejlen var: \'' + err + '\'', 'danger');

    })
  }

  changePlayerForStatistics(playerForStatistics: string) {
    this.sharedCommunicationService.informAboutPlayerForStatisticsChanged(playerForStatistics);
  }
  informAboutNewMatchReported(information : string) {
    this.sharedCommunicationService.informAboutNewMatchReported(information);
  }

  // TOURNAMENTGAMES RELATED
  getTournamentGameRounds(): void {
    //INTENSE - Her sætte gang i ranglisten for at udregne INTENSE
    // DEn skal vi lige vente på, før vi kan sætte tournamentGames helt?
    // Dvs. at tournamentgames her måske kun er noget midlertidigt, som så bliver hel/korrekt, når vi også har intenseKnowledge som area?
    this.noGameGenerationAlerts = [];
    console.log("selectedPlayers: " + this.selectedPlayers);
    this.tournamentGameRoundService.getTournamentGameRounds(2, this.selectedPlayers).then((tournamentGameRounds : TournamentGameRound[] ) =>
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



}
