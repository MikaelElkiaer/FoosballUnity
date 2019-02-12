import { Injectable } from '@angular/core';

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Game } from '../model/game';

import { GAMES } from '../mocks/mock.games';

@Injectable()
export class GameService {
  private gamesUrl = '/api/games/';

  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private samletTekst = '';

  constructor(private http: HttpClient) {}

  getGames(period: string): Observable<Game[]> {
    return this.http.get<Game[]>(this.gamesUrl + period)
      .catch(this.handleError);
  }

  indmeldResultat(player_red_1 : string, player_red_2 : string,
                  player_blue_1 : string, player_blue_2 : string,
                  table: string, resultat : string, updateTime: string, points_at_stake: number) : Observable<string> {
    this.samletTekst = '[' +
     JSON.stringify({player_red_1:player_red_1,   player_red_2:player_red_2, player_blue_1:player_blue_1, player_blue_2:player_blue_2,
lastUpdated:  updateTime ,match_winner:resultat,points_at_stake: points_at_stake,winning_table:table})
      + ']';
    return this.http
      .post<string>(this.gamesUrl, this.samletTekst,
      {headers:this.headers})
      .catch(this.handleError);
  }

  private handleError(error: any): Observable<any> {
    console.error('DAMN, An error occurred', error); // for demo purposes only
    return Observable.throw(error.message || error);
    }

}
