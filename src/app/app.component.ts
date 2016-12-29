import { Component } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';
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
import { AvailablePlayersComponent } from './available-players.component';
import { PreviousGamesComponent } from './previous-games.component';
import { GamesOverviewComponent } from './games-overview.component';

import { SharedCommunicationService } from './shared-communication.service';

import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [PlayerService, RankingItemService, GameService, TournamentGameRoundService, SharedCommunicationService]
})
export class AppComponent {

  @ViewChild(IndividualResultsComponent)
  private individualResultsComponent: IndividualResultsComponent;

  @ViewChild(AvailablePlayersComponent)
  private availablePlayersComponent: AvailablePlayersComponent;

  @ViewChild(PreviousGamesComponent)
  private previousGamesComponent: PreviousGamesComponent;

  @ViewChild(GamesOverviewComponent)
  private gamesOverviewComponent: GamesOverviewComponent;

  title = 'app works!';

  resultBackFromGettingPlayers = false;
  experiencedProblemWithGettingPlayers = false;

  //playerForStatistics = null;
  promise:any;


  //tempSpiller:string;
  playerForStatistics : string;

  constructor(
    private playerService: PlayerService,
    private rankingItemService: RankingItemService,
    private gameService: GameService,
    private tournamentGameRoundService: TournamentGameRoundService,
    private sharedCommunicationService: SharedCommunicationService
  ) {

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

  ngOnInit(): void {
    this.getPlayers();
  }

  //playerForStatistics() { return 'NotSetYet';}
  players() { return new Array()}
  selectedPlayers : Player[];

  ngAfterViewInit() {
    console.log("I AFTERVIEW START")
      //setTimeout(() => this.playerForStatistics = () => this.individualResultsComponent.playerForStatistics, 0);
      //setTimeout(() => this.previousGamesComponent.playerForStatistics = () => this.individualResultsComponent.playerForStatistics, 0);
      setTimeout(() => this.players = () => this.availablePlayersComponent.players, 0);
      //setTimeout(() => this.selectedPlayers = () => this.availablePlayersComponent.selectedPlayers, 0);
      //setTimeout(() => this.gamesOverviewComponent.selectedPlayers = () => this.availablePlayersComponent.selectedPlayers, 0);
      //setTimeout(() => this.gamesOverviewComponent.getMySelectedPlayers = () => this.availablePlayersComponent.getMySelectedPlayers, 0);
      console.log("I AFTERVIEW SLUT")
  }

  // PLAYER RELATED

  getImageUrl(playerName : string) : string {
    if (playerName == null) {
      return "assets/img/Wildcard.jpg";
    } else {
      return "assets/img/" + playerName + ".jpg";
    }
  }

  getPlayers(): void {
    //alert("starting");
      this.playerService.getPlayers().then(
     (players : Player[]) =>
     {
       //this.problemWithGettingPlayers = false;
       this.resultBackFromGettingPlayers = true;
       //alert("1");
       this.experiencedProblemWithGettingPlayers = false;
       this.availablePlayersComponent.setPlayers(players);
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


    //getPlayerStatistics() {
    //  this.individualResultsComponent.getPlayerStatistics();
    //}

    //setPlayerForStatistics(player: string) {
    //  this.individualResultsComponent.setPlayerForStatistics(player);
    //}

    changePlayerForStatistics(playerForStatistics: string) {
      this.sharedCommunicationService.informAboutPlayerForStatisticsChanged(playerForStatistics);
    }
    informAboutNewMatchReported(information : string) {
      this.sharedCommunicationService.informAboutNewMatchReported(information);
    }



}
