import apiFetch from './helpers/apiFetch';
import { CAL_BASE_URL } from '../config';
import type { CoinEvent } from '../types';

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
