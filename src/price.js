import axios from 'axios'
import { bot, prefix } from './config.js'
import { COINMARKETCAP } from './../keys'

const SITE_BASE_URL = 'https://coinmarketcap.com'
const API_BASE_URL = 'https://pro-api.coinmarketcap.com'

axios.defaults.headers.common['X-CMC_PRO_API_KEY'] = COINMARKETCAP.API_KEY

bot.onText(RegExp(`${prefix}mcap`), async message => {
  const chatId = message.chat.id

  let data = await axios
    .get(`${API_BASE_URL}/v1/global-metrics/quotes/latest`)
    .then(response => {
      return response.data
    })

  const marketCap = `_$${parseFloat(
    data.data.quote.USD.total_market_cap
  ).toLocaleString('en')}_`
  const bitcoinDominance = `_${parseFloat(data.data.btc_dominance).toFixed(
    2
  )}%_`
  const ethereumDominance = `_${parseFloat(data.data.eth_dominance).toFixed(
    2
  )}%_`

  const reply = `*Total Est. Market Cap (USD):* ${marketCap}\n*Bitcoin Dominance:* ${bitcoinDominance}\n*Ethereum Dominance:* ${ethereumDominance}`

  bot
    .sendMessage(chatId, reply, { parse_mode: 'markdown' })
    .then(() => console.info('Total Market Cap in USD'))
    .catch(error => console.error(error))
})

bot.onText(/(\$[A-Za-z]{2,})/, async (message, match) => {
  const chatId = message.chat.id
  const { input } = match
  const inputSymbol = input.split('$')[1].toUpperCase()

  let coin = await axios
    .get(
      `${API_BASE_URL}/v1/cryptocurrency/quotes/latest?symbol=${inputSymbol}`
    )
    .then(response => response.data.data[inputSymbol])
    .catch(error => console.error(error.message))

  let reply, name, symbol, rank, mCap, priceUSD, priceDelta, link

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

  bot
    .sendMessage(chatId, reply, { parse_mode: 'markdown' })
    .then(() => console.info(`Reply sent for ${inputSymbol}`))
    .catch(error => console.error(error.message))
})
