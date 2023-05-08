import { ChatCompletionRequestMessage } from 'openai';

/* eslint-disable @typescript-eslint/indent */
export interface ChatMessage {
    text: string | string[];
    model?: string;
    context?: string | string[];
    conversation?: {
        uuid: string;
        title?: string;
        messages: ChatCompletionRequestMessage[];
    };
    chatOptions?: {
        maxTokens?: number;
        temperature?: number;
        topP?: number;
        presencePenalty?: number;
        frequencyPenalty?: number;
        bestOf?: number;
        n?: number;
        stream?: boolean;
        stop?: string[];
    };
}
