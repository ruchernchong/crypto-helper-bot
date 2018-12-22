const axios = require('axios').default
const { start, help } = require('./src/help')
const { marketCap, coinInfo } = require('./src/price')
const { events, event } = require('./src/event')

/**
 *
 * @param {number} chatId
 * @param {string} message
 * @param {string} parseMode
 * @returns {Promise<void>}
 */
const sendMessageToTelegram = async (chatId, message) => {
  await axios.post(
    `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
    {
      chat_id: chatId,
      text: message
    }
  )
}

const processCommands = async message => {
  let response

  if (message.match(/\/start/)) {
    response = await start(message)
  } else if (message.match(/(!help)/)) {
    response = await help(message)
  } else if (message.match(/!mcap/)) {
    response = await marketCap()
  } else if (message.match(/(!price [A-Za-z]{2,})/)) {
    response = await coinInfo(message)
  } else if (message.match(/!events/)) {
    response = await events()
  } else if (message.match(/(!event [A-Za-z]{2,})/)) {
    response = await event(message)
  } else {
    response = `The command ${message} is an invalid command`
  }

  return response
}

exports.handler = (event, context) => {
  const body = JSON.parse(event.body)
  const chatId = body.message.chat.id
  const message = body.message.text

  processCommands(message).then(response => {
    sendMessageToTelegram(chatId, response)
      .then(response => context.succeed({ response }))
      .catch(error => console.error(error))
  })
}
