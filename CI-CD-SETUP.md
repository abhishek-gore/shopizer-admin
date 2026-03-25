# CI/CD Pipeline Setup

## Smoke Tests Added

Minimal test coverage for CI/CD validation:
- `src/app/app.component.spec.ts` - AppComponent creation test
- `src/app/app.module.spec.ts` - AppModule definition test

## Running Tests

```bash
# Local development
npm test

# CI mode (headless)
npm run test:ci

# With coverage
npm run test:coverage
```

## GitHub Actions Pipeline

Location: `.github/workflows/ci-cd.yml`

### Pipeline Stages

1. **Install** - Dependencies with caching
2. **Quality** - Linting and security audit
3. **Test** - Karma/Jasmine smoke tests
4. **Build** - Production bundle (parallel for dev/staging/prod)
5. **Deploy** - S3 + CloudFront with cache invalidation

### Required GitHub Secrets

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
S3_DEV_BUCKET
S3_STAGING_BUCKET
S3_PROD_BUCKET
S3_PREVIEW_BUCKET
CLOUDFRONT_DEV_DISTRIBUTION
CLOUDFRONT_STAGING_DISTRIBUTION
CLOUDFRONT_PROD_DISTRIBUTION
APP_BASE_URL_dev
APP_BASE_URL_staging
APP_BASE_URL_prod
```

### Branch Strategy

- `develop` → Deploy to dev environment
- `staging` → Deploy to staging environment
- `main` → Deploy to production environment
- `feature/*` → Preview deployment (PR only)

### Preview Deployments

Pull requests automatically deploy to:
```
https://pr-{number}.preview.example.com
```

Comment with preview URL is added to PR automatically.

## AWS Infrastructure

### S3 Bucket Setup

```bash
aws s3 mb s3://shopizer-admin-prod
aws s3 mb s3://shopizer-admin-staging
aws s3 mb s3://shopizer-admin-dev
aws s3 mb s3://shopizer-admin-preview

# Enable static website hosting
aws s3 website s3://shopizer-admin-prod \
  --index-document index.html \
  --error-document index.html
```

### CloudFront Distribution

- Origin: S3 bucket
- SSL: ACM certificate
- Cache behavior: 
  - Static assets: 1 year cache
  - index.html: No cache
- Error pages: 404 → /index.html (for SPA routing)

### Cache Invalidation Strategy

- Hashed assets (main.abc123.js) → Never invalidate
- index.html → Always fetch fresh
- CloudFront invalidation on deploy: `/*`

## Performance Optimizations

- Node modules caching (~2min saved)
- Parallel quality + test jobs
- Matrix builds for environments
- Bundle size limit: 10MB

## Local Testing Before Push

```bash
# Run full CI checks locally
npm run lint:ci
npm run test:ci
npm run build
```
