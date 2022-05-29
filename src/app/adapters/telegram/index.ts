import {Telegraf} from 'telegraf';
import {inject, injectable} from 'tsyringe';
import {ChatMessage} from '../../core/chat_message';
import {Config} from '../../lib/config';
import {Logger} from '../../lib/logger';

@injectable()
export class TelegramAdapter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private bot: Telegraf<any>;
  constructor(
    @inject('logger') protected logger: Logger,
    @inject('config') protected config: Config
  ) {
    this.logger = logger;
    this.config = config;
    this.bot = new Telegraf(config.botToken);
  }
  sendMessage(message: ChatMessage) {
    this.logger.info(`[TelegramAdapter] - Sending message ${message.uuid}`);
    this.bot.telegram.sendMessage(message.channelChatId, message.message);
  }
}
