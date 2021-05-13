import axios from 'axios';
import { bot, prefix } from './config';

import { fetchGlobalMetrics, fetchQuote } from './api';

const SITE_BASE_URL = 'https://coinmarketcap.com';

axios.defaults.headers.common['X-CMC_PRO_API_KEY'] =
  process.env.COINMARKETCAP_API_KEY;

bot.onText(RegExp(`${prefix}mcap`), async (message) => {
  const chatId: number = message.chat.id;

  const data = await fetchGlobalMetrics();

  const marketCap = `_$${parseFloat(
    data.data.quote.USD.total_market_cap
  ).toLocaleString('en')}_`;
  const bitcoinDominance = `_${parseFloat(data.data.btc_dominance).toFixed(
    2
  )}%_`;
  const ethereumDominance = `_${parseFloat(data.data.eth_dominance).toFixed(
    2
  )}%_`;

  const reply = `*Total Est. Market Cap (USD):* ${marketCap}\n*Bitcoin Dominance:* ${bitcoinDominance}\n*Ethereum Dominance:* ${ethereumDominance}`;

  bot
    .sendMessage(chatId, reply, { parse_mode: 'Markdown' })
    .then(() => console.info('Total Market Cap in USD'))
    .catch((e: Error) => console.error(e));
});

bot.onText(/(\$[A-Za-z]{2,})/, async (message, match) => {
  const chatId = message.chat.id;
  const input: string = match?.input || '';
  const inputSymbol = input.split('$')[1].toUpperCase();

  const coin = await fetchQuote(inputSymbol);

  let reply, name, symbol, rank, mCap, priceUSD, priceDelta, link;

  if (coin) {
    name = coin.name;
    symbol = coin.symbol;
    rank = `*Rank:* _${coin.cmc_rank}_`;
    mCap = `*Est. Market Cap (USD):* _$${parseFloat(
      coin.quote.USD.market_cap
    ).toLocaleString('en')}_`;
    priceUSD = `*USD:* _$${parseFloat(coin.quote.USD.price).toLocaleString(
      'en'
    )}_`;
    priceDelta = `*24hr Change:* _${parseFloat(
      coin.quote.USD.percent_change_24h
    ).toFixed(2)}%_ ${coin.quote.USD.percent_change_24h < 0 ? '📉' : '📈'}`;
    link = `*Link:* ${SITE_BASE_URL}/currencies/${coin.name
      .toLowerCase()
      .replace(/\s+/g, '-')}`;

    reply = `💰 Here is the current price for *${name} (${symbol})*:\n\n${rank}\n${mCap}\n${priceUSD}\n${priceDelta}\n\n${link}`;
  } else {
    reply = `Unable to find *${inputSymbol}*`;
  }

  bot
    .sendMessage(chatId, reply, { parse_mode: 'Markdown' })
    .then(() => console.info(`Reply sent for ${inputSymbol}`))
    .catch((e: Error) => console.error(e.message));
});
