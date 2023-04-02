import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ChatMessage } from './chat-message';

const openaiKey = process.env.OPENAI_API_KEY;
const configuration = new Configuration({
    apiKey: openaiKey,
});

const openai = new OpenAIApi(configuration);

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { body } = event;
        if (!body) {
            throw new Error('Message has no body');
        }
        const message = JSON.parse(body) as ChatMessage;
        const model = message.model ?? 'gpt-3.5-turbo';

        const messages: ChatCompletionRequestMessage[] = [];
        if (message.context) {
            messages.push({ role: 'system', content: message.context });
        }
        messages.push({ role: 'user', content: message.prompt });

        const response = await openai.createChatCompletion({
            model,
            messages,
        });
        return {
            statusCode: 200,
            body: JSON.stringify(response.data),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        };
    }
};
