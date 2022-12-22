import {Telegraf} from 'telegraf';
import {inject, injectable} from 'tsyringe';
import {Logger} from 'waylon-commons-lib';
import {WayChatConfig} from '../../config';
import {ChatMessage} from '../../core/chat_message';

@injectable()
export class TelegramAdapter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private bot: Telegraf<any>;
  constructor(
    @inject('logger') protected logger: Logger,
    @inject('config') protected config: WayChatConfig
  ) {
    this.logger = logger;
    this.config = config;
    this.bot = new Telegraf(config.telegramBotToken);
  }
  sendMessage(message: ChatMessage) {
    this.logger.info(`[TelegramAdapter] - Sending message ${message.uuid}`);
    this.bot.telegram.sendMessage(message.channelChatId, message.message);
  }
}
