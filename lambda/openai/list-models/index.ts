import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { Configuration, OpenAIApi } from 'openai';
import { errorResult, getOpenAIKey, successResult } from '../utils/lambda-utils';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const configuration = new Configuration({
            apiKey: getOpenAIKey(event),
        });

        const openai = new OpenAIApi(configuration);
        const response = await openai.listModels();
        const models = response.data.data.map((model) => model.id).sort();

        return successResult(models);
    } catch (error) {
        return errorResult(error);
    }
};
