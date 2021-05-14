import apiFetch from './helpers/apiFetch';

const API_BASE_URL = 'https://pro-api.coinmarketcap.com';

/**
 * Fetch the coin detail based on the symbol
 *
 * @param symbol
 */
const fetchQuote = (symbol: string) =>
  apiFetch(
    `${API_BASE_URL}/v1/cryptocurrency/quotes/latest?symbol=${symbol}`
  ).then(({ data }) => data[symbol]);

export default fetchQuote;
