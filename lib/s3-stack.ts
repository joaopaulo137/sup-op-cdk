import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class S3Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Cria um bucket S3 básico
    new s3.Bucket(this, 'MyFirstBucket', {
      bucketName: 'meu-bucket-teste-cdk', // Nome do bucket (deve ser único globalmente)
      versioned: true,                      // Habilita a versão dos objetos no bucket
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Remove o bucket ao destruir a stack
      autoDeleteObjects: true,              // Exclui objetos automaticamente ao remover o bucket
    });
  }
}
