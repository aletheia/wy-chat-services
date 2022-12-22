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

export class WayChatStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    config();
    const stage = 'dev';

    const {
      TELEGRAM_BOT_TOKEN: telegramBotToken,
      SERVICE_NAME: serviceName,
      LOG_LEVEL: logLevel,
    } = process.env;

    if (!telegramBotToken || !serviceName || !logLevel) {
      throw new Error(
        'TELEGRAM_WEBHOOK_URL, TELEGRAM_BOT_TOKEN and SERVICE_NAME must be set in .env'
      );
    }

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
          CHAT_TABLE: chatTable.tableName,
          TELEGRAM_BOT_TOKEN: telegramBotToken,
          SERVICE_NAME: serviceName,
          LOG_LEVEL: logLevel,
        },
      }
    );

    chatTable.grantReadWriteData(telegramHookFunction);

    const api = new HttpApi(this, 'WayChatApi');

    api.addRoutes({
      path: '/telegram',
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration(
        'TelegramIntegration',
        telegramHookFunction
      ),
    });

    const telegramWebhookUrl = `${api.url}/telegram`;

    const telegramWebhookParam = new StringParameter(
      this,
      'TelegramWebhookUrl',
      {
        stringValue: telegramWebhookUrl,
        parameterName: `/${serviceName}/${stage}/telegramWebhookUrl`,
      }
    );

    const telegramBotTokenParam = new StringParameter(
      this,
      'TelegramBotToken',
      {
        stringValue: telegramBotToken,
        parameterName: `/${serviceName}/${stage}/telegramBotToken`,
      }
    );

    const serviceNameParam = new StringParameter(this, 'ServiceName', {
      stringValue: serviceName,
      parameterName: `/${serviceName}/${stage}/serviceName`,
    });

    new StringParameter(this, 'logLevel', {
      stringValue: 'info',
      parameterName: `/${serviceName}/${stage}/logLevel`,
    });

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

    telegramWebhookParam.grantRead(setupHooks);
    telegramBotTokenParam.grantRead(setupHooks);
    serviceNameParam.grantRead(setupHooks);

    const grantReadAllParamsPolicy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        'ssm:DescribeParameters',
        'ssm:GetParameter',
        'ssm:GetParameterHistory',
        'ssm:GetParameters',
      ],
      resources: ['*'],
    });
    setupHooks.addToRolePolicy(grantReadAllParamsPolicy);

    api.addRoutes({
      path: '/setup-hooks',
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration(
        'SetupHooksIntegration',
        setupHooks
      ),
    });

    new CfnOutput(this, 'LambdaFunction', {
      value: telegramHookFunction.functionName,
    });

    new CfnOutput(this, 'ApiUrl', {
      value: api.url || '',
    });
  }
}
