import dedent from 'dedent';

import { fetchQuote } from '../api';
import { commarise, formatPercentage, formatPrice, slugify } from '../utils';
import { Coin } from '../types';

const SITE_BASE_URL = 'https://coinmarketcap.com';

/**
 * Get the price detail for the given symbol
 *
 * @param inputSymbol
 */
const getPriceFromSymbol = async (inputSymbol: string): Promise<string> => {
  const coin: Coin = await fetchQuote(inputSymbol);

  const { cmc_rank, name, quote, symbol } = coin;
  const {
    USD: { market_cap, percent_change_24h, price }
  } = quote;
  const directionOfChange: string = percent_change_24h < 0 ? '📉' : '📈';

  if (coin) {
    return dedent`
      💰 Here is the current price for *${name} (${symbol})*:

      *Rank:* _${cmc_rank}_
      *Est. Market Cap (USD):* _$${commarise(market_cap)}_
      *USD:* _${formatPrice(price, 8)}_
      *24hr Change:* _${formatPercentage(
        percent_change_24h
      )}%_ ${directionOfChange}

      *Link:* ${SITE_BASE_URL}/currencies/${slugify(name)}
    `;
  } else {
    return dedent`
      Unable to find *${inputSymbol}*
    `;
  }
};

export default getPriceFromSymbol;
