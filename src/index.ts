import { bot, prefix } from './config/bot.js';
import {
  getCoinFromEvents,
  getEventFromCoin,
  getGlobalMetrics,
  getPriceFromSymbol,
  getRecentEvents,
  help,
  start
} from './functions';

bot.start((ctx) => start(ctx));
bot.help((ctx) => help(ctx));

bot.command('mcap', async (ctx) => {
  const reply = await getGlobalMetrics();

  ctx
    .replyWithMarkdown(reply)
    .then(() => console.info('Reply sent for global metrics'))
    .catch((e: Error) => console.error(e));
});

bot.hears(/(\$[A-Za-z]{2,})/, async (ctx) => {
  const { message } = ctx;
  const { text } = message;

  const inputSymbol = text.split('$')[1].toUpperCase();

  const reply = await getPriceFromSymbol(inputSymbol);

  ctx
    .replyWithMarkdown(reply)
    .then(() => console.info(`Reply sent for ${inputSymbol}`))
    .catch((e: Error) => console.error(e.message));
});

bot.command('events', async (ctx) => {
  const maxEvents: number = 3;
  const reply = await getRecentEvents(maxEvents);

  ctx
    .replyWithHTML(reply, {
      disable_web_page_preview: true
    })
    .then(() =>
      console.info(`Found events. Returning the ${maxEvents} latest events.`)
    );
});

bot.hears(RegExp(`${prefix}event (.+)`), async (ctx) => {
  const { message } = ctx;
  const { text } = message;

  const inputSymbol: string = text.split(`${prefix}event `)?.[1].toUpperCase();

  const coin = await getCoinFromEvents(inputSymbol);

  if (coin) {
    const reply = await getEventFromCoin(coin);

    ctx
      .replyWithHTML(reply)
      .then(() => console.info(`Event found for ${inputSymbol}.`))
      .catch((e: Error) => console.error(e));
  } else {
    const reply: string = `Unable to find *${inputSymbol}*.`;

    ctx
      .replyWithMarkdown(reply)
      .then(() => console.info(`Unable to find ${inputSymbol}.`))
      .catch((e: Error) => console.error(e));
  }
});
