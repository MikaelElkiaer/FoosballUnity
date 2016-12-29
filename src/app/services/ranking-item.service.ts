import { Injectable } from '@angular/core';

import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { RankingItem } from '../model/ranking-item';

import { RANKINGITEMS } from '../mocks/mock.ranking-items';
import { RANKINGITEMSSAMLET } from '../mocks/mock.ranking-items-samlet';

@Injectable()
export class RankingItemService {

  private rankingItemsUrl = 'http://localhost:5050/pointsPrPlayer/';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {}
  getRankingItems(period : string): Promise<RankingItem[]> {
    //alert('og i service' + period)
    //if (period == 'alltime') {
      //alert("get1")
      return this.http.get(this.rankingItemsUrl + period)
        .toPromise()
        .then(response => response.json() as RankingItem[])
        .catch(this.handleError);
    //} else {
  //    return Promise.resolve(RANKINGITEMS);
    //}
  }

  private handleError(error: any): Promise<any> {
    console.error('DAMN, An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
