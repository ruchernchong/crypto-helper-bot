import TelegramBot from 'node-telegram-bot-api';

export const bot = new TelegramBot(`${process.env.TELEGRAM_BOT_TOKEN}`, {
  polling: true
});

export const prefix: string = '!';
