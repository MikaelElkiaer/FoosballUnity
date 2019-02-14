import { Injectable } from '@angular/core';

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Player } from '../model/player';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PlayerService {

  private playersUrl = '/api/players/';
  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {}

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.playersUrl)
      .catch(this.handleError);
  }

  create(name: string, playerReady: boolean, created: Date ): Observable<string> {
    const now = new Date().toISOString();
    return this.http
      .post(this.playersUrl,
        JSON.stringify({name: name, playerReady: playerReady, createdUtc: now}),
      {headers: this.headers, responseType: 'text'})
      .catch(this.handleError);
  }

  private handleError(error: any): Observable<any> {
    console.error('DAMN, An error occurred', error); // for demo purposes only
    return Observable.throw(error.message || error);
  }
}
