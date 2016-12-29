import { Component, Input } from '@angular/core';

import { Player } from './player';
import { PlayerService } from './player.service';

import { SharedCommunicationService } from './shared-communication.service';

@Component({
  selector: 'availablePlayers',
  styleUrls: ['./available-players.component.css'],
  template: `
      <div >
        <table width="100%">
          <tr valign="top">
            <td valign="top" width="48%">
              <div  *ngFor="let player of players; let i = index">
                <label *ngIf="i < (players.length / 2)" [className]="'labelCheckbox'" [class.labelPlayerReady]="player.playerReady" ><img   [src]=getImageUrl(player.name)  onError="this.src = 'assets/img/Wildcard.jpg'" width="24" height="30"> <input type="checkbox" class="checkbox-inline"  [ngModel]="player.playerReady" (change)="player.playerReady = ! player.playerReady;countSelectedPlayers()"> <span>{{player.name}}</span></label>
              </div>
            </td>
            <td>&nbsp;&nbsp;</td>
            <td valign="top" width="48%">
              <div  *ngFor="let player of players; let i = index">
                <label *ngIf="i >= (players.length / 2)" [className]="'labelCheckbox'" [class.labelPlayerReady]="player.playerReady" ><img   [src]=getImageUrl(player.name)  onError="this.src = 'assets/img/Wildcard.jpg'" width="24" height="30"> <input type="checkbox" class="checkbox-inline"  [ngModel]="player.playerReady" (change)="player.playerReady = ! player.playerReady;countSelectedPlayers()"> <span>{{player.name}}</span></label>
              </div>
            </td>
        </tr>
      </table>

        <div>Disse {{getNumberOfSelectedPlayers()}} spillere er valgt:</div>
        <span *ngFor="let player of players">
          <span *ngIf="player.playerReady"><img   [src]=getImageUrl(player.name)  onError="this.src = 'assets/img/Wildcard.jpg'" width="24" height="30"></span >
        </span>
        <div style="padding-top:3px"><button (click)="deselectAll()">
        Fravælg alle
        </button>
        </div>
        <div>&nbsp;</div>
        <div>
          <label>Tilføj ny spiller:</label><br>
          <input size="10" #playerName (keyUp.Enter)="add(playerName.value);playerName.value=''"/>
          <button  (click)="add(playerName.value);playerName.value=''">
          Tilføj spiller
          </button>
          <br>&nbsp;<br>
          <alert *ngFor="let alert of playerAlerts;let i = index" [type]="alert.type" dismissOnTimeout="4000">
            {{ alert?.msg }}
          </alert>
        </div>

      </div>
  `
})

export class AvailablePlayersComponent {
  players: Player[];
  selectedPlayers: Player[];
  newPlayer: Player;

  //mySelectedPlayers: Player[];

  constructor (
        private playerService: PlayerService,
        private sharedCommunicationService: SharedCommunicationService
  ) {

  }

  getImageUrl(playerName : string) : string {
    if (playerName == null) {
      return "assets/img/Wildcard.jpg";
    } else {
      return "assets/img/" + playerName + ".jpg";
    }
  }

  getNumberOfSelectedPlayers() : string {
    if (this.selectedPlayers == null) {
      return "0";
    } else {
      return this.selectedPlayers.length.toString();
    }
  }

  setPlayers(players: Player[]): void {
   this.players = players;
   this.players = this.sortedPlayers();
   this.countSelectedPlayers();
  }

/*
  getMySelectedPlayers(): Player[] {
    let playerReady = this.players.filter((x) => x.playerReady);
    return playerReady;
  }
*/

  public playerAlerts:Array<Object> = [];

  public addPlayerAlert(msg: string, type: string):void {
    this.playerAlerts.push({msg: msg, type: type, closable: false});
  }

  sortedPlayers() {

    var sortedArray: Player[] = this.players.sort((n1,n2) => {
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

  setPlayersToBeSorted() {
    this.players = this.sortedPlayers();
  }

  addThisPlayerToPlayers(newPlayer: Player) {
    this.players.push(newPlayer);
    this.setPlayersToBeSorted();
    this.countSelectedPlayers();
    this.addPlayerAlert('Spilleren \'' + newPlayer.name + '\' er nu oprettet og markeret i listen', 'success');
  }



  countSelectedPlayers(): void {
     let playerReady = this.players.filter((x) => x.playerReady)
     this.selectedPlayers = playerReady;
     this.sharedCommunicationService.informAboutSelectedPlayersChanged(this.selectedPlayers);
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
    var upperCaseVersion = name.toUpperCase();
    var alreadyExist = false;
    var theNameThatExists = '';
    for (let play of this.players) {
      if (play.name.toUpperCase() == upperCaseVersion) {
        alreadyExist = true;
        theNameThatExists = play.name;
      }
    }
    if (alreadyExist) {
      this.addPlayerAlert('Navn/initialer \'' + name + '\' kan ikke benyttes, da der allerede findes en spiller med dette navn/initialer (\'' + theNameThatExists + '\')', 'danger');
       return;
    }
    if (name.length > 10) {
       this.addPlayerAlert('Navn/initialer må maks. bestå af 10 bogstaver/tal', 'danger');
        return;
    }
    if (name.includes(' ')) {
      this.addPlayerAlert('Navn/initialer må ikke indeholde mellemrum', 'danger');
       return;
    }

    var today = new Date();
    var dd : number = today.getDate();
    var mm : number = (today.getMonth()+1); //January is 0!
    var yyyy = today.getFullYear();

    var hours = today.getHours();
    var newHOURS;
    newHOURS = hours;
    if(hours<10) {
        newHOURS='0'+hours;
    }

    var minutes = today.getMinutes();
    var newMINUTES;
    newMINUTES = minutes;

    if(minutes<10) {
        newMINUTES='0'+minutes;
    }

    var seconds = today.getSeconds();
    var newSECONDS;
    newSECONDS = seconds;
    if(seconds<10) {
        newSECONDS='0'+seconds;
    }

    var newToday;
    var newDD;
    newDD = dd;
    if(dd<10) {
        newDD='0'+dd;
    }
    var newMM;
    newMM = mm;
    if(mm<10) {
        newMM='0'+mm;
    }


    //2016-10-22 23:21:30.0
    newToday = yyyy+'/'+newMM+'/'+newDD + " " + newHOURS + ":" + newMINUTES + ":" + newSECONDS + "." + today.getMilliseconds();


    this.newPlayer = new Player(name, true, new Date(newToday));

    this.playerService.create(name, true, new Date(newToday))
    .then((strRes : string) => {
    //alert(strRes);
       this.addThisPlayerToPlayers(this.newPlayer);

      //this.players.push(player);
    }).catch(err  => {

        this.addPlayerAlert('Noget gik galt i forsøget på at oprette spilleren. Fejlen var: \'' + err + '\'', 'danger');

      })
    }

  //showAddPlayerAlert(alert: string, type: string) {
  //  this.availablePlayersComponent.addPlayerAlert(alert, type);
  //}


}
