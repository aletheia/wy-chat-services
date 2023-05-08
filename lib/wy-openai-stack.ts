import * as cdk from 'aws-cdk-lib';
import { Cors, EndpointType, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { ApiGateway } from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';
import { join } from 'path';

export interface WyOpenAIStackProps extends cdk.StackProps {
    openaiKey: string;
    hostedZoneId: string;
    domainName: string;
}

export class WyOpenAIStack extends cdk.Stack {
    public apiUrl: string;
    public chatApiUrl: string;
    public modelsApiUrl: string;

    constructor(scope: Construct, id: string, props: WyOpenAIStackProps) {
        super(scope, id, props);

        const openaiFunction = new NodejsFunction(this, 'OpenAIInterface', {
            functionName: 'waylon-openai-bridge',
            runtime: Runtime.NODEJS_18_X,
            entry: join(__dirname, '../lambda/openai/chat/index.ts'),
            timeout: cdk.Duration.seconds(30),
            environment: {
                // OPENAI_API_KEY: props.openaiKey,
            },
        });

        const getModelsFunction = new NodejsFunction(this, 'OpenAIGetModels', {
            functionName: 'waylon-openai-get-models',
            runtime: Runtime.NODEJS_18_X,
            entry: join(__dirname, '../lambda/openai/list-models/index.ts'),
            timeout: cdk.Duration.seconds(90),
            environment: {
                // OPENAI_API_KEY: props.openaiKey,
            },
        });

        const domainName = props.domainName;
        const hostName = 'openai';
        const fqdn = `${hostName}.${domainName}`;
        const apiVersion = 'v1';

        const hostedZone = HostedZone.fromHostedZoneAttributes(this, 'WaylonCloudHostedZone', {
            hostedZoneId: props.hostedZoneId,
            zoneName: domainName,
        }); // .fromHostedZoneId(this, 'HostedZone', props.hostedZoneId);

        const certificate = new Certificate(this, 'Certificate', {
            domainName: fqdn,
            validation: CertificateValidation.fromDns(hostedZone),
        });

        const openaiApi = new RestApi(this, 'WyOpenAIApi', {
            restApiName: 'waylon-openai-api',
            description: 'API to interface with OpenAI',
            endpointTypes: [EndpointType.REGIONAL],
            deploy: true,
            deployOptions: {
                stageName: apiVersion,
            },
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS,
                allowHeaders: Cors.DEFAULT_HEADERS,
            },
            domainName: {
                domainName: fqdn,
                certificate,
            },
        });

        const v1api = openaiApi.root.addResource(apiVersion);
        const chatApi = v1api.addResource('chat');
        chatApi.addMethod('POST', new LambdaIntegration(openaiFunction));

        const modelsApi = v1api.addResource('models');
        modelsApi.addMethod('GET', new LambdaIntegration(getModelsFunction));

        new ARecord(this, 'OpenAIARecord', {
            zone: hostedZone,
            recordName: hostName,
            target: RecordTarget.fromAlias(new ApiGateway(openaiApi)),
        });

        this.apiUrl = `${fqdn}/${apiVersion}`;
        this.chatApiUrl = `${fqdn}/${apiVersion}/chat`;
        this.modelsApiUrl = `${fqdn}/${apiVersion}/models`;
    }
}
