import { Coin } from './Coin';

export interface CoinEvent {
  coins: Coin[];
  date_event: string;
  description: string;
  source: string;
  title: string;
}
