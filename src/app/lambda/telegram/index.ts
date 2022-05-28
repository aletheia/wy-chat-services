import {APIGatewayProxyHandlerV2} from 'aws-lambda';
import {Telegraf} from 'telegraf';

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  console.log(event);
  console.log(context);

  const bot = new Telegraf(process.env.BOT_TOKEN, {
    telegram: {webhookReply: false},
  });

  // bot.on('text', ({replyWithHTML}) => replyWithHTML('<b>Hello</b>'));

  bot.on('text', ctx => {
    return ctx.reply('Hello from Lambda');
  });

  bot.launch({
    webhook: {
      domain: 'https://---.localtunnel.me',
      port: 3000,
    },
  });

  // await bot.handleUpdate(event);
  return {
    statusCode: 200,
  };
};
