const axios = require('axios').default
const price = require('./src/price')

const sendMessageToTelegram = async (chatId, message) => {
  await axios.post(
    `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
    {
      chat_id: chatId,
      text: message,
      parse_mode: 'markdown'
    }
  )
}

const processCommands = async message => {
  let response

  if (message.includes('!mcap')) {
    response = await price.marketCap()
  } else if (message.match(/(\$[A-Za-z]{2,})/)) {
    response = await price.coinInfo(message)
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
