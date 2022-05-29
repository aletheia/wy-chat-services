import {config} from '../src/app/lib/config';
import axios from 'axios';

(async () => {
  const my_bot_token = config.botToken;
  const url_to_send_updates_to = config.apiUrl;
  const url = `https://api.telegram.org/bot${my_bot_token}/setWebhook?url=${url_to_send_updates_to}`;
  const response = await axios.get(url);
  console.log(response.data);
  const verifyUrl = `https://api.telegram.org/bot${my_bot_token}/getWebhookInfo`;
  const verifyResponse = await axios.get(verifyUrl);
  console.log(verifyResponse.data);
})();
