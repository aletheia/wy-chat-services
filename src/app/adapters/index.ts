import {inject, injectable} from 'tsyringe';
import {Channel, ChatMessage} from '../core/chat_message';
import {TelegramAdapter} from './telegram';

export interface IAdapter {
  sendMessage(message: ChatMessage): void;
}

@injectable()
export class Adapters {
  private Map: Map<Channel, IAdapter>;
  constructor(@inject('telegramAdapter') telegramAdapter: TelegramAdapter) {
    this.Map = new Map();
    this.Map.set(Channel.Telegram, telegramAdapter);
  }
  getAdapter(channel: Channel): IAdapter {
    const adapter = this.Map.get(channel);
    if (!adapter) {
      throw new Error(`No adapter for channel ${channel}`);
    } else {
      return adapter;
    }
  }
}
