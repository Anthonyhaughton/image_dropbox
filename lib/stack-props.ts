import * as cdk from 'aws-cdk-lib';

export interface ImageDropboxStackProps extends cdk.StackProps {

    readonly image_bucket?: string
}