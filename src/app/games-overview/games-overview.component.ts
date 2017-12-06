import { Component, OnInit } from '@angular/core';

import { RankingItem } from '../model/ranking-item';
import { RankingItemService } from '../services/ranking-item.service';
import { Observable } from 'rxjs/Observable';

import { Game } from '../model/game';
import { GameService } from '../services/game.service';

import { Player } from '../model/player';

import { TournamentGame } from '../model/tournament-game';

import { ConfigurationItem } from '../model/configuration-item';

import { TournamentGameRound } from '../model/tournament-game-round';
import { TournamentGameRoundService } from '../services/tournament-game-round.service';

import { SharedCommunicationService } from '../services/shared-communication.service';

import { ProgressbarModule } from 'ngx-bootstrap';

@Component({
  selector: 'games-overview',
  templateUrl: './games-overview.component.html',
  styleUrls: ['./games-overview.component.css']
})
export class GamesOverviewComponent implements OnInit {

  soundFire:any;
  oneRoundAtATime = true;
  intenseArray: string[];

  pointsToWinForTopTeam: string[];
  pointsToWinForBottomTeam: string[];

  rankingItemsForIntense: RankingItem[];
  currentPositionForPlayer: number[];
  currentPointsForPlayer: number[];

  tempTournamentGameRounds: TournamentGameRound[];
  tournamentGameRounds: TournamentGameRound[];

  playerForStatistics : string;

  selectedPlayers: Player[];
  configurationItems : ConfigurationItem[];

  nameTable1 = "";
  nameTable2 = "";
  nameTable3 = "";

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

  setConfigurationItems(configurationItems : ConfigurationItem[]) {
    this.configurationItems = configurationItems;
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
        this.pointsToWinForTopTeam = new Array(this.tempTournamentGameRounds[0].tournamentGames.length);
        this.pointsToWinForBottomTeam = new Array(this.tempTournamentGameRounds[0].tournamentGames.length);
        this.currentPointsForPlayer = new Array();
        this.currentPositionForPlayer = new Array();
        var firstTournamentGameRound = this.tempTournamentGameRounds[0];

      this.rankingItemService.getRankingItems('alltime').subscribe(rankingItems => {

          this.rankingItemsForIntense = rankingItems;

          var i = 0;
          for (let game of firstTournamentGameRound.tournamentGames) {

            var useNewMethod = true;
            if (useNewMethod == true) {
              this.intenseArray[i] = "none";


              // Look at all rankingItems
              for (let rankingItem of this.rankingItemsForIntense) {
                //If the rankingItem relates to our players
                if (rankingItem.name == game.player_red_1 ||
                    rankingItem.name == game.player_red_2 ||
                    rankingItem.name == game.player_blue_1 ||
                    rankingItem.name == game.player_blue_2) {

                    // Save into two arrays for "current points and current position"
                    this.currentPointsForPlayer[rankingItem.name.toLocaleLowerCase()] = rankingItem.points;
                    this.currentPositionForPlayer[rankingItem.name.toLocaleLowerCase()] = rankingItem.position;
                }
              }

              if(game.player_red_1 != null && this.currentPointsForPlayer[game.player_red_1.toLocaleLowerCase()] == null) {
                console.log("ingen for r1")
                this.currentPointsForPlayer[game.player_red_1.toLocaleLowerCase()] = 1500;
              }
              if(game.player_red_2 != null && this.currentPointsForPlayer[game.player_red_2.toLocaleLowerCase()] == null) {
                                console.log("ingen for r2")
                this.currentPointsForPlayer[game.player_red_2.toLocaleLowerCase()] = 1500;
              }
              if(game.player_blue_1 != null && this.currentPointsForPlayer[game.player_blue_1.toLocaleLowerCase()] == null) {
                                console.log("ingen for b1")
                this.currentPointsForPlayer[game.player_blue_1.toLocaleLowerCase()] = 1500;
              }
              if(game.player_blue_2 != null && this.currentPointsForPlayer[game.player_blue_2.toLocaleLowerCase()] == null) {
                                console.log("ingen for b2")
                this.currentPointsForPlayer[game.player_blue_2.toLocaleLowerCase()] = 1500;
              }

              // Lets calculate for top team winning
              console.log("blue 1:" + game.player_blue_1);
              console.log("blue 2:" + game.player_blue_2);
              if (game.player_blue_2 == null) {
                console.log("Nummer 2 var null")
              }

              var blueEloRanking;
              var redEloRanking;

              if (game.player_red_2 != null) {
                redEloRanking = (this.currentPointsForPlayer[game.player_red_1.toLocaleLowerCase()] + this.currentPointsForPlayer[game.player_red_2.toLocaleLowerCase()]) / 2;
              } else {
                redEloRanking = this.currentPointsForPlayer[game.player_red_1.toLocaleLowerCase()];
              }
              redEloRanking = parseInt(redEloRanking)
              console.log("redEloRanking: " + redEloRanking)


              if (game.player_blue_2 != null) {
                blueEloRanking = (this.currentPointsForPlayer[game.player_blue_1.toLocaleLowerCase()] + this.currentPointsForPlayer[game.player_blue_2.toLocaleLowerCase()]) / 2;
              } else {
                blueEloRanking = this.currentPointsForPlayer[game.player_blue_1.toLocaleLowerCase()];
              }
              blueEloRanking = parseInt(blueEloRanking)
              console.log("blueEloRanking: " + blueEloRanking)


              var redDiff = blueEloRanking - redEloRanking;

              var redWe = (1 / (Math.pow(10, ( redDiff / 1000)) + 1 ))
              var blueWe = 1 - redWe;

              console.log("redWe: " + redWe)
              console.log("blueWe: " + blueWe)

              var  KFactor = 50;

              var totalForRedWin = (KFactor * (1 - redWe))
              var totalForRedWinInt = parseInt("" + totalForRedWin)
              console.log("if red wins: " + totalForRedWin);
              //logger.info("if red looses: " + (KFactor * (0 - redWe)))

              var totalForBlueWin = (KFactor * (1 - blueWe))
              var totalForBlueWinInt = parseInt("" + totalForBlueWin)
              console.log("if blue wins: " + totalForBlueWin)
              //logger.info("if blue looses: " + (KFactor * (0 - blueWe)))

              if ((totalForBlueWinInt + totalForRedWinInt) < KFactor) {
                if (totalForBlueWinInt < totalForRedWinInt) {
                  totalForBlueWinInt = KFactor - totalForRedWinInt
                } else {
                  totalForRedWinInt = KFactor - totalForBlueWinInt
                }
              }

              // This is the points to win or lose
              // Please note that in a case of a draw, none of these numbers are used
              this.pointsToWinForTopTeam[i] = "" + totalForRedWinInt;
              this.pointsToWinForBottomTeam[i] = "" + totalForBlueWinInt;

              i++;
            } else {
              // OLD Variables for counting points for teams
              var combinedPointsTeamRed = 0;
              var combinedPointsTeamBlue = 0;

              // Look at all rankingItems
              for (let rankingItem of this.rankingItemsForIntense) {
                //If the rankingItem relates to our players
                if (rankingItem.name == game.player_red_1 ||
                    rankingItem.name == game.player_red_2 ||
                    rankingItem.name == game.player_blue_1 ||
                    rankingItem.name == game.player_blue_2) {

                    // Save into two arrays for "current points and current position"
                    this.currentPointsForPlayer[rankingItem.name.toLocaleLowerCase()] = rankingItem.points;
                    this.currentPositionForPlayer[rankingItem.name.toLocaleLowerCase()] = rankingItem.position;
                }

                // Add to points for Red
                if (rankingItem.name == game.player_red_1 || (rankingItem.name == game.player_red_2)) {
                  combinedPointsTeamRed = combinedPointsTeamRed + rankingItem.points;

                }
                // Add to points for Blue
                if (rankingItem.name == game.player_blue_1 || (rankingItem.name == game.player_blue_2)) {
                  combinedPointsTeamBlue = combinedPointsTeamBlue + rankingItem.points;
                }
              }
              // Check whether the point difference is more than 5 poins in either direction
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
          }
          // Make a sound, if at least one intense was found
          if (intenseFound) {
            this.soundFire.play();
          }
        },
        err => {
          console.log('Der var fejl omkring generering af kampe');

          this.addNoGameGenerationAlert('Noget gik galt i forsøget på at generere kampe. Tjek venligst at der er forbindelse til serveren og prøv så igen. Fejlen var: \'' + err + '\'', 'danger');
          this.tempTournamentGameRounds = null;
        });
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
    .subscribe(strRes => {

      this.tournamentGameRounds[roundIndex].tournamentGames[+table - 1].id = 0;
      this.informAboutNewMatchReported(strRes);
    },
    err => {
      this.addNoGameGenerationAlert('Noget gik galt i forsøget på at indmelde resultatet af kampen på dette bord. Tjek venligst at der er forbindelse til serveren og prøv så igen. Fejlen var: \'' + err + '\'', 'danger');
    });
  }

  changePlayerForStatistics(playerForStatistics: string) {
    this.sharedCommunicationService.informAboutPlayerForStatisticsChanged(playerForStatistics);
  }

  informAboutNewMatchReported(information : string) {
    this.sharedCommunicationService.informAboutNewMatchReported(information);
  }

  getTournamentGameRounds(): void {
    this.noGameGenerationAlerts = [];
    // Default is 1 table
    var numberOfTables = 1;
    for (let configurationItem of this.configurationItems) {
      if (configurationItem.name == "numberOfTables") {
        numberOfTables = +configurationItem.value;
      }


      if (configurationItem.name == "nameTable1") {
        this.nameTable1 = configurationItem.value;
      }
      if (configurationItem.name == "nameTable2") {
       this.nameTable2 = configurationItem.value;
      }
      if (configurationItem.name == "nameTable3") {
        this.nameTable3 = configurationItem.value;
      }
    }

    this.tournamentGameRoundService.getTournamentGameRounds(numberOfTables, this.selectedPlayers)
      .subscribe(tournamentGameRounds => {
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
       }, err => {
         console.log('der var fejl omkring generering af kampe');
         this.addNoGameGenerationAlert('Noget gik galt i forsøget på at generere kampe. Tjek venligst at der er forbindelse til serveren og prøv så igen. Fejlen var: \'' + err + '\'', 'danger');
       });
     }
}
