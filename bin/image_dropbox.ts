#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ImageDropboxStack } from '../lib/image_dropbox-stack';

const app = new cdk.App();
new ImageDropboxStack(app, 'ImageDropboxStack', {
  /* Bucket name var */
  image_bucket: "haughton-dropbox-image-bucket"
});