import {Stack, StackProps, CfnOutput} from 'aws-cdk-lib';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import {Construct} from 'constructs';
import {join} from 'path';
import {StringParameter} from 'aws-cdk-lib/aws-ssm';

import {LambdaIntegration, RestApi} from 'aws-cdk-lib/aws-apigateway';

export interface WCTelegramStackProps extends StackProps {
	api: RestApi;
	service: string;
	stage: string;
	logLevel: string;
}

export class WCTelegramStack extends Stack {
	constructor(scope: Construct, id: string, props: WCTelegramStackProps) {
		super(scope, id, props);

		const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
		if (!telegramBotToken) {
			throw new Error(
				'TELEGRAM_BOT_TOKEN must be set as environment variable',
			);
		}

		const telegramBotTokenParam = new StringParameter(
			this,
			'TelegramBotToken',
			{
				stringValue: telegramBotToken,
				parameterName: `/${props.service}/${props.stage}/telegram-bot-token`,
			},
		);

		const telegramMessageFunction = new NodejsFunction(
			this,
			'TelegramMessageFunction',
			{
				entry: join(
					__dirname,
					'../src/telegram-message-function/index.ts',
				),
				handler: 'handler',
				environment: {
					SERVICE_NAME: props.service,
					STAGE: props.stage,
					LOG_LEVEL: props.logLevel,
				},
			},
		);
		telegramBotTokenParam.grantRead(telegramMessageFunction);

		new CfnOutput(this, 'telegramMessageFunction', {
			value: telegramMessageFunction.functionName,
		});

		const telegram = props.api.root.addResource('telegram');

		const messageApi = telegram.addResource('message');
		messageApi.addMethod(
			'POST',
			new LambdaIntegration(telegramMessageFunction),
		);

		new CfnOutput(this, 'telegramMessageApi', {
			value: `${props.api.url}/${messageApi.path}`,
			description: 'Telegram message webhook API',
		});
		const telegramWebhookUrl = messageApi.path;

		const setupHooks = new NodejsFunction(this, 'SetupHook', {
			entry: join(__dirname, '../../app/lambda/setup-hooks/index.ts'),
			handler: 'handler',
			environment: {
				TELEGRAM_WEBHOOK_URL: telegramWebhookUrl,
				TELEGRAM_BOT_TOKEN: telegramBotToken,
				SERVICE_NAME: props.service,
				LOG_LEVEL: props.logLevel,
			},
		});

		const webhookSetupApi = telegram.addResource('webhook');
		webhookSetupApi.addMethod('POST', new LambdaIntegration(setupHooks));

		new CfnOutput(this, 'telegramWebhookSetupApi', {
			value: `${props.api.url}/${webhookSetupApi.path}`,
			description: 'Telegram webhook setup API',
		});
	}
}
