import {Telegraf} from 'telegraf';
import {Logger} from 'winston';
import {WayChatConfig} from '../../config';
import {Channel, ChatMessage} from '../../core/chat_message';

export interface IAdapter {
	sendMessage(message: ChatMessage): void;
}

export class TelegramAdapter {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private bot: Telegraf<any>;
	constructor(
		@inject('logger') protected logger: Logger,
		@inject('config') protected config: WayChatConfig,
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
