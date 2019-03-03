const axios = require('axios').default

/**
 * Send any message to the respective Telegram chat
 *
 * @param {number} chatId
 * @param {string} message
 * @returns {Promise<void>}
 */
const sendMessageToTelegram = async (chatId, message) => {
  await axios.post(
    `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
    {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    }
  )
}

/**
 * Process the commands that are available on this bot
 *
 * @param {string} message
 * @returns {Promise<string>}
 */
const processCommands = async message => {
  let response

  const command = message.split(' ')[0]

  if (message.match(/\/mcap/)) {
    response = await require('./src/price').marketCap()
  } else if (message.match(/\/price [A-Za-z]{2,}/)) {
    response = await require('./src/price').coinInfo(message)
  } else if (message.match(/\/events/)) {
    response = await require('./src/event').events()
  } else if (message.match(/\/event [A-Za-z]{2,}/)) {
    response = await require('./src/event').event(message)
  } else {
    response = `The command <code>${command}</code> is an invalid command`
  }

  return response
}

/**
 * The main AWS Lambda function
 *
 * @param {object} event
 * @param {object} context
 */
exports.handler = (event, context) => {
  const body = JSON.parse(event.body)
  const chatId = body.message.chat.id
  const message = body.message.text

  processCommands(message).then(response => {
    sendMessageToTelegram(chatId, response)
      .then(response => context.succeed({ response }))
      .catch(error => context.fail(error))
  })
}
