import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { ImageDropboxStackProps } from './stack-props';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as path from 'path';

export class ImageDropboxStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ImageDropboxStackProps) {
    super(scope, id, props);

  const imageBucket = new s3.Bucket(this, 'image_bucket', {
    bucketName: props.image_bucket,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
    publicReadAccess: true,
    versioned: true,
    blockPublicAccess: {
      blockPublicAcls: false,
      blockPublicPolicy: false,
      ignorePublicAcls: false,
      restrictPublicBuckets: false,
    }
  })

  const imageHandler = new lambda.Function(this, 'imageHandler', {
    runtime: lambda.Runtime.PYTHON_3_12,
    handler: 'handler.lambda_handler',
    code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
  });

  const imageEndpoint = new apigw.LambdaRestApi(this, 'imageEndpoint', {
    handler: imageHandler,
    restApiName:
  });

  imageBucket.grantRead(imageHandler);
  imageBucket.grantWrite(imageHandler);


  }
}
