import { Component, Input } from '@angular/core';

import { Player } from '../model/player';
import { PlayerService } from '../services/player.service';

import { SharedCommunicationService } from '../services/shared-communication.service';

import {HttpClient} from '@angular/common/http';

import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Rx';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

@Component({
  selector: 'availablePlayers',
  styleUrls: ['./available-players.component.scss'],
  templateUrl: './available-players.component.html'
})

export class AvailablePlayersComponent {
  public playerAlerts: Array<Object> = [];
  players: Player[];
  activePlayers: Player[];
  selectedPlayers: Player[];
  showingPlayers: Player[];
  newPlayer: Player;
  rfidName: any;
  soundCheckin: any;
  soundCheckout: any;
  soundError: any;

  constructor (
        private playerService: PlayerService,
        private sharedCommunicationService: SharedCommunicationService,
        private http: HttpClient
  ) {

    this.soundCheckin = new Audio('/assets/sounds/workout-started.wav');
    this.soundCheckout = new Audio('/assets/sounds/workout-complete.wav');
    this.soundError = new Audio('/assets/sounds/error.wav');

    Observable.interval(500).switchMap(() => http.get<Player>('http://localhost:5050/registration'))
      .subscribe(data => this.inverseSelectionForPlayer(data));
  }

  getImageUrl(playerName: string): string {
    if (playerName == null) {
      return 'assets/img/Wildcard.jpg';
    } else {
      return 'assets/img/' + playerName.toLocaleLowerCase() + '.jpg';
    }
  }

  getNumberOfSelectedPlayers(): string {
    if (this.selectedPlayers == null) {
      return '0';
    } else {
      return this.selectedPlayers.length.toString();
    }
  }

  setPlayers(players: Player[]): void {
   this.players = players;
   this.players = this.sortedPlayers(this.players);
   this.countSelectedPlayers();
  }
  setActivePlayers(players: Player[]): void {
    this.activePlayers = players;
    this.activePlayers = this.sortedPlayers(this.activePlayers);
    this.countSelectedPlayers();
   }
 
   showAllPlayers() {
     this.showingPlayers = this.players;
   }

  public addPlayerAlert(msg: string, type: string): void {
    this.playerAlerts.push({msg: msg, type: type, closable: false});
  }

  sortedPlayers(playersToSort: Player[]) {
    const sortedArray: Player[] = playersToSort.sort((n1, n2) => {
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

  addThisPlayerToPlayers(newPlayer: Player) {
    this.players.push(newPlayer);
    this.activePlayers.push(newPlayer);
    this.players = this.sortedPlayers(this.players);
    this.activePlayers = this.sortedPlayers(this.activePlayers);
    this.countSelectedPlayers();
    this.addPlayerAlert('Spilleren \'' + newPlayer.name + '\' er nu oprettet og markeret i listen', 'success');
  }

  countSelectedPlayers(): void {
     let playerReady = this.players.filter((x) => x.playerReady)
     this.selectedPlayers = playerReady;
     this.sharedCommunicationService.informAboutSelectedPlayersChanged(this.selectedPlayers);
   }

   inverseSelectionForPlayer(player: Player): void {
     if (player.registeredRFIDTag !== '') {
       let found = false;
       for (let tempPlayer of this.players) {
         if (tempPlayer.name === player.name) {
           found = true;
           tempPlayer.playerReady = !tempPlayer.playerReady;
           player.playerReady = tempPlayer.playerReady;
           if (player.playerReady) {
             this.soundCheckin.play();
           } else {
             this.soundCheckout.play();
           }
         }
       }

      this.changeRegisteredPlayer(player);

      if (found === false) {
         this.soundError.play();
       } else {
        this.countSelectedPlayers()
       }
     }

   }

   changeRegisteredPlayer(player: Player) {
     this.sharedCommunicationService.informAboutRegisteredPlayerChanged(player);
   }

  deselectAll() {
    for (let player of this.players) {
      player.playerReady = false;
    }
    this.countSelectedPlayers()
  }

  add(name: string): void {
    this.playerAlerts =  [];
    name = name.trim();
    if (!name) {
      this.addPlayerAlert('Du skal indtaste navn eller initialer', 'danger');
       return;
    }
    const upperCaseVersion = name.toUpperCase();
    let alreadyExist = false;
    let theNameThatExists = '';
    for (let play of this.players) {
      if (play.name.toUpperCase() === upperCaseVersion) {
        alreadyExist = true;
        theNameThatExists = play.name;
      }
    }
    if (alreadyExist) {
      this.addPlayerAlert('Navn/initialer \'' + name
      + '\' kan ikke benyttes, da der allerede findes en spiller med dette navn/initialer (\''
      + theNameThatExists + '\')', 'danger');
      return;
    }
    if (name.length > 20) {
       this.addPlayerAlert('Navn/initialer må maks. bestå af 20 bogstaver/tal', 'danger');
        return;
    }
    if (name.includes(' ')) {
      this.addPlayerAlert('Navn/initialer må ikke indeholde mellemrum', 'danger');
       return;
    }

    const today = new Date();
    const dd: number = today.getDate();
    const mm: number = (today.getMonth() + 1); // January is 0!
    const yyyy = today.getFullYear();
    const hours = today.getHours();

    let newHOURS;
    newHOURS = hours;
    if (hours < 10) {
        newHOURS = '0' + hours;
    }

    let minutes = today.getMinutes();
    let newMINUTES;
    newMINUTES = minutes;

    if (minutes < 10) {
        newMINUTES = '0' + minutes;
    }

    let seconds = today.getSeconds();
    let newSECONDS;
    newSECONDS = seconds;
    if (seconds < 10) {
        newSECONDS = '0' + seconds;
    }

    let newToday;
    let newDD;
    newDD = dd;
    if (dd < 10) {
        newDD = '0' + dd;
    }
    let newMM;
    newMM = mm;
    if (mm < 10) {
        newMM = '0' + mm;
    }

    newToday = yyyy + '/' + newMM + '/' + newDD + ' ' + newHOURS + ':' + newMINUTES + ':' + newSECONDS + '.' + today.getMilliseconds();

    this.newPlayer = new Player(name, true, new Date(newToday), '');
    console.log(`Adding Player ${name}`);

    this.playerService.create(name, true, new Date(newToday))
    .subscribe(strRes => {
        this.addThisPlayerToPlayers(this.newPlayer);
      },
    err  => {
      this.addPlayerAlert('Noget gik galt i forsøget på at oprette spilleren. Fejlen var: \'' + err + '\'', 'danger');
    })
    }
}
