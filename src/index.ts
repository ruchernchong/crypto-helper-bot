import dotenv from 'dotenv';
import dedent from 'dedent';
dotenv.config();
import { bot } from './config.js';
import './event.js';
import './price.js';

bot.start((ctx) => {
  const {
    message: {
      from: { first_name },
      text
    }
  } = ctx;

  const reply: string = dedent`
    Hello ${first_name} and thank you for using me! This will get you started.

    You can control me with the follow commands:

    *Events*
    !events - Display 3 of the latest events
    (e.g. \`!event $BTC\`) - Display event(s) for the particular coin

    *Prices*
    (e.g. \`$BTC\`) - Display the price for the particular coin
    /mcap - Display the total market capitalisation and Bitcoin dominance

    As always, you are welcome to use the /help command to bring this page up at anytime inside this chat.
  `;

  ctx
    .replyWithMarkdown(reply)
    .then(() => console.info(`Message sent for ${text} command`))
    .catch((e: Error) => console.error(e));
});

bot.help((ctx) => {
  const {
    message: {
      from: { first_name },
      text
    }
  } = ctx;

  const reply: string = dedent`
    Hello ${first_name}, I see you are having some trouble with me. Do not worry, I am here to help!

    You can control me with the follow commands:

    *Events*
    !events - Display 3 of the latest events
    !event <symbol> - Display event(s) for the particular coin

    *Prices*
    $<symbol> - Display the price for the particular coin
    !mcap - Display the total market capitalisation and Bitcoin dominance

    As always, you are welcome to use the !help command to bring this page up again at anytime within the bot's chat.
  `;

  ctx
    .replyWithMarkdown(reply)
    .then(() => console.info(`Message sent for ${text} command`))
    .catch((e: Error) => console.error(e));
});
