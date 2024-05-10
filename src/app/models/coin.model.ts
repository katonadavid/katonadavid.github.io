import { Links } from './links.model';
import { MarketData } from './market-data.model';

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  categories: string[];
  links: Links;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  genesis_date: string;
  market_data: MarketData | null;
}
