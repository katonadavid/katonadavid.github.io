import { Currency } from './currency.model';

export interface MarketData {
  current_price: Currency | null;
}
