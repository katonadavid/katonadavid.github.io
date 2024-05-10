import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CoinService } from '../services/coin.service';
import { Coin } from '../models/coin.model';
import { FilterArrayPipe } from '../pipes/filter-array.pipe';
import { RouterLink } from '@angular/router';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import Chart from 'chart.js/auto';
import { COLORS } from '../app.constants';

@Component({
  selector: 'app-coin-details',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatIconModule, FilterArrayPipe],
  templateUrl: './coin-details.component.html',
  styleUrl: './coin-details.component.scss',
})
export class CoinDetailsComponent implements OnInit, AfterViewInit {
  @ViewChildren('priceChart')
  priceChart: QueryList<ElementRef<HTMLCanvasElement>>;

  @Input()
  coinId: string;

  coin: Coin;
  priceDataUnavailable: boolean;

  private chart: Chart;

  private readonly chartRangeInDays = 7;
  private readonly chartCurrency = 'eur';
  private readonly viewInitialised$ = new Subject<void>();
  private readonly destroy$ = new Subject<void>();

  constructor(private coinService: CoinService) {}

  ngOnInit(): void {
    this.coinService.getCoinDetails(this.coinId).pipe(takeUntil(this.destroy$)).subscribe((coin: Coin) => {
      this.coin = coin;
    });

    forkJoin([this.coinService.getCoinMarket(this.coinId, this.chartCurrency, this.chartRangeInDays), this.viewInitialised$]).pipe(takeUntil(this.destroy$))
    .subscribe(([market]) => {
      if (market.prices?.length > 1) {
      this.chart = new Chart(
        this.priceChart.first.nativeElement,
        {
          type: 'line',
          data: {
            labels: Object.values(market.prices).map(priceRecord => 
              new Date(priceRecord[0]).toLocaleDateString('de-AT')),
            datasets: [
              {
                data: Object.values(market.prices).map(priceRecord => priceRecord[1]),
                borderColor: COLORS.primaryBlue,
                backgroundColor: COLORS.lightBlue,
              }
            ],
          },
          options: {
            plugins: {
              legend: {
                display: false
              }
            },
            maintainAspectRatio: false
          }
        }
      );
      } else {
        this.priceDataUnavailable = true;
      }


    })
  }

  ngAfterViewInit(): void {
    this.priceChart.changes.subscribe((...a) => {
      this.viewInitialised$.next();
      this.viewInitialised$.complete();
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
