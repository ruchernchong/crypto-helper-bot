import axios from 'axios';

const API_BASE_URL = 'https://pro-api.coinmarketcap.com';

const fetchQuote = (symbol: string) =>
  axios
    .get(`${API_BASE_URL}/v1/cryptocurrency/quotes/latest?symbol=${symbol}`)
    .then((res) => res.data.data[symbol])
    .catch((e: Error) => console.error(e.message));

export default fetchQuote;
