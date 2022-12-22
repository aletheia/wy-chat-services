import {AppConfig, StandardConfig} from 'waylon-commons-lib';

export interface WayChatConfig extends StandardConfig {
	telegramBotToken: string;
	telegramWebhookUrl: string;
}
export const loadConfig = async (): Promise<WayChatConfig> => {
	const appName = 'waychat';
	const stage = 'dev';
	const keyList = [
		'/waychat/dev/logLevel',
		'/waychat/dev/serviceName',
		'/waychat/dev/telegramBotToken',
		'/waychat/dev/telegramWebhookUrl',
	];
	const config = await AppConfig.loadFromSSM<WayChatConfig>(
		keyList,
		appName,
		stage,
	);
	return config;
};
