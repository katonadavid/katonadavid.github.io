import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coin } from '../models/coin.model';
import { MarketChart } from '../models/market-chart.model';

@Injectable({
  providedIn: 'root',
})
export class CoinService {
  apiUrl = 'https://api.coingecko.com/api/v3/coins';

  constructor(private httpClient: HttpClient) {}

  getCoinList(): Observable<Coin[]> {
    return this.httpClient.get<Coin[]>(`${this.apiUrl}/list`);
  }
  
  getCoinDetails(coinId: string): Observable<Coin> {
    return this.httpClient.get<Coin>(`${this.apiUrl}/${coinId}`);
  }

  getCoinMarket(
    coinId: string,
    currency: string,
    days: number,
  ): Observable<MarketChart> {
    const params = new HttpParams({
      fromObject: {
        vs_currency: currency,
        days: days,
      },
    });

    return this.httpClient.get<MarketChart>(
      `${this.apiUrl}/${coinId}/market_chart`,
      { params },
    );
  }
}
