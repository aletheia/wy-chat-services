/* eslint-disable @typescript-eslint/indent */
export interface ChatMessage {
    prompt: string;
    model?:
        | 'gpt-4'
        | 'gpt-4-0314'
        | 'gpt-4-32k'
        | 'gpt-4-32k-0314'
        | 'gpt-3.5-turbo'
        | 'gpt-3.5-turbo-0301'
        | 'text-davinci-003'
        | 'text-davinci-002'
        | 'code-davinci-002'
        | 'davinci'
        | 'curie'
        | 'ada';
    context?: string;
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    presencePenalty?: number;
    frequencyPenalty?: number;
    bestOf?: number;
    n?: number;
    stream?: boolean;
    stop?: string[];
}
