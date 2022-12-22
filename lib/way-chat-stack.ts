import {Stack, StackProps, CfnOutput, Stage} from 'aws-cdk-lib';
import {AttributeType, BillingMode, Table} from 'aws-cdk-lib/aws-dynamodb';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import {HttpApi, HttpMethod} from '@aws-cdk/aws-apigatewayv2-alpha';
import {HttpLambdaIntegration} from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import {Construct} from 'constructs';
import {join} from 'path';
import {config} from 'dotenv';
import {StringParameter} from 'aws-cdk-lib/aws-ssm';
import {Effect, PolicyStatement} from 'aws-cdk-lib/aws-iam';
import {LogLevel} from 'aws-cdk-lib/aws-stepfunctions';

const checkEnvVars = () => {
  const {TELEGRAM_BOT_TOKEN, SERVICE_NAME, LOG_LEVEL} = process.env;

  if (!TELEGRAM_BOT_TOKEN || !SERVICE_NAME || !LOG_LEVEL) {
    throw new Error(
      'TELEGRAM_BOT_TOKEN, SERVICE_NAME and LOG_LEVEL must be set as environment variables'
    );
  }
};

export class WayChatStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    config();
    const stage = Stage.of(this).stageName;

    const {
      TELEGRAM_BOT_TOKEN: telegramBotToken,
      SERVICE_NAME: serviceName,
      LOG_LEVEL: logLevel,
    } = process.env;

    if (!telegramBotToken || !serviceName || !logLevel) {
      throw new Error(
        'TELEGRAM_WEBHOOK_URL, TELEGRAM_BOT_TOKEN and SERVICE_NAME must be set as environment variables'
      );
    }

    const chatTable = new Table(this, 'ChatTable', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    const api = new HttpApi(this, 'WayChatApi');

    const setupHooks = new NodejsFunction(this, 'SetupHook', {
      entry: join(__dirname, '../../app/lambda/setup-hooks/index.ts'),
      handler: 'handler',
      environment: {
        TELEGRAM_WEBHOOK_URL: telegramWebhookUrl,
        TELEGRAM_BOT_TOKEN: telegramBotToken,
        SERVICE_NAME: serviceName,
        LOG_LEVEL: logLevel,
      },
    });

    new CfnOutput(this, 'ApiUrl', {
      value: api.url || '',
    });
  }
}
