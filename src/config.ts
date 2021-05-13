import { Context, Telegraf } from 'telegraf';

export const bot = new Telegraf<Context>(process.env.TELEGRAM_BOT_TOKEN);
export const prefix: string = '!';

bot.launch().then(() => console.info('Bot started at:', Date.now()));
