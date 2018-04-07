'use strict'

const keys = require('./../keys')
const TelegramBot = require('node-telegram-bot-api')

module.exports = {
  bot: new TelegramBot(keys.TELEGRAM.TOKEN, { polling: true })
}
