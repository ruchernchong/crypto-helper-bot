import apiFetch from './helpers/apiFetch';
import { CAL_BASE_URL } from '../config';
import type { Coin, CoinEvent } from '../types';

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
