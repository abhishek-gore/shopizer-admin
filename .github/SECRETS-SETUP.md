# GitHub Actions Secrets Setup

## Required Secrets

Navigate to: `https://github.com/abhishek-gore/shopizer-admin/settings/secrets/actions`

### AWS Credentials

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

**How to create:**
1. Go to AWS IAM Console
2. Create new user: `github-actions-shopizer-admin`
3. Attach policies:
   - `AmazonS3FullAccess`
   - `CloudFrontFullAccess`
4. Create access key
5. Copy credentials to GitHub Secrets

### S3 Buckets

```
S3_DEV_BUCKET=shopizer-admin-dev
S3_STAGING_BUCKET=shopizer-admin-staging
S3_PROD_BUCKET=shopizer-admin-prod
S3_PREVIEW_BUCKET=shopizer-admin-preview
```

### CloudFront Distribution IDs

After running CloudFront setup scripts:

```
CLOUDFRONT_DEV_DISTRIBUTION=E1234567890ABC
CLOUDFRONT_STAGING_DISTRIBUTION=E1234567890DEF
CLOUDFRONT_PROD_DISTRIBUTION=E1234567890GHI
```

### API URLs

```
APP_BASE_URL_dev=http://localhost:8080/api
APP_BASE_URL_staging=https://staging-api.example.com/api
APP_BASE_URL_prod=https://api.example.com/api
```

## Setup Commands

### 1. Create AWS Infrastructure

```bash
# Set AWS credentials
export AWS_ACCESS_KEY_ID=your-key
export AWS_SECRET_ACCESS_KEY=your-secret
export AWS_REGION=us-east-1

# Run setup script
./.github/scripts/setup-aws-infrastructure.sh
```

### 2. Create CloudFront Distributions

```bash
# For each environment
./.github/scripts/setup-cloudfront.sh shopizer-admin-dev dev
./.github/scripts/setup-cloudfront.sh shopizer-admin-staging staging
./.github/scripts/setup-cloudfront.sh shopizer-admin-prod prod
```

### 3. Add Secrets to GitHub

```bash
# Using GitHub CLI
gh secret set AWS_ACCESS_KEY_ID
gh secret set AWS_SECRET_ACCESS_KEY
gh secret set S3_DEV_BUCKET -b"shopizer-admin-dev"
gh secret set S3_STAGING_BUCKET -b"shopizer-admin-staging"
gh secret set S3_PROD_BUCKET -b"shopizer-admin-prod"
gh secret set S3_PREVIEW_BUCKET -b"shopizer-admin-preview"
gh secret set CLOUDFRONT_DEV_DISTRIBUTION -b"E1234567890ABC"
gh secret set CLOUDFRONT_STAGING_DISTRIBUTION -b"E1234567890DEF"
gh secret set CLOUDFRONT_PROD_DISTRIBUTION -b"E1234567890GHI"
gh secret set APP_BASE_URL_dev -b"http://localhost:8080/api"
gh secret set APP_BASE_URL_staging -b"https://staging-api.example.com/api"
gh secret set APP_BASE_URL_prod -b"https://api.example.com/api"
```

## Verification

Test the pipeline:

```bash
# Push to trigger workflow
git push origin feature/product-review-management

# Check workflow status
gh run list --workflow=ci-cd.yml
gh run view <run-id>
```
