import { Component, OnInit } from '@angular/core';

import { RankingItem } from '../model/ranking-item';
import { RankingItemService } from '../services/ranking-item.service';

import { Game } from '../model/game';
import { GameService } from '../services/game.service';

import { Player } from '../model/player';

import { TournamentGame } from '../model/tournament-game';

import { TournamentGameRound } from '../model/tournament-game-round';
import { TournamentGameRoundService } from '../services/tournament-game-round.service';

import { SharedCommunicationService } from '../services/shared-communication.service';

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
      return "assets/img/" + playerName.toLocaleLowerCase() + ".jpg";
    }
  }

  public getRankingItemsForIntense(): void {
    var intenseFound = false;
    if (this.oneRoundAtATime) {
        this.intenseArray = new Array(this.tempTournamentGameRounds[0].tournamentGames.length);
        this.currentPointsForPlayer = new Array();
        this.currentPositionForPlayer = new Array();
        var firstTournamentGameRound = this.tempTournamentGameRounds[0];

      this.rankingItemService.getRankingItems('alltime').
      then((rankingItems : RankingItem[]) => {
          this.rankingItemsForIntense = rankingItems;

          var i = 0;
          for (let game of firstTournamentGameRound.tournamentGames) {
            var combinedPointsTeamRed = 0;
            var combinedPointsTeamBlue = 0;
            for (let rankingItem of this.rankingItemsForIntense) {
              if (rankingItem.name == game.player_red_1 ||
                  rankingItem.name == game.player_red_2 ||
                  rankingItem.name == game.player_blue_1 ||
                  rankingItem.name == game.player_blue_2) {

                  this.currentPointsForPlayer[rankingItem.name.toLocaleLowerCase()] = rankingItem.points;
                  this.currentPositionForPlayer[rankingItem.name.toLocaleLowerCase()] = rankingItem.position;
              }
              if (rankingItem.name == game.player_red_1 || (rankingItem.name == game.player_red_2)) {
                combinedPointsTeamRed = combinedPointsTeamRed + rankingItem.points;

              }
              if (rankingItem.name == game.player_blue_1 || (rankingItem.name == game.player_blue_2)) {
                combinedPointsTeamBlue = combinedPointsTeamBlue + rankingItem.points;
              }
            }
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
        })
        .catch(err => {
          console.log('Der var fejl omkring generering af kampe');

          this.addNoGameGenerationAlert('Noget gik galt i forsøget på at generere kampe. Tjek venligst at der er forbindelse til serveren og prøv så igen. Fejlen var: \'' + err + '\'', 'danger');
          this.tempTournamentGameRounds = null;
        })
    }

    this.tournamentGameRounds = this.tempTournamentGameRounds;
    this.tempTournamentGameRounds = null;
  }

  indmeldResultat(roundIndex : number, player_red_1 : string, player_red_2 : string, player_blue_1 : string, player_blue_2 : string, table: string, resultat : string,  updateTime: string, points_at_stake: number): void {
    this.noGameGenerationAlerts = [];
    if (this.tournamentGameRounds[roundIndex].tournamentGames[+table - 1].id == 0) {
      alert('Du kan ikke indmelde samme kamp 2 gange!');
      return;
    }

    this.gameService.indmeldResultat(player_red_1, player_red_2, player_blue_1, player_blue_2, table, resultat, updateTime, points_at_stake)
    .then((strRes : string) => {

      this.tournamentGameRounds[roundIndex].tournamentGames[+table - 1].id = 0;
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

  getTournamentGameRounds(): void {
    this.noGameGenerationAlerts = [];

    this.tournamentGameRoundService.getTournamentGameRounds(3, this.selectedPlayers).then((tournamentGameRounds : TournamentGameRound[] ) =>
    {

     this.tempTournamentGameRounds = tournamentGameRounds;


     var today = new Date()
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
     newToday = yyyy+'/'+newMM+'/'+newDD + " " + newHOURS + ":" + newMINUTES + ":" + newSECONDS + "." + today.getMilliseconds();

     for (let tournamentGameRound of this.tempTournamentGameRounds) {
       for (let game of tournamentGameRound.tournamentGames) {
         game.lastUpdated = newToday;
         console.log("game:  + game")
       }
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
