import 'reflect-metadata';
import {container} from 'tsyringe';

import {Logic} from './logic';
import {TelegramPort} from './ports/telegram';
import {TelegramAdapter} from './adapters/telegram';
import {Adapters} from './adapters';
import {Logger} from 'waylon-commons-lib';
import {loadConfig} from './config';

export const setupContainer = async () => {
  const config = await loadConfig();
  container.register('config', {useValue: config});
  container.registerSingleton('logger', Logger);
  container.register('logic', Logic);
  container.register('telegramPort', TelegramPort);
  container.register('adapters', Adapters);
  container.register('telegramAdapter', TelegramAdapter);
  return container;
};
