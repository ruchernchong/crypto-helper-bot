import { Coin, CoinEvent } from '../types';
import apiFetch from './helpers/apiFetch';

const CAL_BASE_URL: string = 'https://developers.coinmarketcal.com/v1';

/**
 * Fetch the event for a particular coin
 *
 * @param coin
 */
const fetchCoinEvent = async (coin: Coin): Promise<CoinEvent> =>
  apiFetch(`${CAL_BASE_URL}/events?coins=${coin.id}`).then(
    ({ body }) => body[0]
  );

export default fetchCoinEvent;
