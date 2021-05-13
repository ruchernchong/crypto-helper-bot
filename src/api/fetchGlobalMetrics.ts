import axios from 'axios';

const API_BASE_URL = 'https://pro-api.coinmarketcap.com';

const fetchGlobalMetrics = () =>
  axios
    .get(`${API_BASE_URL}/v1/global-metrics/quotes/latest`)
    .then((res) => res.data);

export default fetchGlobalMetrics;
