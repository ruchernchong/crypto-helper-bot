import apiFetch from './helpers/apiFetch';
import { CAL_BASE_URL } from '../config';

/**
 * Fetch all coins from CoinMarketCal
 */
const fetchCoinList = () =>
  apiFetch(`${CAL_BASE_URL}/coins`).then(({ body }) => body);

export default fetchCoinList;
