import { Injectable } from '@angular/core';

import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { RankingItem } from '../model/ranking-item';

import { RANKINGITEMS } from '../mocks/mock.ranking-items';
import { RANKINGITEMSSAMLET } from '../mocks/mock.ranking-items-samlet';

@Injectable()
export class RankingItemService {

  private rankingItemsUrl = '/api/rankings/';
  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {}
  getRankingItems(period: string): Observable<RankingItem[]> {
      return this.http.get<RankingItem[]>(this.rankingItemsUrl + period)
        .catch(this.handleError);
  }


  private handleError(error: HttpErrorResponse): Observable<any> {
    console.error('DAMN, An error occurred', error); // for demo purposes only
    return Observable.throw(error.message || error);
  }
}
