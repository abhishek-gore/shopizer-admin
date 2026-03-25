#!/bin/bash
set -e

BUCKET_NAME=$1
ENV=$2

if [ -z "$BUCKET_NAME" ] || [ -z "$ENV" ]; then
  echo "Usage: ./setup-cloudfront.sh <bucket-name> <environment>"
  echo "Example: ./setup-cloudfront.sh shopizer-admin-prod prod"
  exit 1
fi

REGION=${AWS_REGION:-us-east-1}

cat > /tmp/cf-config.json <<EOF
{
  "CallerReference": "$BUCKET_NAME-$(date +%s)",
  "Comment": "Shopizer Admin - $ENV",
  "Enabled": true,
  "Origins": {
    "Quantity": 1,
    "Items": [{
      "Id": "S3-$BUCKET_NAME",
      "DomainName": "$BUCKET_NAME.s3-website-$REGION.amazonaws.com",
      "CustomOriginConfig": {
        "HTTPPort": 80,
        "HTTPSPort": 443,
        "OriginProtocolPolicy": "http-only"
      }
    }]
  },
  "DefaultRootObject": "index.html",
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-$BUCKET_NAME",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 3,
      "Items": ["GET", "HEAD", "OPTIONS"],
      "CachedMethods": {
        "Quantity": 2,
        "Items": ["GET", "HEAD"]
      }
    },
    "Compress": true,
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {"Forward": "none"}
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000
  },
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [{
      "ErrorCode": 404,
      "ResponsePagePath": "/index.html",
      "ResponseCode": "200",
      "ErrorCachingMinTTL": 300
    }]
  },
  "PriceClass": "PriceClass_100"
}
EOF

echo "Creating CloudFront distribution for $BUCKET_NAME..."
DISTRIBUTION_ID=$(aws cloudfront create-distribution --distribution-config file:///tmp/cf-config.json --query 'Distribution.Id' --output text)

echo ""
echo "✅ CloudFront distribution created"
echo "Distribution ID: $DISTRIBUTION_ID"
echo ""
echo "Add to GitHub Secrets:"
echo "CLOUDFRONT_${ENV^^}_DISTRIBUTION=$DISTRIBUTION_ID"
