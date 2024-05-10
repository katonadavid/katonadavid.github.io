import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CoinService } from '../services/coin.service';
import { Coin } from '../models/coin.model';
import { FilterArrayPipe } from '../pipes/filter-array.pipe';
import { RouterLink } from '@angular/router';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import Chart from 'chart.js/auto';
import { COLORS } from '../app.constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coin-details',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatIconModule,
    FilterArrayPipe,
    CommonModule,
  ],
  templateUrl: './coin-details.component.html',
  styleUrl: './coin-details.component.scss',
})
export class CoinDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild('priceChart')
  priceChart: ElementRef<HTMLCanvasElement>;

  @Input()
  coinId: string;

  coin: Coin;
  coinDetailsLoading: boolean;
  priceChartLoading: boolean;
  coinLoadingError: boolean;
  priceDataUnavailable: boolean;

  private readonly chartRangeInDays = 7;
  private readonly chartCurrency = 'eur';
  private readonly viewInitialised$ = new Subject<void>();
  private readonly destroy$ = new Subject<void>();

  constructor(private coinService: CoinService) {}

  ngOnInit(): void {
    this.coinDetailsLoading = true;
    this.priceChartLoading = true;

    this.coinService
      .getCoinDetails(this.coinId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (coin: Coin) => {
          this.coin = coin;
          this.coinDetailsLoading = false;
        },
        error: () => {
          this.coinLoadingError = true;
          this.coinDetailsLoading = false;
        }
      });

    forkJoin([
      this.coinService.getCoinMarket(
        this.coinId,
        this.chartCurrency,
        this.chartRangeInDays,
      ),
      this.viewInitialised$,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([market]) => {
          if (market.prices?.length > 1) {
            new Chart(this.priceChart.nativeElement, {
              type: 'line',
              data: {
                labels: Object.values(market.prices).map((priceRecord) =>
                  new Date(priceRecord[0]).toLocaleDateString('de-AT'),
                ),
                datasets: [
                  {
                    data: Object.values(market.prices).map(
                      (priceRecord) => priceRecord[1],
                    ),
                    borderColor: COLORS.primaryBlue,
                    backgroundColor: COLORS.lightBlue,
                  },
                ],
              },
              options: {
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
              },
            });
            this.priceChartLoading = false;
          } else {
            this.priceDataUnavailable = true;
            this.priceChartLoading = false;
          }
        },
        error: () => {
          this.priceDataUnavailable = true;
          this.priceChartLoading = false;
        },
      });
  }

  ngAfterViewInit(): void {
    this.viewInitialised$.next();
    this.viewInitialised$.complete();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
