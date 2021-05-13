import { TELEGRAM_BOT_TOKEN } from '../keys';
import TelegramBot from 'node-telegram-bot-api';

export const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {
  polling: true
});

export const prefix: string = '!';
