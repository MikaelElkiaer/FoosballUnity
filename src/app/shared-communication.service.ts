import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SharedCommunicationService {
  // Observable string resource
  private playerForStatisticsChangedSource = new Subject<string>();

  // Observable string stream
  playerForStatisticsChanged$ = this.playerForStatisticsChangedSource.asObservable();

  // Service message command
  informAboutPlayerForStatisticsChanged(playerForStatistics: string) {
    this.playerForStatisticsChangedSource.next(playerForStatistics);
  }
}
