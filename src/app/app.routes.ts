import { Routes } from '@angular/router';
import { CoinListComponent } from './coin-list/coin-list.component';
import { CoinDetailsComponent } from './coin-details/coin-details.component';

export const routes: Routes = [
  { path: 'list', component: CoinListComponent },
  { path: 'coin/:coinId', component: CoinDetailsComponent },
  { path: '**', redirectTo: 'list' },
];
