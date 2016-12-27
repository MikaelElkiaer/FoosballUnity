import { Component, Input } from '@angular/core';

import { Game } from './game';
import { GameService } from './game.service';
import { Player } from './player';

import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';

@Component ({
  selector: 'individualResults',
  template: `
    <div class="form-group">
    <h1>Husk at  sikre fælles playerForStatistics</h1>
      <label for="sel1">Vælg spiller for at se point-udvikling for seneste 10 kampe:</label>
      <select class="form-control" id="sel1" [(ngModel)]="playerForStatistics"  (ngModelChange)="getPlayerStatistics();" >

        <option *ngFor="let player of players">{{player.name}}</option>
      </select>
    </div>
    <alert *ngFor="let alert of noPlayerGamesAlerts;let i = index" [type]="alert.type">
      {{ alert?.msg }}
    </alert>
    <div style="display: block;" >
      <canvas width="500" height="400" *ngIf="lineChartData.length > 0" baseChart
                  [datasets]="lineChartData"
                  [labels]="lineChartLabels"
                  [options]="lineChartOptions"
                  [colors]="lineChartColors"
                  [legend]="lineChartLegend"
                  [chartType]="lineChartType"></canvas>
    </div>
  `,
  providers: [GameService]
})

export class IndividualResultsComponent {
  @Input()
  players: Player[];

  @Input()
  playerForStatistics = null;

  playerGames: Game[];
  playerPoints: number[];


  lineChartLegend:boolean = true;
  lineChartType:string = 'line';

  // lineChart
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

  constructor(
    private gameService: GameService
  ) {

  }

  public addNoPlayerGamesAlert(msg: string, type: string):void {
    this.noPlayerGamesAlerts.push({msg: msg, type: type, closable: false});
  }

  getPlayerStatistics() : void {
    this.noPlayerGamesAlerts = [];
    this.playerGames = null;
    this.playerPoints = [];

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
            console.log("1")
          } else if (game.match_winner == 'red' && playerTeam == 'blue') {
            points = -1* game.points_at_stake;
                console.log("2")
          } else if (game.match_winner == 'blue' && playerTeam == 'blue') {
          points = game.points_at_stake;
              console.log("3")
          } else if (game.match_winner == 'blue' && playerTeam == 'red') {
              points = -1* game.points_at_stake;
                  console.log("4")
          } else {
            points = 0;
                console.log("5")
          }
          var currentPoints = this.playerPoints[this.playerPoints.length - 1];
          this.playerPoints.push(points + currentPoints);

        }
        //this.playerPoints.reverse();

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
        //this.playerGames.unshift(null);
      } )
      .catch(err => {
        console.log('Problemer med at hente spiller-kampene for spilleren ' + this.playerForStatistics);
        this.addNoPlayerGamesAlert('Kunne ikke hente spiller-kampene for spilleren ' + this.playerForStatistics + '. Tjek evt. om der er problemer med adgangen til serveren?', 'danger');
      });
  }
}
