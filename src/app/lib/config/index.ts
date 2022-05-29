import {config as dconfig} from 'dotenv';

export interface Config {
  botToken: string;
  apiUrl: string;
  logLevel: string;
  serviceName: string;
}
class AppConfiguration {
  private config: Config;

  constructor() {
    dconfig();
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      throw new Error('TELEGRAM_BOT_TOKEN is not set');
    }

    const apiUrl = process.env.TELEGRAM_WEBHOOK_URL || 'NOT_SET';

    const logLevel = process.env.LOG_LEVEL || 'info';

    const serviceName = process.env.SERVICE_NAME;
    if (!serviceName) {
      throw new Error('SERVICE_NAME is not set');
    }

    this.config = {botToken, apiUrl, logLevel, serviceName};
  }
  getConfig(): Config {
    return this.config;
  }
}

export const config = new AppConfiguration().getConfig();
