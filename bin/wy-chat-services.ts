#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { WyChatServicesStack } from '../lib/wy-chat-services-stack';

const app = new cdk.App();
new WyChatServicesStack(app, 'WyChatServicesStack', {
    stackName: 'waylon-chat-services',
});
