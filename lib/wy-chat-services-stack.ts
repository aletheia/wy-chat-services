import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { WyOpenAIStack } from './wy-openai-stack';

import { config as loadEnvVars } from 'dotenv';

export class WyChatServicesStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        loadEnvVars();
        const stackName = props?.stackName ?? 'waylon-chat-services';
        const openaiKey = process.env.OPENAI_API_KEY;
        if (!openaiKey) {
            throw new Error('OPENAI_API_KEY environment variable not set');
        }

        const openAiStack = new WyOpenAIStack(this, 'WyOpenaiStack', {
            openaiKey,
            stackName: `${stackName}-openai`,
        });

        new cdk.CfnOutput(this, 'region', { value: cdk.Stack.of(this).region });
        new cdk.CfnOutput(this, 'openai-api-url', { value: openAiStack.apiUrl });
    }
}
