import {config as dconfig} from 'dotenv';

class AppConfiguration {
  public botToken: string;
  public apiUrl: string;

  constructor() {
    dconfig();
    this.botToken = process.env.TELEGRAM_BOT_TOKEN;
    this.apiUrl = process.env.TELEGRAM_WEBHOOK_URL;
    this.validateConfig();
  }
  validateConfig() {
    if (!this.botToken) {
      throw new Error('TELEGRAM_BOT_TOKEN is not set');
    }
    if (!this.apiUrl) {
      throw new Error('TELEGRAM_WEBHOOK_URL is not set');
    }
  }
}

export const config = new AppConfiguration();
