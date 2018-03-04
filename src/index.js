const {token} = require('./../keys')
const axios = require('axios')
const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(token, {polling: true})

axios.defaults.headers.common['user-agent'] = 'Crypto Helper/1.0.0'

const CAL_BASE_URL = 'https://coinmarketcal.com'
const COIN_BASE_URL = 'https://coincap.io'

let coinList

axios.get(`${CAL_BASE_URL}/api/coins`).then(response => {
  coinList = response.data
  console.log('Data has been assigned to global variable')
}).catch(error => console.log(error))

bot.onText(/\/events/, message => {
  const chatId = message.chat.id

  let strEvent

  axios.get(`${CAL_BASE_URL}/api/events`, {
    params: {
      max: 3
    }
  }).then(response => {
    const events = response.data

    strEvent = 'Here are the latest events:\n\n'

    events.forEach(event => {
      const coinName = event.coins[0].name
      const coinSymbol = event.coins[0].symbol

      strEvent += `${coinName} (${coinSymbol})\nTitle: ${event.title}\nDate: ${new Date(event.date_event).toLocaleDateString()}\nMore details: ${event.source}\n\n`
    })

    bot.sendMessage(chatId, strEvent, {
      parse_mode: 'markdown',
      disable_web_page_preview: true
    }).then(() => console.log('Found events. Returning the 3 latest events.'))
  })
})

bot.onText(/\/event (.+)/, (message, match) => {
  const chatId = message.chat.id
  const coin = match[1]

  const index = coinList.findIndex(list => list.includes(coin))

  if (index > -1) {
    axios.get(`${CAL_BASE_URL}/api/events`, {
      params: {
        coins: coinList[index],
        max: 1
      }
    }).then(response => {
      const event = response.data[0]

      let reply

      if (response.data.length > 0) {
        reply = `Here is an upcoming event for ${coinList[index]}:\n\nThis event has been voted: ${event.positive_vote_count}/${event.vote_count} (${event.percentage}%)\n\nTitle: ${event.title}\nDate: ${new Date(event.date_event).toLocaleDateString()}\nDescription: ${event.description}\nSource: ${event.source}\n${CAL_BASE_URL}`
      } else {
        reply = `There are no event(s) for ${coinList[index]}.`
      }

      bot.sendMessage(chatId, reply, {parse_mode: 'markdown'}).then(() => console.log(`Event found for ${coin}.`))
    })
  } else {
    const reply = `Unable to find *${coin}*. This coin might not exist (yet).`

    bot.sendMessage(chatId, reply, {parse_mode: 'markdown'}).then(() => console.log(`Unable to find ${coin}.`))
  }
})

bot.onText(/\/mcap/, message => {
  const chatId = message.chat.id

  axios.get(`${COIN_BASE_URL}/global`).then(response => {
    const data = response.data

    const reply = `Total Market Cap: _$${data.totalCap.toLocaleString('en')}_`

    bot.sendMessage(chatId, reply, {parse_mode: 'markdown'}).then(() => console.log('Total Market Cap'))
  })
})

bot.onText(/\/coin (.+)/, (message, match) => {
  const chatId = message.chat.id
  const coin = match[1]

  axios.get(`${COIN_BASE_URL}/page/${coin}`).then(response => {
    const data = response.data

    const rank = `*Rank:* _${data.rank}_`
    const mCap = `*Est. Market Cap (USD):* _$${data.market_cap.toLocaleString('en')}_`
    const priceUSD = `*USD:* _$${data.price_usd}_`
    const priceBTC = `*BTC:* _${data.price_btc} BTC_`
    const priceETH = `*ETH:* _${data.price_eth} ETH_`
    const priceDelta = `*24hr Change:* _${data.cap24hrChange}%_`

    const reply = `Price of *${coin}*:\n\n${rank}\n${mCap}\n${priceUSD}\n${priceBTC}\n${priceETH}\n${priceDelta}`

    bot.sendMessage(chatId, reply, {parse_mode: 'markdown'}).then(() => console.log(`Found price for ${coin}`))
  })
})
