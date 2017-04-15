import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { ViewChild } from '@angular/core';

import { Player } from './model/player';
import { PlayerService } from './services/player.service';

import { RankingItem } from './model/ranking-item';
import { RankingItemService } from './services/ranking-item.service';

import { Game } from './model/game';
import { GameService } from './services/game.service';

import { TournamentGame } from './model/tournament-game';

import { TournamentGameRound } from './model/tournament-game-round';
import { TournamentGameRoundService } from './services/tournament-game-round.service';

import { ConfigurationItem } from './model/configuration-item';
import { ConfigurationItemService } from './services/configuration-item.service';

import { IndividualResultsComponent } from './individual-results/individual-results.component';
import { AvailablePlayersComponent } from './available-players/available-players.component';
import { PreviousGamesComponent } from './previous-games/previous-games.component';
import { GamesOverviewComponent } from './games-overview/games-overview.component';

import { RfidRegistrationComponent } from  './rfid-registration/rfid-registration.component';

import { SharedCommunicationService } from './services/shared-communication.service';

import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [PlayerService, RankingItemService, GameService, TournamentGameRoundService, SharedCommunicationService, ConfigurationItemService]
})
export class AppComponent {

  @ViewChild(AvailablePlayersComponent)
  private availablePlayersComponent: AvailablePlayersComponent;

  @ViewChild(GamesOverviewComponent)
  private gamesOverviewComponent: GamesOverviewComponent;

  resultBackFromGettingPlayers = false;
  experiencedProblemWithGettingPlayers = false;

  promise : any;

  playerForStatistics : string;

  players() { return new Array()}
  selectedPlayers : Player[];

  constructor(
    private playerService: PlayerService,
    private rankingItemService: RankingItemService,
    private gameService: GameService,
    private tournamentGameRoundService: TournamentGameRoundService,
    private sharedCommunicationService: SharedCommunicationService,
    private configurationItemService: ConfigurationItemService
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
    this.getConfigurationItems();
  }

  ngAfterViewInit() {
      setTimeout(() => this.players = () => this.availablePlayersComponent.players, 0);
  }

  getPlayers(): void {
      this.playerService.getPlayers().then(
     (players : Player[]) =>
     {
       this.resultBackFromGettingPlayers = true;
       this.experiencedProblemWithGettingPlayers = false;
       this.availablePlayersComponent.setPlayers(players);
     }
   ).catch(err => {
       this.resultBackFromGettingPlayers = true;
       this.experiencedProblemWithGettingPlayers = true;
       return Promise.reject(err.message || err);
     });
   }

   getConfigurationItems(): void {
       this.configurationItemService.getConfigurationItems().then(
      (configurationItems : ConfigurationItem[]) =>
      {
        this.gamesOverviewComponent.setConfigurationItems(configurationItems);
      }
    ).catch(err => {
        console.log("Damn, an error occured, when getting configuration items")
        return Promise.reject(err.message || err);
      });
    }
}
