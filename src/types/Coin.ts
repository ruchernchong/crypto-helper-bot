interface QuoteInfo {
  [key: string]: any;
  market_cap: number;
  percent_change_24h: number;
  price: number;
}

interface Quote {
  [key: string]: QuoteInfo;
}

export interface Coin {
  [key: string]: any;
  cmc_rank: number;
  id: string;
  name: string;
  quote: Quote;
  symbol: string;
}
