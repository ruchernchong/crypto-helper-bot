const axios = require('axios').default
const helper = require('./helper')
const commands = require('./commands')

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
 * @param {string} message AWS Lambda Event
 * @returns {Promise<string>}
 */
const processCommands = async message => {
  if (message) {
    const args = helper.parseCommand(message.trim())

    if (args === null) {
      await commands.error(`The command <code>${message}</code> is invalid.`)
    }

    const keys = Object.keys(args)

    if (keys.length === 0 && !commands[keys[0]]) {
      await commands.error(`The command <code>${message}</code> is invalid.`)
    }

    const command = keys[0]

    const commandExist = Object.keys(commands).includes(command)

    if (commandExist) {
      return commands[command](args[command])
    } else {
      await commands.error(`The command <code>${message}</code> is invalid.`)
    }
  }
}

/**
 * The main AWS Lambda function
 *
 * @param {object} event AWS Lambda uses this parameter to pass in event data to the handler.
 * @param {object} context AWS Lambda uses this parameter to provide your handler the runtime information of the Lambda function that is executing.
 */
exports.handler = (event, context) => {
  const body = JSON.parse(event.body)
  const chatId = body.message.chat.id
  const message = body.message.text

  processCommands(message)
    .then(response => {
      sendMessageToTelegram(chatId, response)
        .then(response => context.succeed({ response }))
        .catch(() => context.fail())
    })
    .catch(error => {
      sendMessageToTelegram(chatId, error.message)
        .then(response => context.succeed({ response }))
        .catch(() => context.fail())
    })
}
