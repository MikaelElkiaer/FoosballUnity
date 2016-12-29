import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SharedCommunicationService {
  // Observable string resources
  private playerForStatisticsChangedSource = new Subject<string>();
  private newMatchReportedSource = new Subject<string>();

  // Observable string streams
  playerForStatisticsChanged$ = this.playerForStatisticsChangedSource.asObservable();
  newMatchReported$ = this.newMatchReportedSource.asObservable();

  // Service message command
  informAboutPlayerForStatisticsChanged(playerForStatistics: string) {
    this.playerForStatisticsChangedSource.next(playerForStatistics);
  }

  informAboutNewMatchReported(information: string) {
    this.newMatchReportedSource.next(information);
  }
}
