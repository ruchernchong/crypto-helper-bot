import apiFetch from './helpers/apiFetch';
import { API_BASE_URL } from '../config';

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
