import axios from 'axios';

axios.defaults.headers['x-api-key'] = process.env.COINMARKETCAL_API_KEY;

/**
 * A helper function to fetch api from CoinMarketCal
 *
 * @param url
 * @param params
 */
const apiFetchCalender = (url: string, params = {}) =>
  axios.get(url, params).then((res) => res);

export default apiFetchCalender;
