import { Component, Input } from '@angular/core';

@Component({
  selector: 'countdown',
  template: `
    <button (click)="startCountdownTimer()" type="button" class="btn btn-success btn-lg" style=" width:250px">Start nedtælling</button>

    <div style="font-size: 1400%; margin-top: -30px;margin-bottom: -30px">{{remainingTime}}</div>
    <progressbar class="progress-striped active" [max]="playingTime" [value]="ticks" type="{{progressbarType}}"></progressbar>
    <div class="form-group" >
        <select class="form-control" style="width: 250px" [(ngModel)]="playingTime"  (ngModelChange)="stopCountDownTimer();">
            <option  value="120">Spilletid: 120 sekunder</option>
            <option  value="60">Spilletid: 60 sekunder</option>
            <option  value="30">Spilletid: 30 sekunder</option>
        </select>
    </div>
  `
})

export class CountdownComponent {

}
