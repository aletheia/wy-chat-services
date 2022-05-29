import {APIGatewayProxyHandlerV2} from 'aws-lambda';

import {Telegraf} from 'telegraf';
import {Update} from 'telegraf/typings/core/types/typegram';
import {containerInstance} from '../../container';
import {Config} from '../../lib/config';
import {Logger} from '../../lib/logger';

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  const container = containerInstance;
  const logger: Logger = container.resolve('logger');
  const config: Config = container.resolve('config');

  logger.info(event);

  logger.info(`Telegram bot starting with token ${config.botToken}`);
  const bot = new Telegraf(config.botToken, {
    telegram: {webhookReply: true},
  });
  logger.info('Telegram bot started');

  // bot.on('text', ({replyWithHTML}) => replyWithHTML('<b>Hello</b>'));

  bot.on('text', ctx => {
    logger.info(`Telegram bot received message: ${ctx.message.text}`);
    return ctx.reply(`You said: ${ctx.message.text}`);
  });

  bot.launch({
    webhook: {
      domain: config.apiUrl,
    },
  });
  logger.info('Telegram bot handle update');
  if (!event.body) {
    logger.error('Telegram bot event body is empty');
    return {
      statusCode: 400,
      body: 'Telegram bot event body is empty',
    };
  }
  return bot.handleUpdate(JSON.parse(event.body) as Update);

  // await bot.handleUpdate(event);
  // return {
  //   statusCode: 200,
  // };
};
