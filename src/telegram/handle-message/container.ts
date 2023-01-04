import 'reflect-metadata';
import {container, DependencyContainer} from 'tsyringe';

import {Logic} from './logic';
import {TelegramPort} from './port';
import {TelegramAdapter} from './adapter';
import {Logger} from 'waylon-commons-lib';
import {loadConfig} from '../../config';

export const setupContainer = async (): Promise<DependencyContainer> => {
	const config = await loadConfig();
	container.register('config', {useValue: config});
	container.registerSingleton('logger', Logger);
	container.register('logic', Logic);
	container.register('telegramPort', TelegramPort);
	container.register('adapters', {useValue: [TelegramAdapter]});
	return container;
};
