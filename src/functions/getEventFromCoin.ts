import dedent from 'dedent';
import { fetchCoinEvent } from '../api';
import { Coin, CoinEvent } from '../types';

/**
 * Get the event for the given coin
 *
 * @param coin
 */
const getEventFromCoin = async (coin: Coin): Promise<string> => {
  const { name, symbol } = coin;
  const event: CoinEvent = await fetchCoinEvent(coin);

  if (event) {
    return dedent`
        📅 Here is an upcoming event for <b>${name} (${symbol})</b>:

        <b>Title:</b> ${event.title.en}
        <b>Date:</b> ${new Date(event.date_event).toLocaleDateString()}

        <b>Source:</b> ${event.source}
      `;
  } else {
    return dedent`
        There are no event(s) for <b>${name} (${symbol})</b>.
      `;
  }
};

export default getEventFromCoin;
