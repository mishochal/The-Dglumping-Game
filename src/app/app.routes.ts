import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { RulesComponent } from './rules/rules.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'rules', component: RulesComponent }
];
