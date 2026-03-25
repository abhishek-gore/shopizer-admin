#!/bin/bash
set -e

REGION=${AWS_REGION:-us-east-1}
PROJECT_NAME="shopizer-admin"

echo "Setting up AWS infrastructure for $PROJECT_NAME in $REGION"

# Create S3 buckets
for ENV in dev staging prod preview; do
  BUCKET_NAME="${PROJECT_NAME}-${ENV}"
  echo "Creating S3 bucket: $BUCKET_NAME"
  
  aws s3 mb s3://$BUCKET_NAME --region $REGION 2>/dev/null || echo "Bucket already exists"
  
  # Enable static website hosting
  aws s3 website s3://$BUCKET_NAME \
    --index-document index.html \
    --error-document index.html
  
  # Set bucket policy for CloudFront access
  cat > /tmp/bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
  }]
}
EOF
  
  aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file:///tmp/bucket-policy.json
  
  echo "✓ Bucket $BUCKET_NAME configured"
done

echo ""
echo "✅ S3 buckets created successfully"
echo ""
echo "Next steps:"
echo "1. Create CloudFront distributions for each bucket"
echo "2. Add GitHub Secrets:"
echo "   - AWS_ACCESS_KEY_ID"
echo "   - AWS_SECRET_ACCESS_KEY"
echo "   - S3_DEV_BUCKET=$PROJECT_NAME-dev"
echo "   - S3_STAGING_BUCKET=$PROJECT_NAME-staging"
echo "   - S3_PROD_BUCKET=$PROJECT_NAME-prod"
echo "   - S3_PREVIEW_BUCKET=$PROJECT_NAME-preview"
echo "   - CLOUDFRONT_DEV_DISTRIBUTION=<distribution-id>"
echo "   - CLOUDFRONT_STAGING_DISTRIBUTION=<distribution-id>"
echo "   - CLOUDFRONT_PROD_DISTRIBUTION=<distribution-id>"
echo "   - APP_BASE_URL_dev=http://localhost:8080/api"
echo "   - APP_BASE_URL_staging=https://staging-api.example.com/api"
echo "   - APP_BASE_URL_prod=https://api.example.com/api"
