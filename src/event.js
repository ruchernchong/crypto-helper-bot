const axios = require('axios').default

const CAL_BASE_URL = 'https://api.coinmarketcal.com'

let accessToken, coinList

const auth = () => {
  const params = {
    grant_type: 'client_credentials',
    client_id: process.env.COINMARKETCAL_CLIENT_ID,
    client_secret: process.env.COINMARKETCAL_CLIENT_SECRET
  }

  return axios.get(`${CAL_BASE_URL}/oauth/v2/token`, { params })
}

auth().then(async response => {
  accessToken = response.data.access_token

  await getCoinList()
})

const getCoinList = async () => {
  const params = { access_token: accessToken }

  coinList = await axios
    .get(`${CAL_BASE_URL}/v1/coins`, { params })
    .then(response => response.data)
    .catch(error => console.error(error))

  console.log('Coinmarketcal data has been assigned to the global variable.')
}

const events = async () => {
  let strEvent

  const maxEvents = 3

  const params = {
    access_token: accessToken,
    max: maxEvents
  }

  const events = await axios
    .get(`${CAL_BASE_URL}/v1/events`, { params })
    .then(response => response.data)
    .catch(error => console.error(error))

  strEvent = `📅 Here are the latest <i>${maxEvents}</i> events:\n\n`

  events.forEach(event => {
    const coinName = event.coins[0].name
    const coinSymbol = event.coins[0].symbol

    strEvent += `<b>${coinName} (${coinSymbol})</b>\n<b>Title:</b> ${
      event.title
    }\n<b>Date:</b> ${new Date(
      event.date_event
    ).toLocaleDateString()}\n<b>Details:</b> ${event.source}\n\n`
  })

  return strEvent
}

const event = async message => {
  const inputSymbol = message.split(' ')[1].toUpperCase()

  const coin = coinList.find(list => list.symbol.includes(inputSymbol))

  let reply

  if (coin) {
    const params = {
      access_token: accessToken,
      coins: coin.id
    }

    const event = await axios
      .get(`${CAL_BASE_URL}/v1/events`, { params })
      .then(response => response.data[0])
      .catch(error => console.error(error))

    if (event) {
      reply = `📅 Here is an upcoming event for <b>${coin.name} (${
        coin.symbol
      })</b>:\n\n<b>Title:</b> ${event.title}\n<b>Date:</b>${new Date(
        event.date_event
      ).toLocaleDateString()}\n<b>Description:</b> ${
        event.description
      }\n\n<b>Source:</b> ${event.source}`
    } else {
      reply = `There are no event(s) for <b>${coin.name} (${coin.symbol})</b>.`
    }
  } else {
    reply = `Unable to find *${inputSymbol}*.`
  }

  return reply
}

module.exports = { events, event }
