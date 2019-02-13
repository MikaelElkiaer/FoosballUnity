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
    let game = new Game();
    game.playerRed1 = player_red_1;
    game.playerRed2 = player_red_2;
    game.playerBlue1 = player_blue_1;
    game.playerBlue2 = player_blue_2;
    game.winningTable = parseInt(table);
    game.lastUpdatedUtc = updateTime;
    game.pointsAtStake = points_at_stake;
    game.matchWinner = resultat;
    return this.http
      .post<Game>(this.gamesUrl, game,
      {headers:this.headers})
      .catch(this.handleError);
  }

  private handleError(error: any): Observable<any> {
    console.error('DAMN, An error occurred', error); // for demo purposes only
    return Observable.throw(error.message || error);
    }

}
