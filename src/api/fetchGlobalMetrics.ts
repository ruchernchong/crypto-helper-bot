import apiFetch from './helpers/apiFetch';

const API_BASE_URL = 'https://pro-api.coinmarketcap.com';

/**
 * Fetch information on the cryptocurrency market capitalisation
 */
const fetchGlobalMetrics = () =>
  apiFetch(`${API_BASE_URL}/v1/global-metrics/quotes/latest`).then(
    ({ data }) => data
  );

export default fetchGlobalMetrics;
