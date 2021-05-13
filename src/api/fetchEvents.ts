import { CoinEvent } from '../types';
import apiFetch from './helpers/apiFetch';

const CAL_BASE_URL: string = 'https://developers.coinmarketcal.com/v1';

/**
 * Fetch all upcoming events based on the max number given
 *
 * @param maxEvents
 */
const fetchEvents = async (maxEvents: number): Promise<CoinEvent[]> =>
  apiFetch(`${CAL_BASE_URL}/events`, {
    max: maxEvents
  }).then(({ body }) => body);

export default fetchEvents;
