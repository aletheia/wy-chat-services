import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { WyOpenAIStack } from './wy-openai-stack';

import { config as loadEnvVars } from 'dotenv';

export class WyChatServicesStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        loadEnvVars();

        const openaiKey = process.env.OPENAI_API_KEY;
        if (!openaiKey) {
            throw new Error('OPENAI_API_KEY environment variable not set');
        }

        new WyOpenAIStack(this, 'WyOpenaiStack', { openaiKey });
    }
}
