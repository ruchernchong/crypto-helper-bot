import apiFetch from './helpers/apiFetch';
import { API_BASE_URL } from '../config';

/**
 * Fetch information on the cryptocurrency market capitalisation
 */
const fetchGlobalMetrics = () =>
  apiFetch(`${API_BASE_URL}/v1/global-metrics/quotes/latest`).then(
    ({ data }) => data
  );

export default fetchGlobalMetrics;
