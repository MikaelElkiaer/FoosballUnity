import { Component, OnInit, Input } from '@angular/core';

import { SharedCommunicationService } from '../services/shared-communication.service';
import { Subscription } from 'rxjs/Subscription';

import { RankingItem } from '../model/ranking-item';
import { RankingItemService } from '../services/ranking-item.service';

@Component({
  selector: 'FixedRankingListComponent',
  templateUrl: './fixed-ranking-list.component.html',
  styleUrls: ['./fixed-ranking-list.component.scss']
})
export class FixedRankingListComponent implements OnInit {
  @Input()
  period: string;
  soundFanfare:any;

  showRankingPeriod = 'hour';

  public noRankingListAlerts:Array<Object> = [];

  subscriptionPlayerForStatistics : Subscription ;
  subscriptionNewMatchReported : Subscription ;

  playerForStatistics : string;

  rankingItems: RankingItem[];
  currentRankingItemsForRankingLeaderStatus: RankingItem[];
  previousTopRankedRankingItems: RankingItem[];
  currentTopRankedRankingItems: RankingItem[];

  constructor(
    private rankingItemService: RankingItemService,
    private sharedCommunicationService: SharedCommunicationService
  ) {
    this.soundFanfare= new Audio("/assets/sounds/fanfare.wav");
    this.subscriptionPlayerForStatistics = sharedCommunicationService.playerForStatisticsChanged$.subscribe(
      playerForStatistics => {
        this.playerForStatistics = playerForStatistics;
      }
    )
    this.subscriptionNewMatchReported = sharedCommunicationService.newMatchReported$.subscribe(
      information => {
        this.showRankingForPeriod(this.showRankingPeriod);
        this.determineRankingLeaderStatus();
      }
    )
   }

  ngOnInit() {
    setTimeout(() => {
        console.log("period er: " + this.period);
        this.showRankingForPeriod(this.period);
        this.getRankingItems();
        this.determineRankingLeaderStatus();
    }, 1000);
  }

  ngAfterViewChecked() {

  }

  public addNoRankingListAlert(msg: string, type: string):void {
    this.noRankingListAlerts.push({msg: msg, type: type, closable: false});
  }

  changePlayerForStatistics(playerForStatistics: string) {
    this.sharedCommunicationService.informAboutPlayerForStatisticsChanged(playerForStatistics);
  }

  getImageUrl(playerName : string) : string {
    if (playerName == null) {
      return "assets/img/Wildcard.jpg";
    } else {
      return "assets/img/" + playerName.toLocaleLowerCase() + ".jpg";
    }
  }

  // TABS RELATED
  public showRankingForPeriod(period: string):void {
    this.noRankingListAlerts = [];
    this.showRankingPeriod = period;
    this.rankingItems  = null;
    this.rankingItemService.getRankingItems(period).subscribe(
      rankingItems => this.rankingItems = rankingItems,
      err => {
        console.log('Problemer med at hente ranking-liste for perioden ' + period);
        this.addNoRankingListAlert('Kunne ikke hente ranglisten for den valgte periode. Tjek evt. om der er problemer med adgangen til serveren?', 'danger');
      });
  };

  // RANKINGITEMS RELATED
  getRankingItems(): void {
    this.rankingItemService.getRankingItems(this.showRankingPeriod).subscribe(rankingItems => this.rankingItems = rankingItems);
  }

  determineRankingLeaderStatus(): void {
    this.rankingItemService.getRankingItems("alltime").subscribe(rankingItems => {
      this.currentRankingItemsForRankingLeaderStatus = rankingItems;

      // We will start by finding the current top rated items
      this.currentTopRankedRankingItems = new Array();
      var currentTopPoints = -999;
      var i = 0;
      for (let rankingItem of this.currentRankingItemsForRankingLeaderStatus) {
        if (i == 0) {
          this.currentTopRankedRankingItems.push(rankingItem);
          currentTopPoints = rankingItem.points;
        } else if (rankingItem.points == currentTopPoints) {
          this.currentTopRankedRankingItems.push(rankingItem);
        }
        i++;
      }

      if (this.previousTopRankedRankingItems == null) {
        // Do nothing
        console.log("No previousTopRankedRankingItems so nothing to do here")
      } else {
        // Then there was some previous items, so let's do something
        console.log("We should compare them")
        var currentAndPreviousDiffer = false;
        if (this.currentTopRankedRankingItems.length != this.previousTopRankedRankingItems.length) {
          currentAndPreviousDiffer = true;
        } else {
          // Then they have the same size. Let's see, whether the content is the same in relation to names
          this.currentTopRankedRankingItems = this.sortRankingItemArray(this.currentTopRankedRankingItems);
          this.previousTopRankedRankingItems = this.sortRankingItemArray(this.previousTopRankedRankingItems);

          // Then check that each item is the same
          for (var index = 0; index < this.currentTopRankedRankingItems.length; index++) {
            console.log("sammenligner " + this.currentTopRankedRankingItems[index].name + " og " + this.previousTopRankedRankingItems[index].name)
            if (this.currentTopRankedRankingItems[index].name != this.previousTopRankedRankingItems[index].name) {
              console.log("De to navne er forskellige")
              currentAndPreviousDiffer = true;
            } else {
              console.log("De to navne er ens")
            }
          }
        }

        if (currentAndPreviousDiffer) {
          this.soundFanfare.pause();
          this.soundFanfare.currentTime = 0;
          this.soundFanfare.play();
          console.log("De er FORSKELLIGE!")
        } else {
          console.log("De er ENS")
        }

      }

      console.log("current")
      console.log(JSON.stringify(this.currentTopRankedRankingItems))

      console.log("previous")
      console.log(JSON.stringify(this.previousTopRankedRankingItems))

      this.previousTopRankedRankingItems = this.currentTopRankedRankingItems;
    });
  }

  sortRankingItemArray(theArray : RankingItem[]) {
    var sortedArray: RankingItem[] = theArray.sort((n1,n2) => {
      if (n1.name.toLocaleLowerCase() > n2.name.toLocaleLowerCase()) {
          return 1;
      }

      if (n1.name.toLocaleLowerCase() < n2.name.toLocaleLowerCase()) {
          return -1;
      }

      return 0;
    });
    return sortedArray;
  }
}
