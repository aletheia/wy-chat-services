import 'reflect-metadata';
import {container} from 'tsyringe';
import {Logger} from './lib/logger';
import {config} from './lib/config';
import {Logic} from './logic';
import {TelegramPort} from './ports/telegram';
import {TelegramAdapter} from './adapters/telegram';
import {Adapters} from './adapters';

container.register('config', {useValue: config});
container.registerSingleton('logger', Logger);
container.register('logic', Logic);
container.register('telegramPort', TelegramPort);
container.register('adapters', Adapters);
container.register('telegramAdapter', TelegramAdapter);
export const containerInstance = container;
