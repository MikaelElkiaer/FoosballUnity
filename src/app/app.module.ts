import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { CountdownComponent } from './countdown/countdown.component';
import { IndividualResultsComponent } from './individual-results/individual-results.component';
import { AvailablePlayersComponent } from './available-players/available-players.component';
import { PreviousGamesComponent } from './previous-games/previous-games.component';
import { RankingListComponent } from './ranking-list/ranking-list.component';
import { GamesOverviewComponent } from './games-overview/games-overview.component';

import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';
import { ButtonsModule } from 'ng2-bootstrap/ng2-bootstrap';
import { TabsModule } from 'ng2-bootstrap/ng2-bootstrap';
import { ProgressbarModule } from 'ng2-bootstrap/ng2-bootstrap';

import { ChartsModule } from 'ng2-charts/ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    CountdownComponent,
    IndividualResultsComponent,
    AvailablePlayersComponent,
    PreviousGamesComponent,
    RankingListComponent,
    GamesOverviewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AlertModule,
    ButtonsModule,
    TabsModule,
    ProgressbarModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
