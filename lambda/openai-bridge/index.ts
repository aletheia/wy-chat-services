import { Configuration, OpenAIApi } from 'openai';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const openaiKey = process.env.OPENAI_API_KEY;
const configuration = new Configuration({
    apiKey: openaiKey,
});

const openai = new OpenAIApi(configuration);

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('event', event);

    const response = await openai.createCompletion({
        model: 'davinci',
        prompt: 'This is a test',
        max_tokens: 5,
        temperature: 0.9,
        top_p: 1,
        presence_penalty: 0,
        frequency_penalty: 0,
        best_of: 1,
        n: 1,
        stream: false,
        stop: ['\n', ' '],
    });

    return {
        statusCode: 200,
        body: JSON.stringify({
            answer: response.data.choices[0].text,
            input: event,
        }),
    };
};
