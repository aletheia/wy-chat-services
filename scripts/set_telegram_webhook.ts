const my_bot_token = process.env.TELEGRAM_BOT_TOKEN;
const url_to_send_updates_to = '';
const url = `https://api.telegram.org/bot${my_bot_token}/setWebhook?url=${url_to_send_updates_to}`;
