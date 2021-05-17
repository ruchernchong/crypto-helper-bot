import dedent from 'dedent';

import { fetchGlobalMetrics } from '../api';
import { commarise, formatPercentage } from '../utils';

/**
 * Get the global data for the entire Cryptocurrency market
 */
const getGlobalMetrics = async (): Promise<string> => {
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

  return dedent`
    *Total Est. Market Cap (USD):* ${marketCap}

    *Bitcoin Dominance:* ${bitcoinDominance}
    *Ethereum Dominance:* ${ethereumDominance}

    *Last updated:* ${[
      new Date(last_updated).toLocaleDateString(),
      new Date(last_updated).toLocaleTimeString()
    ].join(' ')}
    `;
};

export default getGlobalMetrics;
