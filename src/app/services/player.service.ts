import { Injectable } from '@angular/core';

import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Player } from '../model/player';

//import { PLAYERS } from './mock.players';



@Injectable()
export class PlayerService {

  private playersUrl = 'http://localhost:5050/players/';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {}

  getPlayers(): Promise<Player[]> {
    return this.http.get(this.playersUrl)
      .toPromise()
      .then(response => response.json() as Player[])
      .catch(this.handleError);

    //return Promise.resolve(PLAYERS);
  }



  create(name : string, playerReady: boolean, created: Date ): Promise<string> {
   /*this.http.get(this.playersUrl)
    .toPromise()
    .then(response => response.json() as Player[])
    .catch(this.handleError);
    return new Player("hans", false, new Date('2015-11-11'));
*/

    return this.http
      .post(this.playersUrl, "[" + JSON.stringify({name:name, playerReady:playerReady, oprettet:'2016-10-10 21:46:36.0'}) + "]",
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
