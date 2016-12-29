import { Injectable } from '@angular/core';

import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Game } from '../model/game';

import { GAMES } from '../mocks/mock.games';

@Injectable()
export class GameService {
  private gamesUrl = 'http://localhost:5050/games/';

  private headers = new Headers({'Content-Type': 'application/json'});
  private samletTekst = '';

  constructor(private http: Http) {}

  getGames(period: string): Promise<Game[]> {

    //return Promise.resolve(GAMES);

    return this.http.get(this.gamesUrl + period)
      .toPromise()
      .then(response => response.json() as Game[])
      .catch(this.handleError);


  }

  indmeldResultat(player_red_1 : string, player_red_2 : string, player_blue_1 : string, player_blue_2 : string, table: string, resultat : string, updateTime: string, points_at_stake: number) : Promise<string> {
    this.samletTekst = '[' +
     JSON.stringify({player_red_1:player_red_1,   player_red_2:player_red_2, player_blue_1:player_blue_1, player_blue_2:player_blue_2,
lastUpdated:  updateTime ,match_winner:resultat,points_at_stake: points_at_stake,winning_table:table})
      + ']';
    return this.http
      .post(this.gamesUrl, this.samletTekst,
      {headers:this.headers})
      .toPromise()
      .then(res => res.toString())
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('DAMN, An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
    }

}
