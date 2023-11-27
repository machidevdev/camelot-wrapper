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

### Deployment

## Usage

### API

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
