type PriceData = [number, number];

export interface MarketChart {
    prices: PriceData[];
    market_caps: PriceData[];
    total_volumes: PriceData[];
  }