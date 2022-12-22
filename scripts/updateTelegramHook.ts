import axios from 'axios';
import {AppConfig, StandardConfig} from 'waylon-commons-lib';

export interface WayChatConfig extends StandardConfig {
  telegramBotToken: string;
  apiUrl: string;
}

(async () => {
  const appName = 'waychat';
  const stage = 'dev';
  const keyList = [
    '/waychat/dev/logLevel',
    '/waychat/dev/serviceName',
    '/waychat/dev/telegramBotToken',
  ];
  const config = await AppConfig.loadFromSSM<WayChatConfig>(
    keyList,
    appName,
    stage
  );
  const my_bot_token = config.botToken;
  const url_to_send_updates_to = config.apiUrl;
  const url = `https://api.telegram.org/bot${my_bot_token}/setWebhook?url=${url_to_send_updates_to}`;
  const response = await axios.get(url);
  console.log(response.data);
  const verifyUrl = `https://api.telegram.org/bot${my_bot_token}/getWebhookInfo`;
  const verifyResponse = await axios.get(verifyUrl);
  console.log(verifyResponse.data);
})();
