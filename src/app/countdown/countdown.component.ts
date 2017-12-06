import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Rx';
import { TimerObservable } from "rxjs/observable/TimerObservable";

import { ProgressbarModule } from 'ngx-bootstrap';

import {HttpClient} from '@angular/common/http';

import { TimerAction } from '../model/timer-action';

@Component({
  selector: 'countdown',
  template: `
    <button (click)="startCountdownTimer()" type="button" class="btn btn-success btn-lg" style=" width:250px">Start nedtælling</button>

    <div style="font-size: 1400%; margin-top: -30px;margin-bottom: -30px">{{remainingTime}}</div>
    <progressbar class="progress-striped active" [max]="playingTime" [value]="ticks" type="{{progressbarType}}"></progressbar>
    <div class="form-group" >
        <select class="form-control" style="width: 250px" [(ngModel)]="playingTime"  (ngModelChange)="stopCountdownTimer();">
            <option  value="120">Spilletid: 120 sekunder</option>
            <option  value="60">Spilletid: 60 sekunder</option>
            <option  value="30">Spilletid: 30 sekunder</option>
        </select>
    </div>
  `
})

export class CountdownComponent {

  playingTime = 120;
  remainingTime = this.playingTime;
  ticks = 0;
  progressbarType = "info";

  subscription: Subscription;
  timer: Observable<any>;

  soundStart:any;
  soundFinish:any;
  sound1Minute:any;
  sound30Seconds:any;
  sound15Seconds:any;

  urlStart:string;
  ta : TimerAction;
  lastSeenlastRequestedTimerStart = null;

  constructor(http: HttpClient) {
    this.soundFinish = new Audio("/assets/sounds/finish.wav");
    this.sound1Minute= new Audio("/assets/sounds/1minute.wav");
    this.sound30Seconds= new Audio("/assets/sounds/30seconds.wav");
    this.sound15Seconds= new Audio("/assets/sounds/15seconds.wav");

    Observable.interval(1000).switchMap(() => http.get('http://localhost:5050/timer'))
      .subscribe(data => {
       this.ta = data[0];
       //console.log("tid: " + this.ta.lastRequestedTimerStart)
       if (this.lastSeenlastRequestedTimerStart == null) {
         this.lastSeenlastRequestedTimerStart = this.ta.lastRequestedTimerStart;

       } else {
         if (this.lastSeenlastRequestedTimerStart != this.ta.lastRequestedTimerStart) {
           this.startCountdownTimer();
           this.lastSeenlastRequestedTimerStart = this.ta.lastRequestedTimerStart;
         }
       }
    });
  }

  startCountdownTimer() {
    if ( this.subscription && this.subscription instanceof Subscription) {
          this.subscription.unsubscribe();
    }

    this.timer = Observable.timer(0, 1000);
    this.subscription = this.timer.subscribe(t=> {this.showNewTime(t)});
    var random = Math.floor(Math.random() * 7) + 1;
    this.urlStart = "/assets/sounds/duke/" + random + ".wav";
    this.soundStart = new Audio(this.urlStart);
    this.soundStart.play();
  }

  showNewTime(t : number) {
    this.ticks = t;
    this.remainingTime = this.playingTime - this.ticks;
    if (this.remainingTime > 60) {
      this.progressbarType = 'success';
    } else if (this.remainingTime == 60) {
      this.sound1Minute.play();
      this.progressbarType = 'info';
    } else if (this.remainingTime == 30) {
      this.sound30Seconds.play();
      this.progressbarType = 'warning';
    } else if (this.remainingTime == 15) {
      this.sound15Seconds.play();
      this.progressbarType = 'danger';
    }
    else if (this.remainingTime == 0) {
      if ( this.subscription && this.subscription instanceof Subscription) {
            this.subscription.unsubscribe();
      }
      this.soundFinish.play();
    }
  }

  stopCountdownTimer() {
    if ( this.subscription && this.subscription instanceof Subscription) {
      this.subscription.unsubscribe();
    }
    this.remainingTime = this.playingTime;
    this.timer = null;
    this.ticks = 0;
  }
}
