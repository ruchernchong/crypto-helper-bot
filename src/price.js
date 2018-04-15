const axios = require('axios')
const { bot } = require('./config.js')

const SITE_BASE_URL = 'https://coinmarketcap.com'
const API_BASE_URL = 'https://api.coinmarketcap.com'

bot.onText(/\/mcap/, async message => {
  const chatId = message.chat.id

  await axios.get(`${API_BASE_URL}/v1/global`).then(response => {
    const data = response.data

    const marketCap = `_$${parseFloat(data.total_market_cap_usd).toLocaleString('en')}_`
    const bitcoinDominance = `_${parseFloat(data.bitcoin_percentage_of_market_cap).toFixed(2)}%_`

    const reply = `*Total Market Cap:* ${marketCap}\n*Bitcoin Dominance:* ${bitcoinDominance}`

    bot.sendMessage(chatId, reply, { parse_mode: 'markdown' }).then(() => console.log('Total Market Cap in USD')).catch(error => console.log(error))
  })
})

bot.onText(/\/price (.+)/, async (message, match) => {
  const chatId = message.chat.id
  const inputSymbol = match[1]

  let coinList

  await axios.get(`${API_BASE_URL}/v1/ticker/?limit=0`).then(response => {
    coinList = response.data
  }).catch(error => console.log(error))

  let reply, name, symbol, rank, mCap, priceUSD, priceBTC, priceETH, priceDelta, link

  const coinDetail = coinList.find(item => item.symbol === inputSymbol.toUpperCase())

  const getEthereum = coinList.find(item => item.symbol === 'ETH')

  if (coinDetail) {
    name = coinDetail.name
    symbol = coinDetail.symbol
    rank = `*Rank:* _${coinDetail.rank}_`
    mCap = `*Est. Market Cap (USD):* _$${parseFloat(coinDetail.market_cap_usd).toLocaleString('en')}_`
    priceUSD = `*USD:* _$${parseFloat(coinDetail.price_usd).toLocaleString('en')}_`
    priceBTC = `*BTC:* _${parseFloat(coinDetail.price_btc).toFixed(8)} BTC_`
    priceETH = `*ETH:* _${parseFloat(coinDetail.price_btc / getEthereum.price_btc).toFixed(8)} ETH_`
    priceDelta = `*24hr Change:* _${parseFloat(coinDetail.percent_change_24h)}%_`
    link = `*Link:* ${SITE_BASE_URL}/currencies/${coinDetail.name.toLowerCase().replace(/\s+/, '-')}`

    reply = `Price for *${name} (${symbol})*:\n\n${rank}\n${mCap}\n${priceUSD}\n${isBitcoin(inputSymbol) ? '' : `${priceBTC}`}\n${isEthereum(inputSymbol) ? '' : `${priceETH}`}\n${priceDelta}\n${link}`
  } else {
    reply = `Unable to find *${inputSymbol}*`
  }

  bot.sendMessage(chatId, reply, { parse_mode: 'markdown' }).then(() => console.log(`Reply sent for ${inputSymbol}`)).catch(error => console.log(error))
})

const isBitcoin = (symbol) => {
  return symbol.includes('BTC')
}

const isEthereum = symbol => {
  return symbol.includes('ETH')
}
