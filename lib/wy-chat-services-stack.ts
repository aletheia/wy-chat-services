import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { WyOpenAIStack } from './wy-openai-stack';

import { config as loadEnvVars } from 'dotenv';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { Certificate, CertificateValidation, DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';

export class WyChatServicesStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        loadEnvVars();
        const stackName = props?.stackName ?? 'waylon-chat-services';
        const openaiKey = process.env.OPENAI_API_KEY;
        if (!openaiKey) {
            throw new Error('OPENAI_API_KEY environment variable not set');
        }
        const hostedZoneId = process.env.HOSTED_ZONE_ID;
        if (!hostedZoneId) {
            throw new Error('HOSTED_ZONE_ID environment variable not set');
        }
        const domainName = process.env.DOMAIN_NAME;
        if (!domainName) {
            throw new Error('DOMAIN_NAME environment variable not set');
        }

        const openAiStack = new WyOpenAIStack(this, 'WyOpenaiStack', {
            openaiKey,
            stackName: `${stackName}-openai`,
            hostedZoneId,
            domainName,
        });

        new cdk.CfnOutput(this, 'region', { value: cdk.Stack.of(this).region });
        new cdk.CfnOutput(this, 'openai-api-url', { value: openAiStack.apiUrl });
        new cdk.CfnOutput(this, 'openai-chat-api-url', { value: openAiStack.chatApiUrl });
        new cdk.CfnOutput(this, 'openai-models-api-url', { value: openAiStack.modelsApiUrl });
    }
}
