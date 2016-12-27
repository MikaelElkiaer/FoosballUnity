import { Injectable } from '@angular/core';

import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { TournamentGame } from './tournament-game';
import { TournamentGameRound } from './tournament-game-round';

//import { TOURNAMENTGAMES } from './mock.tournament-games';

import { Player } from './player';

@Injectable()
export class TournamentGameRoundService {
  private tournamentGameRoundsUrl = 'http://localhost:5050/tournament/lastFirstTournament/';

  private headers = new Headers({'Content-Type': 'application/json'});
  private samletTekst = '';
  private testInput = '';

  constructor(private http: Http) {}

  getTournamentGameRounds(numberOfGames: number, possiblePlayers: Player[]): Promise<TournamentGameRound[]> {

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


      //for (var property in object) {
      //    alert('item ' + i + ': ' + property + '=' + object[property]);
  //  }
    // If property names are known beforehand, you can also just do e.g.
    // alert(object.id + ',' + object.Title);
//}

    //return Promise.resolve(GAMES);
    this.testInput = '{"numberOfGames": ' + numberOfGames + combinedString;
    //alert(this.testInput);
    console.log('TestInput:' + this.testInput);
    return this.http.post(this.tournamentGameRoundsUrl, this.testInput,
    {headers:this.headers})
      .toPromise()
      .then(response => response.json() as TournamentGameRound[])
      .catch(this.handleError);

  }


  private handleError(error: any): Promise<any> {
    console.error('DAMN, An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
    }

}
