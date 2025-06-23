# StudyZoom Deployment Guide

This document outlines the deployment process for the StudyZoom application.

## Prerequisites

- Node.js 18.x or later
- PostgreSQL 14.x or later
- AWS S3 bucket for document storage
- Stripe account for payment processing
- OpenAI API key for AI features
- Sentry account for error monitoring

## Environment Setup

1. Copy `.env.example` to `.env.local` and fill in all required values:

```bash
cp .env.example .env.local
```

2. Generate a secure random string for `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

3. Set up OAuth providers (Google, GitHub) in their respective developer consoles and add credentials to `.env.local`.

## Database Setup

1. Create a PostgreSQL database:

```bash
createdb studyzoom
```

2. Run database migrations:

```bash
npx prisma migrate deploy
```

3. Seed the database with initial data (if needed):

```bash
npx prisma db seed
```

## Building for Production

1. Install dependencies:

```bash
npm ci
```

2. Build the application:

```bash
npm run build
```

3. Verify the build:

```bash
npm run start
```

## Deployment Options

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with default settings

### Docker

1. Build the Docker image:

```bash
docker build -t studyzoom .
```

2. Run the container:

```bash
docker run -p 3000:3000 --env-file .env.local studyzoom
```

### Self-Hosted

1. Set up a reverse proxy (Nginx, Apache) to forward requests to the Node.js application
2. Configure SSL certificates
3. Set up process management with PM2:

```bash
npm install -g pm2
pm2 start npm --name "studyzoom" -- start
```

## Post-Deployment Verification

1. Verify authentication flows
2. Test document upload and processing
3. Confirm AI feature functionality
4. Check payment processing
5. Verify error monitoring is working

## Monitoring and Maintenance

1. Set up Sentry alerts for error monitoring
2. Configure database backups
3. Set up uptime monitoring
4. Implement logging and analytics

## Domain-Aligned Considerations

- All database tables and fields use the StudyGroup domain model
- Legacy Organization references are maintained through aliases for backward compatibility
- API endpoints support both new and legacy naming conventions

## Scaling Considerations

1. Database scaling:
   - Consider read replicas for high-traffic scenarios
   - Implement connection pooling

2. File storage scaling:
   - Use CDN for document delivery
   - Implement caching strategies

3. Application scaling:
   - Deploy multiple instances behind a load balancer
   - Consider serverless deployment for auto-scaling

## Rollback Procedure

In case of deployment issues:

1. Identify the issue through Sentry error monitoring
2. Roll back to the previous stable version
3. Verify database integrity
4. Communicate with users if necessary
