const axios = require('axios').default

const SITE_BASE_URL = 'https://coinmarketcap.com'
const API_BASE_URL = 'https://pro-api.coinmarketcap.com'

axios.defaults.headers.common['X-CMC_PRO_API_KEY'] =
  process.env.COINMARKETCAP_API_KEY

/**
 * Retrieve the Global Market Capitalisation from CoinMarketCap
 *
 * @returns {Promise<string>}
 */
const marketCap = async () => {
  const data = await axios
    .get(`${API_BASE_URL}/v1/global-metrics/quotes/latest`)
    .then(response => response.data.data)
    .catch(err => console.error(err))

  const marketCap = `_$${parseFloat(
    data.quote.USD.total_market_cap
  ).toLocaleString('en')}_`
  const bitcoinDominance = `_${parseFloat(data.btc_dominance).toFixed(2)}%_`
  const ethereumDominance = `_${parseFloat(data.eth_dominance).toFixed(2)}%_`

  return `*Total Est. Market Cap (USD):* ${marketCap}\n*Bitcoin Dominance:* ${bitcoinDominance}\n*Ethereum Dominance:* ${ethereumDominance}`
}

/**
 * Retrieve the price information of a particular coin given by its symbol
 *
 * @param {string} input
 * @returns {Promise<string>}
 */
const coinInfo = async input => {
  const inputSymbol = input.split(' ')[1].toUpperCase()

  const coin = await axios
    .get(
      `${API_BASE_URL}/v1/cryptocurrency/quotes/latest?symbol=${inputSymbol}`
    )
    .then(response => response.data.data[inputSymbol])
    .catch(error => console.error(error))

  let reply
  let name, symbol, rank, mCap, priceUSD, priceDelta, link

  if (coin) {
    name = coin.name
    symbol = coin.symbol
    rank = `*Rank:* _${coin.cmc_rank}_`
    mCap = `*Est. Market Cap (USD):* _$${parseFloat(
      coin.quote.USD.market_cap
    ).toLocaleString('en')}_`
    priceUSD = `*USD:* _$${parseFloat(coin.quote.USD.price).toLocaleString(
      'en'
    )}_`
    priceDelta = `*24hr Change:* _${parseFloat(
      coin.quote.USD.percent_change_24h
    ).toFixed(2)}%_ ${coin.quote.USD.percent_change_24h < 0 ? '📉' : '📈'}`
    link = `*Link:* ${SITE_BASE_URL}/currencies/${coin.name
      .toLowerCase()
      .replace(/\s+/g, '-')}`

    reply = `💰 Here is the current price for *${name} (${symbol})*:\n\n${rank}\n${mCap}\n${priceUSD}\n${priceDelta}\n\n${link}`
  } else {
    reply = `Unable to find *${inputSymbol}*`
  }

  return reply
}

module.exports = { marketCap, coinInfo }
