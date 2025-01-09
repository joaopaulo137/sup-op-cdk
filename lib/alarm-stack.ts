// Importa a biblioteca principal do AWS CDK
import * as cdk from 'aws-cdk-lib';
// Importa a classe Construct, que é a base para definir recursos no CDK
import { Construct } from 'constructs';
// Importa o módulo para criar métricas e alarmes no CloudWatch
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as cloudwatch_actions from 'aws-cdk-lib/aws-cloudwatch-actions';
// Importa o módulo para criar e gerenciar tópicos SNS
import * as sns from 'aws-cdk-lib/aws-sns';
// Importa o módulo para adicionar assinaturas ao tópico SNS (por exemplo, email)
import * as sns_subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';

// Define uma nova classe que representa a infraestrutura (stack)
export class AlarmStack extends cdk.Stack {
  // Construtor da stack, onde os recursos são definidos
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    // Chama o construtor da classe base para inicializar a stack
    super(scope, id, props);

    // Cria um tópico SNS para notificações de alarme
    const alarmTopic = new sns.Topic(this, 'AlarmTopic', {
      // Define um nome amigável para exibição no console da AWS
      displayName: 'CloudWatch Alarm Topic',
    });

    // Adiciona uma assinatura ao tópico SNS para enviar notificações por email
    alarmTopic.addSubscription(
      new sns_subscriptions.EmailSubscription('j.paulo.aws.server@gmail.com') // Substitua pelo seu email real
    );

    // Cria um alarme no CloudWatch para monitorar a métrica de utilização de CPU
    const alarm = new cloudwatch.Alarm(this, 'HighCPUAlarm', {
      // Define a métrica que será monitorada
      metric: new cloudwatch.Metric({
        namespace: 'AWS/EC2', // Define o namespace da métrica (relacionado ao EC2)
        metricName: 'CPUUtilization', // Nome da métrica (utilização de CPU)
        dimensionsMap: {
          InstanceId: 'seu-instance-id', // Substitua pelo ID da instância que deseja monitorar
        },
      }),
      threshold: 80, // Define o limite (80%) para acionar o alarme
      evaluationPeriods: 2, // Número de períodos consecutivos acima do limite para acionar o alarme
      alarmDescription: 'Alarme de alta utilização de CPU.', // Descrição do alarme
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD, // Operador de comparação (maior que o limite)
    });

    // Vincula o alarme ao tópico SNS, para que notificações sejam enviadas quando o alarme for acionado
    alarm.addAlarmAction(new cloudwatch_actions.SnsAction(alarmTopic));
  }
}
