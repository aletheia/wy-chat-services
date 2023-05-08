import { Configuration, OpenAIApi, ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum } from 'openai';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ChatMessage } from './chat-message';
import { getOpenAIKey, successResult, errorResult } from '../utils/lambda-utils';

let openaiKey = process.env.OPENAI_API_KEY;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        openaiKey = getOpenAIKey(event);

        const configuration = new Configuration({
            apiKey: openaiKey,
        });

        const openai = new OpenAIApi(configuration);
        const { body } = event;
        if (!body) {
            throw new Error('Message has no body');
        }
        const chatMessage = JSON.parse(body) as ChatMessage;
        const model = chatMessage.model ?? 'gpt-3.5-turbo';

        const fromStringsToMessages = (
            strings: string[],
            role: ChatCompletionRequestMessageRoleEnum = ChatCompletionRequestMessageRoleEnum.User
        ): ChatCompletionRequestMessage[] => {
            return strings.map((entry: string): ChatCompletionRequestMessage => {
                return { role, content: entry };
            });
        };

        const conversation: ChatCompletionRequestMessage[] = chatMessage.conversation?.messages ?? [];

        let context: string[] = [];
        if (chatMessage.context) {
            if (typeof chatMessage.context === 'string') {
                context = [chatMessage.context];
            }
            conversation.push(...fromStringsToMessages(context));
        }

        let messages: string[] = [];
        if (typeof chatMessage.text === 'string') {
            messages = [chatMessage.text];
        } else {
            conversation.push(...fromStringsToMessages(messages));
        }

        const response = await openai.createChatCompletion({
            model,
            messages: conversation,
        });
        return successResult(response.data);
    } catch (error) {
        return errorResult(error);
    }
};
