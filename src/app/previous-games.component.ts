import { Component, OnInit } from '@angular/core';

import { Game } from './game';
import { GameService } from './game.service';

import { SharedCommunicationService } from './shared-communication.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'previous-games',
  templateUrl: './previous-games.component.html',
  styleUrls: ['./previous-games.component.css']
})
export class PreviousGamesComponent implements OnInit {

  showMatchesPeriod = 'hour';

  public noGamesAlerts:Array<Object> = [];

  games: Game[];

  tempSpiller2 : string;

  subscription: Subscription;

  playerForStatistics : string;

  constructor(
    private gameService: GameService,
    private sharedCommunicationService: SharedCommunicationService
  ) {
    this.subscription = sharedCommunicationService.playerForStatisticsChanged$.subscribe(
      playerForStatistics => {
        this.playerForStatistics = playerForStatistics;
      }
    )
  }

  ngOnInit() {
    this.showGamesForPeriod(this.showMatchesPeriod);
  }

  getImageUrl(playerName : string) : string {
    if (playerName == null) {
      return "assets/img/Wildcard.jpg";
    } else {
      return "assets/img/" + playerName + ".jpg";
    }
  }

  public addNoGamesAlert(msg: string, type: string):void {
    this.noGamesAlerts.push({msg: msg, type: type, closable: false});
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

  changePlayerForStatistics(playerForStatistics: string) {
    this.sharedCommunicationService.informAboutPlayerForStatisticsChanged(playerForStatistics);
  }

}
