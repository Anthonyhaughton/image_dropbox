import os
import json
import base64
import boto3
import uuid

# This client is created once when the Lambda container starts
s3 = boto3.client('s3')

def lambda_handler(event, context):
    """
    Handles image uploads from API Gateway.
    The request body is expected to be a base64-encoded image string.
    """
    try:
        # Get the destination bucket name from an environment variable
        bucket_name = os.environ.get('BUCKET_NAME')

        # Get the base64-encoded image data from the request body
        image_data = base64.b64decode(event['body'])

        # Generate a unique file name (key) for the image
        # For simplicity, we'll assume all uploads are JPEGs
        file_key = f'{str(uuid.uuid4())}.jpg'

        # Upload the image data to the S3 bucket
        s3.put_object(
            Bucket=bucket_name,
            Key=file_key,
            Body=image_data,
            ContentType='image/jpeg'
        )

        # Return a successful response
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Image uploaded successfully!',
                'fileName': file_key
            })
        }

    except Exception as e:
        print(f"Error: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'An error occurred during upload.'})
        }