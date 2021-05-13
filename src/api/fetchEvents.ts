import { CoinEvent } from '../types';
import apiFetchCalender from './helpers/apiFetchCalender';

const CAL_BASE_URL: string = 'https://developers.coinmarketcal.com/v1';

const fetchEvents = async (maxEvents: number): Promise<CoinEvent[]> =>
  apiFetchCalender(`${CAL_BASE_URL}/events`, {
    max: maxEvents
  })
    .then((res) => res.data)
    .catch((e: Error) => console.error(e));

export default fetchEvents;
