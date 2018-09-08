'use strict'

import keys from './../keys'
import TelegramBot from 'node-telegram-bot-api'

module.exports = {
  bot: new TelegramBot(keys.TELEGRAM.TOKEN, { polling: true }),
  prefix: '!'
}
