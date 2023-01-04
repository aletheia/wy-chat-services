export enum Channel {
	Telegram = 'telegram',
	Web = 'web',
	Discord = 'discord',
}

export interface ChatUser {
	uuid: string;
	username: string;
}

export interface ChatMessage {
	uuid: string;
	message: string;
	user?: ChatUser;
	chatId?: string;
	channel: Channel;
	channelChatId: string;
	channelUsername?: string;
	createdAt: Date;
}
