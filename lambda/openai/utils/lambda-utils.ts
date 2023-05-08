import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const getOpenAIKey = (event: APIGatewayProxyEvent): string => {
    const headers = event.headers;
    let openaiKey = process.env.OPENAI_API_KEY;
    if (headers?.['x-api-key']) {
        openaiKey = headers['x-api-key'];
    }
    if (!openaiKey) {
        throw new Error('Missing OpenAI API key');
    }

    return openaiKey;
};

export const successResult = (result: any, statusCode = 200): APIGatewayProxyResult => {
    return {
        statusCode,
        body: JSON.stringify(result),
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    };
};

export const errorResult = (error: any, statusCode = 500): APIGatewayProxyResult => {
    console.log(error);
    console.log(error.stack);
    return {
        statusCode,
        body: JSON.stringify(error.message),
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    };
};
