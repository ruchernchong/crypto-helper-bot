/**
 * Set the /start message in Telegram
 *
 * @param message
 * @returns {string}
 */
const start = message => {
  let reply

  reply = `Hello ${
    message.from.first_name
  } and thank you for using me! This will get you started.\n\n`

  reply += 'You can control me with the follow commands:\n\n'
  reply += '*Events*\n'
  reply += '!events - Display 3 of the latest events\n'
  reply += '!event <symbol> - Display event(s) for the particular coin\n\n'
  reply += '*Prices*\n'
  reply += '$<symbol> - Display the price for the particular coin\n'
  reply +=
    '!mcap - Display the total market capitalisation and Bitcoin dominance\n\n'
  reply +=
    "As always, you are welcome to use the !help command to bring this page up again at anytime within the bot's chat.\n\n"

  return reply
}

/**
 * Sets the text for the help command in Telegram
 *
 * @param message
 * @returns {string}
 */
const help = message => {
  let reply

  reply = `Hello ${
    message.from.first_name
  }, I see you are having some trouble with me. Do not worry, I am here to help!\n\n`

  reply += 'You can control me with the follow commands:\n\n'
  reply += '*Events*\n'
  reply += '!events - Display 3 of the latest events\n'
  reply += '!event <symbol> - Display event(s) for the particular coin\n\n'
  reply += '*Prices*\n'
  reply += '$<symbol> - Display the price for the particular coin\n'
  reply +=
    '!mcap - Display the total market capitalisation and Bitcoin dominance\n\n'
  reply +=
    "As always, you are welcome to use the !help command to bring this page up again at anytime within the bot's chat.\n\n"

  return reply
}

module.exports = { start, help }
