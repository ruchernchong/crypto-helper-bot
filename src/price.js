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

  const marketCap = `<i>$${parseFloat(
    data.quote.USD.total_market_cap
  ).toLocaleString('en')}</i>`
  const bitcoinDominance = `<i>${parseFloat(data.btc_dominance).toFixed(
    2
  )}%</i>`
  const ethereumDominance = `<i>${parseFloat(data.eth_dominance).toFixed(
    2
  )}%</i>`

  return `<b>Total Est. Market Cap (USD):</b> ${marketCap}\n<b>Bitcoin Dominance:</b> ${bitcoinDominance}\n<b>Ethereum Dominance:</b> ${ethereumDominance}`
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
    rank = `<b>Rank:</b> <i>${coin.cmc_rank}</i>`
    mCap = `<b>Est. Market Cap (USD):</b> <i>$${parseFloat(
      coin.quote.USD.market_cap
    ).toLocaleString('en')}</i>`
    priceUSD = `<b>USD:</b> <i>$${parseFloat(
      coin.quote.USD.price
    ).toLocaleString('en')}</i>`
    priceDelta = `<b>24hr Change:</b> <i>${parseFloat(
      coin.quote.USD.percent_change_24h
    ).toFixed(2)}%</i> ${coin.quote.USD.percent_change_24h < 0 ? '📉' : '📈'}`
    link = `<b>Link:</b> ${SITE_BASE_URL}/currencies/${coin.name
      .toLowerCase()
      .replace(/\s+/g, '-')}`

    reply = `💰 Here is the current price for <b>${name} (${symbol})</b>:\n\n${rank}\n${mCap}\n${priceUSD}\n${priceDelta}\n\n${link}`
  } else {
    reply = `Unable to find <b>${inputSymbol}</b>`
  }

  return reply
}

module.exports = { marketCap, coinInfo }
