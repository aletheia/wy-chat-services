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

export interface WayChatChannelWebStackProps extends StackProps {
  serviceName: string;
  logLevel: string;
}

export class WayChatChannelWebStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
  }
}
