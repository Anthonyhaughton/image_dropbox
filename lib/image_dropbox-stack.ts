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

  // Create bucket that will store the images
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
  });

  // Define the lambda func
  const imageHandler = new lambda.Function(this, 'imageHandler', {
    runtime: lambda.Runtime.PYTHON_3_12,
    handler: 'handler.lambda_handler',
    code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
    // Define bucket name as env var to avoid hardcoding in .py
    environment: {
      BUCKET_NAME: imageBucket.bucketName,
    }
  });
  
  // Give lambda R+W permision on the bucket.
  imageBucket.grantRead(imageHandler);
  imageBucket.grantWrite(imageHandler);

  const imageEndpoint = new apigw.LambdaRestApi(this, 'imageEndpoint', {
    /* This single block of code:
      - creates the API Gateway
      - sets up proxy intergration to fwd requests to lambda
      - automagically creates permissions for the API Gateway to invoke lmda (!!sick) */
    handler: imageHandler,
    restApiName: 'ImageAPI',
    defaultCorsPreflightOptions: {
      allowOrigins: apigw.Cors.ALL_ORIGINS, // Allow requests from any origin
      allowMethods: apigw.Cors.ALL_METHODS, // Allow all HTTP methods
      allowHeaders: ['Content-Type'],       // Allow the Content-Type header
    }
  });
  }
}
