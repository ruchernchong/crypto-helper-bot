import axios from 'axios'
import keys from './../keys.js'
import { bot, prefix } from './config.js'

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

auth().then(async response => {
  accessToken = response.data.access_token
  await getCoinList()
})

const getCoinList = async () => {
  coinList = await axios.get(`${CAL_BASE_URL}/v1/coins`, {
    params: {
      access_token: accessToken
    }
  }).then(response => {
    return response.data
  }).catch(error => console.log(error))

  console.log('Coinmarketcal data has been assigned to the global variable.')
}

bot.onText(/!events/, async message => {
  const chatId = message.chat.id

  let strEvent
  const maxEvents = 3

  let events

  events = await axios.get(`${CAL_BASE_URL}/v1/events`, {
    params: {
      access_token: accessToken,
      max: maxEvents
    }
  }).then(response => {
    return response.data
  }).catch(error => console.log(error))

  strEvent = `📅 Here are the latest <i>${maxEvents}</i> events:\n\n`

  events.forEach(event => {
    const coinName = event.coins[0].name
    const coinSymbol = event.coins[0].symbol

    strEvent += `<b>${coinName} (${coinSymbol})</b>\n<b>Title:</b> ${event.title}\n<b>Date:</b> ${new Date(event.date_event).toLocaleDateString()}\n<b>Details:</b> ${event.source}\n\n`
  })

  bot.sendMessage(chatId, strEvent, {
    parse_mode: 'html',
    disable_web_page_preview: true
  }).then(() => console.log(`Found events. Returning the ${maxEvents} latest events.`))
})

bot.onText(RegExp(`${prefix}event (.+)`), async (message, match) => {
  const chatId = message.chat.id
  const inputSymbol = match[1].toUpperCase()

  const coin = coinList.find(list => list.symbol.includes(inputSymbol))

  if (coin) {
    let event, reply

    event = await axios.get(`${CAL_BASE_URL}/v1/events`, {
      params: {
        access_token: accessToken,
        coins: coin.id
      }
    }).then(response => {
      return response.data[0]
    }).catch(error => console.log(error))

    if (event) {
      reply = `📅 Here is an upcoming event for <b>${coin.name} (${coin.symbol})</b>:\n\n<b>Title:</b> ${event.title}\n<b>Date:</b> ${new Date(event.date_event).toLocaleDateString()}\n<b>Description:</b> ${event.description}\n\n<b>Source:</b> ${event.source}`
    } else {
      reply = `There are no event(s) for <b>${coin.name} (${coin.symbol})</b>.`
    }

    bot.sendMessage(chatId, reply, { parse_mode: 'html' }).then(() => console.log(`Event found for ${inputSymbol}.`)).catch(error => console.log(error))
  } else {
    const reply = `Unable to find *${inputSymbol}*.`

    bot.sendMessage(chatId, reply, { parse_mode: 'markdown' }).then(() => console.log(`Unable to find ${inputSymbol}.`)).catch(error => console.log(error))
  }
})
