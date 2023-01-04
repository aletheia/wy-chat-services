import axios from 'axios';
import {Logger} from 'waylon-commons-lib';
import {WayChatConfig} from '../../config';
import {setupContainer} from '../handle-message/container';

export const handler = async () => {
	const container = await setupContainer();
	const logger: Logger = container.resolve('logger');
	const config: WayChatConfig = container.resolve('config');

	logger.info('Telegram webhook received');
	logger.info(config);
	console.log(`config: ${JSON.stringify(config)}`);

	const my_bot_token = config.telegramBotToken;
	const url_to_send_updates_to = config.telegramWebhookUrl;
	const url = `https://api.telegram.org/bot${my_bot_token}/setWebhook?url=${url_to_send_updates_to}`;
	const response = await axios.get(url);
	logger.info(response.data);
	//   const verifyUrl = `https://api.telegram.org/bot${my_bot_token}/getWebhookInfo`;
	//   const verifyResponse = await axios.get(verifyUrl);
	//   const verifyData = verifyResponse.data;
	//   logger.info(verifyData);
	return {
		statusCode: 200,
		body: JSON.stringify(response.data),
	};
};
