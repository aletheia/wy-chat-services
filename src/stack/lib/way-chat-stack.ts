import {Stack, StackProps, CfnOutput} from 'aws-cdk-lib';
import {AttributeType, BillingMode, Table} from 'aws-cdk-lib/aws-dynamodb';
import {Function} from 'aws-cdk-lib/aws-lambda';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import {HttpApi} from '@aws-cdk/aws-apigatewayv2-alpha';
import {HttpLambdaIntegration} from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import {Construct} from 'constructs';
import {join} from 'path';

import {config} from '../../app/lib/config';

export class WayChatStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const chatTable = new Table(this, 'ChatTable', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    const telegramHookFunction = new NodejsFunction(
      this,
      'TelegramHookFunction',
      {
        entry: join(__dirname, '../../app/lambda/telegram/index.ts'),
        handler: 'handler',
        environment: {
          TELEGRAM_BOT_TOKEN: config.botToken,
          SERVICE_NAME: config.serviceName,
          TELEGRAM_WEBHOOK_URL: config.apiUrl,
        },
      }
    );

    chatTable.grantReadWriteData(telegramHookFunction);

    const api = new HttpApi(this, 'WayChatApi', {
      defaultIntegration: new HttpLambdaIntegration(
        'TelegramIntegration',
        telegramHookFunction
      ),

      // The code that defines your stack goes here

      // example resource
      // const queue = new sqs.Queue(this, 'WayChatQueue', {
      //   visibilityTimeout: cdk.Duration.seconds(300)
      // });
    });

    new CfnOutput(this, 'LambdaFunction', {
      value: telegramHookFunction.functionName,
    });

    new CfnOutput(this, 'ApiUrl', {
      value: api.url || '',
    });
  }
}
