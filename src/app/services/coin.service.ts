import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoinService {

  apiUrl = 'https://api.coingecko.com/api/v3/coins/';

  constructor(private httpClient: HttpClient) { }

  getCoinList(): Observable<any> {
    return this.httpClient.get(this.apiUrl + 'list');
  }
}
