import { bot, prefix } from './config.js';
import './event.js';
import './price.js';

bot.onText(RegExp(`/start|${prefix}help`), (message, match) => {
  const chatId: number = message.chat.id;
  const command: string = match?.[0] || '';

  let reply: string = '';

  const firstName = message?.from?.first_name;

  if (command === `${prefix}help`) {
    reply += `Hello ${firstName}, I see you are having some trouble with me. Do not worry, I am here to help!\n\n`;
  } else {
    reply += `Hello ${firstName} and thank you for using me! This will get you started.\n\n`;
  }

  reply += 'You can control me with the follow commands:\n\n';
  reply += '*Events*\n';
  reply += '!events - Display 3 of the latest events\n';
  reply += '!event <symbol> - Display event(s) for the particular coin\n\n';
  reply += '*Prices*\n';
  reply += '$<symbol> - Display the price for the particular coin\n';
  reply +=
    '!mcap - Display the total market capitalisation and Bitcoin dominance\n\n';
  reply +=
    "As always, you are welcome to use the !help command to bring this page up again at anytime within the bot's chat.\n\n";

  bot
    .sendMessage(chatId, reply, {
      parse_mode: 'Markdown'
    })
    .then(() => console.log(`Message sent for ${command} command`))
    .catch((e: Error) => console.error(e));
});
