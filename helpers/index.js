const axios = require('axios').default

/**
 * Parse the command from the message sent from Telegram
 *
 * @param {String} message
 * @returns {*}
 */
const parseCommand = message => {
  const tokens = message.split(' ')
  if (!tokens[0].match(/^\//)) {
    return null
  }

  const arrayCommands = []
  const command = tokens.shift()
  const match = command.match(/\/(\w*)/)

  if (match.length > 0) {
    arrayCommands[match[1]] = tokens
  }

  return arrayCommands
}

/**
 * Fetch the data based on the link provided from the respective command
 *
 * @param {String} link
 * @returns {Promise<Object>}
 */
const fetchData = async (link = null) => {
  let data = {}

  if (link) {
    data = await axios.get(link).catch(error => console.error(error))
  }

  console.log('Fetching data:', data)

  return data
}

module.exports = { parseCommand, fetchData }
