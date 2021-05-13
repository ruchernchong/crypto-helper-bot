import { Coin, CoinEvent } from '../types';
import apiFetchCalender from './helpers/apiFetchCalender';

const CAL_BASE_URL: string = 'https://developers.coinmarketcal.com/v1';

const fetchCoinEvent = async (coin: Coin): Promise<CoinEvent> =>
  apiFetchCalender(`${CAL_BASE_URL}/events`, {
    qs: {
      coins: coin
    }
  })
    .then((res) => res.data[0])
    .catch((e: Error) => console.error(e));

export default fetchCoinEvent;
