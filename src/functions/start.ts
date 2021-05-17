import dedent from 'dedent';

export const start = (ctx) => {
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
};

export default start;
