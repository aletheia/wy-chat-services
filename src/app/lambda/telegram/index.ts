import {APIGatewayProxyHandlerV2} from 'aws-lambda';
import {containerInstance} from '../../container';
import {Logger} from '../../lib/logger';
import {TelegramPort} from '../../ports/telegram';

export const handler: APIGatewayProxyHandlerV2 = async event => {
  const container = containerInstance;
  const logger: Logger = container.resolve('logger');
  const port: TelegramPort = container.resolve('telegramPort');

  try {
    logger.info(event);

    logger.info('Telegram bot handle update');
    if (!event.body) {
      logger.error('Telegram bot event body is empty');
      return {
        statusCode: 400,
        body: 'Telegram bot event body is empty',
      };
    }

    logger.info('Telegram bot handle update');
    await port.handleTelegramPayload(event.body);

    logger.info('Telegram bot handle update done');
    return {
      statusCode: 200,
      body: 'Telegram message handled',
    };
  } catch (e) {
    logger.error(e);
    const error: Error = e as Error;
    return {
      statusCode: 500,
      body: error.message,
    };
  }
};
