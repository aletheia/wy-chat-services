import * as cdk from 'aws-cdk-lib';
import { Cors, Deployment, EndpointType, LambdaIntegration, RestApi, Stage } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

export interface WyOpenAIStackProps extends cdk.StackProps {
    openaiKey: string;
}

export class WyOpenAIStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: WyOpenAIStackProps) {
        super(scope, id, props);

        const openaiFunction = new NodejsFunction(this, 'OpenAIInterface', {
            entry: join(__dirname, '../lambda/openai/index.ts'),
            timeout: cdk.Duration.seconds(30),
            environment: {
                OPENAI_API_KEY: props.openaiKey,
            },
        });

        const openaiApi = new RestApi(this, 'WyOpenAIApi', {
            restApiName: 'waylon-openai-api',
            description: 'API to interface with OpenAI',
            endpointTypes: [EndpointType.REGIONAL],
            deploy: false,
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS,
                allowHeaders: Cors.DEFAULT_HEADERS,
            },
        });

        openaiApi.root.addMethod('POST', new LambdaIntegration(openaiFunction));

        const deployment = new Deployment(this, 'WyOpenAIDeployment', {
            api: openaiApi,
        });

        const stage = new Stage(this, 'WyOpenAIStageV1', {
            deployment,
            stageName: 'v1',
        });

        openaiApi.deploymentStage = stage;
    }
}
