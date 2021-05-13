import { bot, prefix } from './config';

import { fetchCoinEvent, fetchCoinList, fetchEvents } from './api';

import { Coin, CoinEvent } from './types';

bot.hears(RegExp(`${prefix}events`), async (ctx) => {
  let strEvent: string;
  const maxEvents: number = 3;

  const events: CoinEvent[] = await fetchEvents(maxEvents);

  strEvent = `📅 Here are the latest <i>${maxEvents}</i> events:\n\n`;

  events.forEach((event: CoinEvent) => {
    const coinName: string = event.coins[0].name;
    const coinSymbol: string = event.coins[0].symbol;

    strEvent += `<b>${coinName} (${coinSymbol})</b>\n<b>Title:</b> ${
      event.title
    }\n<b>Date:</b> ${new Date(
      event.date_event
    ).toLocaleDateString()}\n<b>Details:</b> ${event.source}\n\n`;
  });

  ctx
    .replyWithHTML(strEvent, {
      disable_web_page_preview: true
    })
    .then(() =>
      console.log(`Found events. Returning the ${maxEvents} latest events.`)
    );
});

bot.hears(RegExp(`${prefix}event (.+)`), async (ctx) => {
  const inputSymbol: string = 'BTC';
  // const inputSymbol: string = match?.[1].toUpperCase() || '';

  const coinList = await fetchCoinList();

  const coin = coinList.find((list: Coin) => list.symbol.includes(inputSymbol));

  if (coin) {
    let reply;

    const event: CoinEvent = await fetchCoinEvent(coin);

    if (event) {
      reply = `📅 Here is an upcoming event for <b>${coin.name} (${
        coin.symbol
      })</b>:\n\n<b>Title:</b> ${event.title.en}\n<b>Date:</b> ${new Date(
        event.date_event
      ).toLocaleDateString()}\n\n<b>Source:</b> ${event.source}`;
    } else {
      reply = `There are no event(s) for <b>${coin.name} (${coin.symbol})</b>.`;
    }

    ctx
      .replyWithHTML(reply)
      .then(() => console.log(`Event found for ${inputSymbol}.`))
      .catch((e: Error) => console.error(e));
  } else {
    const reply: string = `Unable to find *${inputSymbol}*.`;

    ctx
      .replyWithMarkdown(reply)
      .then(() => console.log(`Unable to find ${inputSymbol}.`))
      .catch((e: Error) => console.error(e));
  }
});
