import { Component, Input, OnInit  } from '@angular/core';

import { Game } from '../model/game';
import { GameService } from '../services/game.service';
import { Player } from '../model/player';

import { RankingItem } from '../model/ranking-item';
import { RankingItemService } from '../services/ranking-item.service';

import { SharedCommunicationService } from '../services/shared-communication.service';
import { Subscription } from 'rxjs/Subscription';

import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';

@Component ({
  selector: 'individualResults',
  template: `
    <div class="form-group">
      <label for="sel1">Vælg spiller for at se point-udvikling for seneste 10 kampe:</label>
      <select class="form-control" id="sel1"  [(ngModel)]="playerForStatistics"  (ngModelChange)="changePlayerForStatistics(playerForStatistics);getPlayerStatistics();">

        <option *ngFor="let player of players">{{player.name}}</option>
      </select>
    </div>
    <alert *ngFor="let alert of noPlayerGamesAlerts;let i = index" [type]="alert.type">
      {{ alert?.msg }}
    </alert>
    <div style="display: block;" >
      <canvas width="400" height="400" *ngIf="lineChartData.length > 0" baseChart
                  [datasets]="lineChartData"
                  [labels]="lineChartLabels"
                  [options]="lineChartOptions"
                  [colors]="lineChartColors"
                  [legend]="lineChartLegend"
                  [chartType]="lineChartType"></canvas>
    </div>
  `
})

export class IndividualResultsComponent implements OnInit  {
  @Input()
  players: Player[];

  playerForStatistics: string;
  playerGames: Game[];
  playerPoints: number[];

  lineChartLegend:boolean = true;
  lineChartType:string = 'line';

  lineChartData:Array<any> = [];

  lineChartLabels:Array<any> = [];
  lineChartOptions:any = {
    animation: false,
    responsive: false
  };
  lineChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

  public noPlayerGamesAlerts:Array<Object> = [];

  subscriptionPlayerForStatistics : Subscription ;
  subscriptionNewMatchReported : Subscription ;

  constructor(
    private rankingItemService: RankingItemService,
    private gameService: GameService,
    private sharedCommunicationService: SharedCommunicationService
  ) {
    this.subscriptionPlayerForStatistics = sharedCommunicationService.playerForStatisticsChanged$.subscribe(
      playerForStatistics => {
        this.playerForStatistics = playerForStatistics;
        this.getPlayerStatistics();
      }
    )
    this.subscriptionNewMatchReported = sharedCommunicationService.newMatchReported$.subscribe(
      information => {
        this.getPlayerStatistics();
      }
    )
  }

  ngOnInit() {
    setTimeout(() => {
      if (this.players.length > 0) {
        this.playerForStatistics = this.players[0].name;
        this.changePlayerForStatistics(this.playerForStatistics);
        this.getPlayerStatistics();
      }
    }, 1000);

  }

  public addNoPlayerGamesAlert(msg: string, type: string):void {
    this.noPlayerGamesAlerts.push({msg: msg, type: type, closable: false});
  }

  changePlayerForStatistics(playerForStatistics: string) {
    this.sharedCommunicationService.informAboutPlayerForStatisticsChanged(playerForStatistics);
  }

  getPlayerStatistics() : void {
    this.noPlayerGamesAlerts = [];
    this.playerGames = null;
    this.playerPoints = [];
    var endPointsForPlayer;
    endPointsForPlayer = 0;

    this.rankingItemService.getRankingItems('alltime').
    then((rankingItems : RankingItem[]) => {

      for (let rankingItem of rankingItems) {
        if (rankingItem.name == this.playerForStatistics) {
          endPointsForPlayer = rankingItem.points;
          break;
        }
      }

        this.gameService.getGames(this.playerForStatistics).then(
          (games : Game[] ) => {
            this.playerGames = games;
            var playerGamesInReverse = this.playerGames.reverse();
            var playerTeam;
            var points;
            this.playerPoints = [];
            this.playerPoints.push(0);
            for (let game of this.playerGames) {
              if (game.player_red_1 == this.playerForStatistics || game.player_red_2 == this.playerForStatistics ) {
                playerTeam = 'red';
              } else {
                playerTeam = 'blue';
              }
              if (game.match_winner == 'red' && playerTeam == 'red') {
                points = game.points_at_stake;
                } else if (game.match_winner == 'red' && playerTeam == 'blue') {
                points = -1* game.points_at_stake;
              } else if (game.match_winner == 'blue' && playerTeam == 'blue') {
                points = game.points_at_stake;
              } else if (game.match_winner == 'blue' && playerTeam == 'red') {
                points = -1* game.points_at_stake;
              } else {
                points = 0;
              }
              var currentPoints = this.playerPoints[this.playerPoints.length - 1];
              this.playerPoints.push(points + currentPoints);
            }

            var diff = 0;
            if (this.playerPoints.length > 0) {
              diff = endPointsForPlayer - this.playerPoints[this.playerPoints.length - 1];
            }

            for (var j = 0; j < this.playerPoints.length; j++) {
              this.playerPoints[j] = this.playerPoints[j] + diff;
            }

            let _lineChartData:Array<any> = new Array(1);

            _lineChartData[0] = {data: new Array(this.playerPoints.length), label: this.playerForStatistics};
            for (let j = 0; j < this.playerPoints.length; j++) {
              _lineChartData[0].data[j] = this.playerPoints[j];

            }
            this.lineChartLabels = [''];


            for (let k = 1; k <= playerGamesInReverse.length; k++) {
              this.lineChartLabels.push("#" + playerGamesInReverse[k - 1].id);
            }
            this.lineChartData = _lineChartData;
          } )
          .catch(err => {
            console.log('Problemer med at hente spiller-kampene for spilleren ' + this.playerForStatistics);
            this.addNoPlayerGamesAlert('Kunne ikke hente spiller-kampene for spilleren ' + this.playerForStatistics + '. Tjek evt. om der er problemer med adgangen til serveren?', 'danger');
          });
        }).catch(err => {
          console.log('Problemer med at hente spiller-kampene for spilleren ' + this.playerForStatistics);
          this.addNoPlayerGamesAlert('Kunne ikke hente spiller-kampene for spilleren ' + this.playerForStatistics + '. Tjek evt. om der er problemer med adgangen til serveren?', 'danger');
        });
  }
}
