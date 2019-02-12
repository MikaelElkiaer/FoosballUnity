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

import { AlertModule } from 'ngx-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [PlayerService, RankingItemService, GameService, TournamentGameRoundService, 
    SharedCommunicationService, ConfigurationItemService]
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild(AvailablePlayersComponent)
  private availablePlayersComponent: AvailablePlayersComponent;

  @ViewChild(GamesOverviewComponent)
  private gamesOverviewComponent: GamesOverviewComponent;

  resultBackFromGettingPlayers = false;
  experiencedProblemWithGettingPlayers = false;

  promise: any;

  playerForStatistics: string;
  selectedPlayers: Player[];

  players() { return new Array()}

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
      this.playerService.getPlayers().subscribe(players => {
       this.resultBackFromGettingPlayers = true;
       this.experiencedProblemWithGettingPlayers = false;
       this.availablePlayersComponent.setPlayers(players);
       this.rankingItemService.getRankingItems('month').subscribe(
         rankItems => {
          const activePlayers = [];
          rankItems.forEach(item => {
            activePlayers.push(players.filter(player => {
              return player.name === item.name;
            })[0]);
          });
          console.log('Setting Active players', activePlayers);
          this.availablePlayersComponent.setActivePlayers(activePlayers);
         }
       );
       this.availablePlayersComponent.showAllPlayers();
     },
     err => {
      this.resultBackFromGettingPlayers = true;
      this.experiencedProblemWithGettingPlayers = true;
      return Promise.reject(err.message || err);
    });
   }

   getConfigurationItems(): void {
       this.configurationItemService.getConfigurationItems().subscribe(
         configurationItems => {this.gamesOverviewComponent.setConfigurationItems(configurationItems)},
         err => {
           console.log('Damn, an error occured, when getting configuration items');
           return Promise.reject(err.message || err);
         }
       );
    }
}
