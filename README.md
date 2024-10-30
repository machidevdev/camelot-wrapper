# BACKEND-API - SERVERLESS

## Description

This backend is a serverless application that uses AWS Lambda, API Gateway, DynamoDB, Mongoose, and Node.js to create a RESTful API and a function that can be invoked by a client application/cloudwatch event.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/en/) v14.x or later
- [Serverless Framework](https://www.serverless.com/framework/docs/getting-started/) v2.4.0 or later
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) v2.0.0 or later

### Setup

Install the dependencies

```bash
npm install
```

## API

### Get all pools (GET)

```bash
curl https://<api-id>.execute-api.<region>.amazonaws.com/dev/pools
```

### Get a pool (GET)

```bash
curl https://<api-id>.execute-api.<region>.amazonaws.com/dev/pools/<pool-id>
```

### Search pools (POST)

```bash
curl -X POST https://<api-id>.execute-api.<region>.amazonaws.com/dev/pools/search -d '{"search": "search term"}'
```

# Repository Structure

## Core Directories

- `/src` - Main source code directory
  - `/contracts` - Smart contract ABIs and interfaces
  - `/schemas` - Zod schemas and Mongoose models for data validation
  - `/utils` - Utility functions for APR calculations, data syncing, etc.

## Key Files

- `src/handler.ts` - Main Lambda function handlers for API endpoints
- `src/config.ts` - Environment configuration management
- `src/connection.ts` - Database connection management
- `src/viemClient.ts` - Ethereum client configuration

## API Endpoints

- GET `/pools` - Retrieve all pools
- GET `/pools/{poolAddress}` - Get specific pool by address
- POST `/search` - Search pools by name
- GET `/health` - Health check endpoint
- (Scheduled) `/sync` - Sync data from external sources

## Configuration Files

- `serverless-*.yml` - Serverless Framework configurations for different environments
- `.env` - Environment variables (gitignored)
- `tsconfig.json` - TypeScript configuration
- `.eslintrc.js` & `.prettierrc.js` - Code style configuration

## Infrastructure

- `.github/workflows/` - GitHub Actions for CI/CD
  - `develop.yml` - Development deployment pipeline
  - `main.yml` - Production deployment pipeline

## Key Features

1. Serverless Architecture using AWS Lambda
2. MongoDB for data persistence
3. TypeScript with strict type checking
4. Zod for runtime type validation
5. Automated deployments via GitHub Actions
6. Regular data synchronization with blockchain
7. APR calculations for DeFi pools
