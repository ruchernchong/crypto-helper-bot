import { Coin } from './Coin';

interface Title {
  en: string;
}

export interface CoinEvent {
  coins: Coin[];
  date_event: string;
  description: string;
  source: string;
  title: Title;
}
