import {Stack, StackProps, CfnOutput} from 'aws-cdk-lib';
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

export interface WayChatChannelTelegramStackProps extends StackProps {
  api: HttpApi;
  service: string;
  stage: string;
  logLevel: LogLevel;
  telegramBotToken: string;
}

export class WayChatChannelTelegramStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: WayChatChannelTelegramStackProps
  ) {
    super(scope, id, props);

    const telegramBotTokenParam = new StringParameter(
      this,
      'TelegramBotToken',
      {
        stringValue: props.telegramBotToken,
        parameterName: `/${props.service}/${props.stage}/telegram-bot-token`,
      }
    );

    const telegramMessageFunction = new NodejsFunction(
      this,
      'TelegramMessageFunction',
      {
        entry: join(__dirname, '../src/telegram-message-function/index.ts'),
        handler: 'handler',
        environment: {
          SERVICE_NAME: props.service,
          STAGE: props.stage,
          LOG_LEVEL: props.logLevel,
        },
      }
    );
    telegramBotTokenParam.grantRead(telegramMessageFunction);

    new CfnOutput(this, 'telegramMessageFunction', {
      value: telegramMessageFunction.functionName,
    });
  }
}
