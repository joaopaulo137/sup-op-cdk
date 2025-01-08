import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sns_subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';

export class CloudwatchAlarmCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Cria um tópico SNS
    const alarmTopic = new sns.Topic(this, 'AlarmTopic', {
      displayName: 'CloudWatch Alarm Topic',
    });

    // Adiciona um email ao tópico SNS
    alarmTopic.addSubscription(
      new sns_subscriptions.EmailSubscription('seu-email@exemplo.com')
    );

    // Cria um alarme de exemplo
    const alarm = new cloudwatch.Alarm(this, 'HighCPUAlarm', {
      metric: new cloudwatch.Metric({
        namespace: 'AWS/EC2',
        metricName: 'CPUUtilization',
        dimensionsMap: {
          InstanceId: 'seu-instance-id',
        },
      }),
      threshold: 80,
      evaluationPeriods: 2,
      alarmDescription: 'Alarme de alta utilização de CPU.',
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
    });

    // Vincula o alarme ao tópico SNS
    alarm.addAlarmAction(new cloudwatch.actions.SnsAction(alarmTopic));
  }
}
