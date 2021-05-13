import axios from 'axios';

axios.defaults.headers['x-api-key'] = process.env.COINMARKETCAL_API_KEY;
axios.defaults.headers['X-CMC_PRO_API_KEY'] = process.env.COINMARKETCAP_API_KEY;

/**
 * A helper function to fetch api with the necessary configuration
 *
 * @param url
 * @param queryParams
 */
const apiFetch = (url: string, queryParams = {}): Promise<any> =>
  axios
    .get(url, {
      params: { ...queryParams }
    })
    .then(({ data }) => data)
    .catch((e: Error) => console.error(e.message));

export default apiFetch;
