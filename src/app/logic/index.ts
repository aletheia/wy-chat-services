import {inject, injectable} from 'tsyringe';
import {Logger} from 'waylon-commons-lib';
import {Adapters} from '../adapters';
import {ChatMessage} from '../core/chat_message';

@injectable()
export class Logic {
  constructor(
    @inject('logger') protected logger: Logger,
    @inject('adapters') protected adapters: Adapters
  ) {
    this.logger = logger;
    this.adapters = adapters;
  }

  handleChatMessage(message: ChatMessage) {
    this.logger.info(`[Logic] - Handling message ${message.uuid}`);
    //TODO: just echoing message
    this.adapters.getAdapter(message.channel).sendMessage(message);
  }
}
