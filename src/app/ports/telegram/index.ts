import {inject, injectable} from 'tsyringe';
import {Telegraf} from 'telegraf';
import {Update} from 'telegraf/typings/core/types/typegram';
import {Logic} from '../../logic';
import {Logger} from '../../lib/logger';
import {Config} from '../../lib/config';
import {Channel, ChatMessage} from '../../core/chat_message';
import {nanoid} from 'nanoid';

@injectable()
export class TelegramPort {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected bot: Telegraf<any>;
  constructor(
    @inject('logger') protected logger: Logger,
    @inject('config') protected config: Config,
    @inject('logic') protected logic: Logic
  ) {
    this.logger = logger;
    this.logic = logic;
    this.config = config;

    logger.info(
      `[TelegramPort] - Telegram bot starting with token ${config.botToken}`
    );
    this.bot = new Telegraf(config.botToken, {
      telegram: {webhookReply: true},
    });
    this.setupHandlers();
    logger.info('[TelegramPort] - Telegram bot initialized');
  }
  setupHandlers() {
    this.bot.start(ctx => {
      this.logger.info(
        `[TelegramPort] - Telegram bot started with user ${ctx.from.id}`
      );
      ctx.reply('Welcome!');
    });
    this.bot.on('text', async ctx => {
      const chatMessage: ChatMessage = {
        uuid: nanoid(),
        message: ctx.message.text,
        channel: Channel.Telegram,
        channelChatId: String(ctx.chat.id),
        channelUsername: ctx.from.username,
        createdAt: new Date(ctx.message.date),
      };
      this.logger.info(`[TelegramPort] - Handling message ${chatMessage.uuid}`);
      await this.logic.handleChatMessage(chatMessage);
      //return ctx.reply(`You said: ${ctx.message.text}`);
    });

    this.logger.info('[TelegramPort] - Telegram bot launched');
    this.bot.launch({
      webhook: {
        domain: this.config.apiUrl,
      },
    });
  }

  handleTelegramPayload(payload: string) {
    this.logger.info('[TelegramPort] - Handling payload ');
    const update = JSON.parse(payload);
    return this.bot.handleUpdate(update);
  }
}
