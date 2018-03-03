const {token} = require('./../keys')
const axios = require('axios')
const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(token, {polling: true})

axios.defaults.headers.common['user-agent'] = 'Crypto Helper/1.0.0'

const BASE_URL = 'https://coinmarketcal.com'

let coinList

axios.get(`${BASE_URL}/api/coins`).then(response => {
  coinList = response.data
  console.log('Data has been assigned to global variable')
}).catch(error => {
  console.log(error)
})

bot.onText(/\/events/, message => {
  const chatId = message.chat.id

  let strEvent

  axios.get(`${BASE_URL}/api/events`, {
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

    strEvent += `More events can be found on ${BASE_URL}`

    bot.sendMessage(chatId, strEvent, {
      disable_web_page_preview: true,
      reply_to_message_id: message.message_id
    }).then(() => console.log('Found events. Returning the 3 latest events.'))
  })
})

bot.onText(/\/event (.+)/, (message, match) => {
  const chatId = message.chat.id
  const coin = match[1]

  const index = coinList.findIndex(list => list.includes(coin))

  if (index > -1) {
    axios.get(`${BASE_URL}/api/events`, {
      params: {
        coins: coinList[index],
        max: 1
      }
    }).then(response => {
      const event = response.data[0]

      let reply

      if (response.data.length > 0) {
        reply = `Here is an upcoming event for ${coinList[index]}:\n\nThis event has been voted: ${event.positive_vote_count}/${event.vote_count} (${event.percentage}%)\n\nTitle: ${event.title}\nDate: ${new Date(event.date_event).toLocaleDateString()}\nDescription: ${event.description}\nSource: ${event.source}\n${BASE_URL}`
      } else {
        reply = `There are no event(s) for ${coinList[index]}.`
      }

      bot.sendMessage(chatId, reply, {
        reply_to_message_id: message.message_id
      }).then(() => console.log(`Event found for ${coin}.`))
    })
  } else {
    const reply = `Unable to find *${coin}*. This coin might not exist (yet).`

    bot.sendMessage(chatId, reply, {
      parse_mode: 'markdown',
      reply_to_message_id: message.message_id
    }).then(() => console.log(`Unable to find ${coin}.`))
  }
})
