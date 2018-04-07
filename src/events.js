const keys = require('./../keys.js')
const { bot } = require('./config')
const axios = require('axios')
const config = require('./../package.json')

const CAL_BASE_URL = 'https://api.coinmarketcal.com'

let accessToken, coinList

const auth = () => {
  return axios.get(`${CAL_BASE_URL}/oauth/v2/token`, {
    params: {
      grant_type: 'client_credentials',
      client_id: keys.COINMARKETCAL.CLIENT_ID,
      client_secret: keys.COINMARKETCAL.CLIENT_SECRET
    }
  })
}

auth().then(response => {
  accessToken = response.data.access_token
  getCoinList()
})

axios.defaults.headers.common['user-agent'] = `Crypto Helper/${config.version}`

const getCoinList = () => {
  axios.get(`${CAL_BASE_URL}/v1/coins`, {
    params: {
      access_token: accessToken
    }
  }).then(response => {
    coinList = response.data
    console.log('Data has been assigned to global variable')
  }).catch(error => console.log(error))
}

bot.onText(/\/events/, message => {
  const chatId = message.chat.id

  let strEvent
  const maxEvents = 3

  axios.get(`${CAL_BASE_URL}/v1/events`, {
    params: {
      access_token: accessToken,
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
  }).catch(error => console.log(error))
})

bot.onText(/\/event (.+)/, async (message, match) => {
  const chatId = message.chat.id
  const inputSymbol = match[1].toUpperCase()

  const coin = coinList.find(list => list.symbol.includes(inputSymbol))

  if (coin) {
    let event

    await axios.get(`${CAL_BASE_URL}/v1/events`, {
      params: {
        access_token: accessToken,
        coins: coinList[coin]
      }
    }).then(response => {
      event = response.data[0]
    }).catch(error => console.log(error))

    let reply

    if (event) {
      reply = `Here is an upcoming event for <b>${coin.name} (${coin.symbol})</b>:\n\n<b>Title:</b> ${event.title}\n<b>Date:</b> ${new Date(event.date_event).toLocaleDateString()}\n<b>Description:</b> ${event.description}\n\n<b>Source:</b> ${event.source}`
    } else {
      reply = `There are no event(s) for <b>${coinList[coin]}</b>.`
    }

    bot.sendMessage(chatId, reply, { parse_mode: 'html' }).then(() => console.log(`Event found for ${inputSymbol}.`))
  } else {
    const reply = `Unable to find *${inputSymbol}*.`

    bot.sendMessage(chatId, reply, { parse_mode: 'markdown' }).then(() => console.log(`Unable to find ${inputSymbol}.`))
  }
})
