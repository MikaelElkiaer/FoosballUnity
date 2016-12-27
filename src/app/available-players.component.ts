import { Component, Input } from '@angular/core';

@Component({
  selector: 'availablePlayers',
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

        <div>Disse {{selectedPlayers}} spillere er valgt:</div>
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

}
