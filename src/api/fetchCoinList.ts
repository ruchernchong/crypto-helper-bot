import apiFetchCalender from './helpers/apiFetchCalender';

const CAL_BASE_URL: string = 'https://developers.coinmarketcal.com/v1';

const fetchCoinList = () =>
  apiFetchCalender(`${CAL_BASE_URL}/events?coins=bitcoin`) // TODO: Remove hardcoded coin id
    .then((res) => res.data.body)
    .catch((e: Error) => console.error(e));

export default fetchCoinList;
