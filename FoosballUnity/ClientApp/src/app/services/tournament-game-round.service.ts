import { Injectable } from '@angular/core';

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { TournamentGame } from '../model/tournament-game';
import { TournamentGameRound } from '../model/tournament-game-round';

//import { TOURNAMENTGAMES } from './mock.tournament-games';

import { Player } from '../model/player';

@Injectable()
export class TournamentGameRoundService {
  //private tournamentGameRoundsUrl = '/api/tournament/lastFirstTournament/';
  private tournamentGameRoundsUrl = '/api/tournament/roundrequest';

  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private samletTekst = '';
  private testInput = '';

  constructor(private http: HttpClient) {}

  getTournamentGameRounds(numberOfGames: number, possiblePlayers: Player[]): Observable<TournamentGameRound[]> {

    var startString = ',"players":[';
    var endString = ']}'
    var fillUpString = '';
    for (var i = 0; i < possiblePlayers.length; i++) {
      var object = possiblePlayers[i];
      fillUpString += '{"name":"' + object['name'] + '"}';
      if ((i + 1) != possiblePlayers.length) {
        fillUpString += ',';
      }
    }
    var combinedString = startString + fillUpString + endString;
    this.testInput = '{"numberOfGames": ' + numberOfGames + combinedString;

    return this.http.post<TournamentGameRound[]>(this.tournamentGameRoundsUrl, this.testInput,
    {headers:this.headers})
      .catch(this.handleError);
  }


  private handleError(error: any): Observable<any> {
    console.error('DAMN, An error occurred', error); // for demo purposes only
    return Observable.throw(error.message || error);
    }

}
