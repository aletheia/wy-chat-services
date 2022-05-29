import 'reflect-metadata';
import {container} from 'tsyringe';
import {Logger} from './lib/logger';
import {config} from './lib/config';

container.register('config', {useValue: config});
container.registerSingleton('logger', Logger);
export const containerInstance = container;
