#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { S3Stack } from '../lib/s3-stack';
import { AlarmStack } from '../lib/alarm-stack'; // Caso já exista

const app = new cdk.App();

// Variável para decidir qual stack criar
const stackToDeploy = process.env.STACK_TO_DEPLOY || 's3'; // Padrão: 's3'

// Implanta apenas a stack especificada
if (stackToDeploy === 's3') {
  new S3Stack(app, 'S3Stack');
} else if (stackToDeploy === 'alarm') {
  new AlarmStack(app, 'AlarmStack');
} else {
  throw new Error(`Stack desconhecida: ${stackToDeploy}`);
}
