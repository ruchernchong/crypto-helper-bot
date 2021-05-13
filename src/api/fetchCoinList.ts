import apiFetch from './helpers/apiFetch';

const CAL_BASE_URL: string = 'https://developers.coinmarketcal.com/v1';

/**
 * Fetch all coins from CoinMarketCal
 */
const fetchCoinList = () =>
  apiFetch(`${CAL_BASE_URL}/coins`).then(({ body }) => body);

export default fetchCoinList;
