const { token } = require('./../keys')
const axios = require('axios')
const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(token, { polling: true })
const config = require('./../package')

axios.defaults.headers.common['user-agent'] = `Crypto Helper/${config.version}`

const CAL_BASE_URL = 'https://coinmarketcal.com'
const PRICE_BASE_URL = 'https://api.coinmarketcap.com'

let coinList

axios.get(`${CAL_BASE_URL}/api/coins`).then(response => {
  coinList = response.data
  console.log('Data has been assigned to global variable')
}).catch(error => console.log(error))

bot.onText(/\/start|\/help/, (message, match) => {
  const chatId = message.chat.id
  const command = match[0]

  let reply = ''

  if (command === '/help') {
    reply += `Hello ${message.from.first_name}, I see you are having some trouble with me. Do not worry, I am here to help!\n\n`
  } else {
    reply += `Hello ${message.from.first_name} and thank you for using me! This will get you started.\n\n`
  }

  reply += 'You can control me with the follow commands:\n\n'
  reply += '*Events*\n'
  reply += '/events - Display 3 of the latest events\n'
  reply += '/event <symbol> - Display event(s) for the particular coin\n\n'
  reply += '*Prices*\n'
  reply += '/price <coin> - Display the price for the particular coin\n'
  reply += '/mcap - Display the total market capitalisation and Bitcoin dominance\n\n'
  reply += 'As always, you are welcome to use the /help command to bring this page up again at anytime within the bot\'s chat.\n\n'

  bot.sendMessage(chatId, reply, { parse_mode: 'markdown' })
})

bot.onText(/\/events/, message => {
  const chatId = message.chat.id

  let strEvent
  const maxEvents = 3

  axios.get(`${CAL_BASE_URL}/api/events`, {
    params: {
      max: maxEvents
    }
  }).then(response => {
    const events = response.data

    strEvent = `Here are the latest ${maxEvents} events:\n\n`

    events.forEach(event => {
      const coinName = event.coins[0].name
      const coinSymbol = event.coins[0].symbol

      strEvent += `<b>${coinName} (${coinSymbol})</b>\n<b>Title:</b> ${event.title}\n<b>Date:</b> ${new Date(event.date_event).toLocaleDateString()}\n<b>Details:</b> ${event.source}\n\n`
    })

    bot.sendMessage(chatId, strEvent, {
      parse_mode: 'html',
      disable_web_page_preview: true
    }).then(() => console.log('Found events. Returning the 3 latest events.'))
  })
})

bot.onText(/\/event (.+)/, async (message, match) => {
  const chatId = message.chat.id
  const inputSymbol = match[1].toUpperCase()

  const coinIndex = coinList.findIndex(list => list.includes(inputSymbol))

  if (coinIndex > -1) {
    let event

    await axios.get(`${CAL_BASE_URL}/api/events`, { params: { coins: coinList[coinIndex] } }).then(response => {
      event = response.data[0]
    })

    let reply

    if (event) {
      reply = `Here is an upcoming event for <b>${coinList[coinIndex]}</b>:\n\n<b>Title:</b> ${event.title}\n<b>Date:</b> ${new Date(event.date_event).toLocaleDateString()}\n<b>Description:</b> ${event.description}\n\n<b>Source:</b> ${event.source}`
    } else {
      reply = `There are no event(s) for <b>${coinList[coinIndex]}</b>.`
    }

    bot.sendMessage(chatId, reply, { parse_mode: 'html' }).then(() => console.log(`Event found for ${inputSymbol}.`))
  } else {
    const reply = `Unable to find *${inputSymbol}*.`

    bot.sendMessage(chatId, reply, { parse_mode: 'markdown' }).then(() => console.log(`Unable to find ${inputSymbol}.`))
  }
})

bot.onText(/\/mcap/, async message => {
  const chatId = message.chat.id

  await axios.get(`${PRICE_BASE_URL}/v1/global`).then(response => {
    const data = response.data

    const marketCap = `_$${parseFloat(data.total_market_cap_usd).toLocaleString('en')}_`
    const bitcoinDominace = `_${parseFloat(data.bitcoin_percentage_of_market_cap).toFixed(2)}%_`

    const reply = `*Total Market Cap:* ${marketCap}\n*Bitcoin Dominance:* ${bitcoinDominace}`

    bot.sendMessage(chatId, reply, { parse_mode: 'markdown' }).then(() => console.log('Total Market Cap in USD'))
  })
})

bot.onText(/\/price (.+)/, async (message, match) => {
  const chatId = message.chat.id
  const inputSymbol = match[1]

  let coinList

  await axios.get(`${PRICE_BASE_URL}/v1/ticker/?limit=0`).then(response => {
    coinList = response.data
  })

  const coinDetail = coinList.filter(item => item.symbol === inputSymbol.toUpperCase())[0]

  const rank = `*Rank:* _${coinDetail.rank}_`
  const mCap = `*Est. Market Cap (USD):* _$${parseFloat(coinDetail.market_cap_usd).toLocaleString('en')}_`
  const priceUSD = `*USD:* _$${parseFloat(coinDetail.price_usd)}_`
  const priceBTC = `*BTC:* _${parseFloat(coinDetail.price_btc).toFixed(8)} BTC_`
  const priceDelta = `*24hr Change:* _${parseFloat(coinDetail.percent_change_24h)}%_`

  const reply = `Price for *${coinDetail.name} (${coinDetail.symbol})*:\n\n${rank}\n${mCap}\n${priceUSD}\n${priceBTC}\n${priceDelta}`

  bot.sendMessage(chatId, reply, { parse_mode: 'markdown' }).then(() => console.log(`Found price for ${inputSymbol}`))
})
