import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CoinService } from '../services/coin.service';
import { Coin } from '../models/coin.model';
import { FilterArrayPipe } from '../pipes/filter-array.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-coin-details',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatIconModule, FilterArrayPipe],
  templateUrl: './coin-details.component.html',
  styleUrl: './coin-details.component.scss',
})
export class CoinDetailsComponent implements OnInit {
  @Input()
  coinId: string;

  coin: Coin;

  constructor(private coinService: CoinService) {}

  ngOnInit(): void {
    this.coinService.getCoinDetails(this.coinId).subscribe((coin: Coin) => {
      this.coin = coin;
      console.log(this.coin);
    });
  }
}
