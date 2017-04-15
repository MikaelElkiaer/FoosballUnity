import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Player } from '../model/player';

@Injectable()
export class SharedCommunicationService {
  // Observable string resources
  private playerForStatisticsChangedSource = new Subject<string>();
  private newMatchReportedSource = new Subject<string>();
  // Observable array ressources
  private selectedPlayersChangedSource = new Subject<Player[]>();
  private registeredPlayerChangedSource = new Subject<Player>();

  // Observable string streams
  playerForStatisticsChanged$ = this.playerForStatisticsChangedSource.asObservable();
  newMatchReported$ = this.newMatchReportedSource.asObservable();
  // Observable array streams
  selectedPlayersChanged$ = this.selectedPlayersChangedSource.asObservable();
  registeredPlayerChanged$ = this.registeredPlayerChangedSource.asObservable();

  // Service message command
  informAboutPlayerForStatisticsChanged(playerForStatistics: string) {
    this.playerForStatisticsChangedSource.next(playerForStatistics);
  }

  informAboutNewMatchReported(information: string) {
    this.newMatchReportedSource.next(information);
  }

  informAboutSelectedPlayersChanged(selectedPlayers: Player[]) {
    this.selectedPlayersChangedSource.next(selectedPlayers);
  }

  informAboutRegisteredPlayerChanged(registeredPlayer: Player) {
    this.registeredPlayerChangedSource.next(registeredPlayer);
  }
}
