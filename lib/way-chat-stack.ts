import {CfnOutput, Stack, StackProps} from 'aws-cdk-lib';
import {Cors, MethodLoggingLevel, RestApi} from 'aws-cdk-lib/aws-apigateway';
import {AttributeType, BillingMode, Table} from 'aws-cdk-lib/aws-dynamodb';
import {Construct} from 'constructs';
import {config as loadEnvVars} from 'dotenv';
import {WCTelegramStack} from './way-chat-channel-telegram-stack';

export interface StackConfig {
	service: string;
	stage: string;
	logLevel: string;
}

const checkEnvVars = () => {
	const {
		SERVICE_NAME: serviceName,
		LOG_LEVEL: logLevel,
		STAGE: stage,
	} = process.env;

	if (!serviceName || !logLevel || !stage) {
		throw new Error(
			'SERVICE_NAME, LOG_LEVEL and STAGE must be set as environment variables',
		);
	}

	return {
		service: serviceName,
		stage,
		logLevel,
	};
};

export class WayChatStack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		loadEnvVars();
		const config: StackConfig = checkEnvVars();

		new Table(this, 'ChatTable', {
			partitionKey: {
				name: 'id',
				type: AttributeType.STRING,
			},
			billingMode: BillingMode.PAY_PER_REQUEST,
		});

		const api = new RestApi(this, 'WayChatApi', {
			restApiName: `${config.service} API`,
			description: 'API for the chat service',
			deployOptions: {
				stageName: config.stage,
				loggingLevel: MethodLoggingLevel.INFO,
				dataTraceEnabled: true,
				metricsEnabled: true,
			},
			defaultCorsPreflightOptions: {
				allowOrigins: Cors.ALL_ORIGINS,
				allowMethods: Cors.ALL_METHODS,
				allowHeaders: Cors.DEFAULT_HEADERS,
			},
			deploy: true,
		});

		new WCTelegramStack(this, 'WayChatTelegramStack', {
			api,
			service: config.service,
			stage: config.stage,
			logLevel: config.logLevel,
		});

		new CfnOutput(this, 'ApiUrl', {
			value: api.url,
			description: 'The URL of the API',
		});
	}
}
