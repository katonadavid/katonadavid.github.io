import { Routes } from '@angular/router';
import { CoinListComponent } from './coin-list/coin-list.component';

export const routes: Routes = [
    { path: 'list', component: CoinListComponent },
    { path: '**', redirectTo: 'list' }
];
