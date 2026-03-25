# CI/CD Quick Start Guide

## Prerequisites

- AWS Account with admin access
- GitHub repository access
- AWS CLI installed and configured
- GitHub CLI (optional, for secrets management)

## Setup Steps (5 minutes)

### 1. Create AWS Infrastructure

```bash
cd .github/scripts
./setup-aws-infrastructure.sh
```

This creates:
- 4 S3 buckets (dev, staging, prod, preview)
- Static website hosting enabled
- Public read access configured

### 2. Create CloudFront Distributions

```bash
./setup-cloudfront.sh shopizer-admin-dev dev
./setup-cloudfront.sh shopizer-admin-staging staging
./setup-cloudfront.sh shopizer-admin-prod prod
```

Save the distribution IDs from output.

### 3. Configure GitHub Secrets

Go to: https://github.com/abhishek-gore/shopizer-admin/settings/secrets/actions

Add all secrets from `.github/SECRETS-SETUP.md`

### 4. Test Pipeline

```bash
# Push to trigger workflow
git push origin feature/product-review-management

# Monitor workflow
# Visit: https://github.com/abhishek-gore/shopizer-admin/actions
```

## Branch Deployment Strategy

| Branch | Environment | URL | Auto-Deploy |
|--------|-------------|-----|-------------|
| `develop` | Development | dev.example.com | ✅ Yes |
| `staging` | Staging | staging.example.com | ✅ Yes |
| `main` | Production | app.example.com | ✅ Yes |
| `feature/*` | Preview | pr-123.preview.example.com | ✅ On PR |

## Manual Deployment

```bash
# Deploy specific environment
gh workflow run ci-cd.yml --ref main

# Check deployment status
gh run list --workflow=ci-cd.yml --limit 5
```

## Rollback

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or deploy specific commit
git checkout <commit-hash>
git push origin main --force
```

## Troubleshooting

### Pipeline fails at "Install dependencies"
- Check Node version matches (12.22.7)
- Clear cache: Delete workflow cache in GitHub Actions

### Pipeline fails at "Deploy to S3"
- Verify AWS credentials in GitHub Secrets
- Check S3 bucket names match exactly
- Ensure IAM user has S3 write permissions

### CloudFront not updating
- Wait 5-10 minutes for invalidation
- Check distribution ID is correct
- Verify CloudFront invalidation permissions

### Tests failing
- Run locally: `npm run test:ci`
- Check test output in Actions logs
- Verify all dependencies installed

## Cost Estimate

- S3 storage: ~$0.10/month
- CloudFront: ~$0.50/month (first 1TB free)
- GitHub Actions: Free for public repos
- **Total: ~$0.60/month**

## Next Steps

1. ✅ Setup complete
2. Configure custom domains (Route 53)
3. Add SSL certificates (ACM)
4. Setup monitoring (CloudWatch)
5. Add Slack/email notifications
