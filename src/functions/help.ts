import dedent from 'dedent';

export const help = (ctx) => {
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
};

export default help;
