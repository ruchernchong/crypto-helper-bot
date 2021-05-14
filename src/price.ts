import dedent from 'dedent';
import { bot } from './config';

import { fetchGlobalMetrics, fetchQuote } from './api';
import { commarise, formatPercentage, formatPrice, slugify } from './utils';

import { Coin } from './types';

const SITE_BASE_URL = 'https://coinmarketcap.com';

bot.command('mcap', async (ctx) => {
  const globalMetrics = await fetchGlobalMetrics();
  const {
    btc_dominance,
    eth_dominance,
    quote: {
      USD: { last_updated, total_market_cap }
    }
  } = globalMetrics;

  const marketCap = `_${commarise(total_market_cap)}_`;
  const bitcoinDominance = `_${formatPercentage(btc_dominance)}_`;
  const ethereumDominance = `_${formatPercentage(eth_dominance)}_`;

  const reply = dedent`
    *Total Est. Market Cap (USD):* ${marketCap}

    *Bitcoin Dominance:* ${bitcoinDominance}
    *Ethereum Dominance:* ${ethereumDominance}

    *Last updated:* ${[
      new Date(last_updated).toLocaleDateString(),
      new Date(last_updated).toLocaleTimeString()
    ].join(' ')}
    `;

  ctx
    .replyWithMarkdown(reply)
    .then(() => console.info('Reply sent for global metrics'))
    .catch((e: Error) => console.error(e));
});

bot.hears(/(\$[A-Za-z]{2,})/, async (ctx) => {
  const {
    message: { text }
  } = ctx;
  const inputSymbol = text.split('$')[1].toUpperCase();

  const coin: Coin = await fetchQuote(inputSymbol);
  const { cmc_rank: rank, name, quote, symbol } = coin;
  const {
    USD: { market_cap: marketCap, percent_change_24h, price }
  } = quote;
  const directionOfChange: string = percent_change_24h < 0 ? '📉' : '📈';

  let reply: string;

  if (coin) {
    reply = dedent`
      💰 Here is the current price for *${name} (${symbol})*:

      *Rank:* _${rank}_
      *Est. Market Cap (USD):* _$${commarise(marketCap)}_
      *USD:* _${formatPrice(price, 8)}_
      *24hr Change:* _${formatPercentage(
        percent_change_24h
      )}%_ ${directionOfChange}

      *Link:* ${SITE_BASE_URL}/currencies/${slugify(name)}
    `;
  } else {
    reply = dedent`
      Unable to find *${inputSymbol}*
    `;
  }

  ctx
    .replyWithMarkdown(reply)
    .then(() => console.info(`Reply sent for ${inputSymbol}`))
    .catch((e: Error) => console.error(e.message));
});
