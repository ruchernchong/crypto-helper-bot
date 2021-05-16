import { Coin } from '../types';
import { fetchCoinList } from '../api';

/**
 * Fetch the list of coins on the events calendar
 *
 * @param inputSymbol
 */
const getCoinFromEvents = async (inputSymbol: string): Promise<Coin> => {
  const coinList: Coin[] = await fetchCoinList();

  return coinList.find((list: Coin) => list.symbol.includes(inputSymbol));
};

export default getCoinFromEvents;
