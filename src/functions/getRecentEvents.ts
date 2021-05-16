import dedent from 'dedent';
import { Coin, CoinEvent } from '../types';
import { fetchEvents } from '../api';

/**
 * Get the number of recent events no more than the max given
 *
 * @param maxEvents
 */
const getRecentEvents = async (maxEvents: number): Promise<string> => {
  const events: CoinEvent[] = await fetchEvents(maxEvents);

  let reply: string = dedent`
    📅 Here are the latest <i>${maxEvents}</i> events:\n
  `;

  events.forEach((event: CoinEvent) => {
    const { date_event, source, title } = event;
    const coin: Coin = event.coins[0];
    const { name, symbol } = coin;

    reply += dedent`
      <b>${name} (${symbol})</b>
      <b>Title:</b> ${title.en}
      <b>Date:</b> ${new Date(date_event).toLocaleDateString()}
      <b>Details:</b> ${source}\n
    `;
  });

  return reply;
};

export default getRecentEvents;
