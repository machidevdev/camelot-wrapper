# server

## Description
This server is made to handle camelot's data in a more organized way. 

It grabs data from their nft pools enpoint and their graqhql endpoint and stores it in a database, giving names to the pools and the tokens.
To implement: event listener on icp for newly whitelisted pools


Stack: 
- Typescript
- express
- Mongoose w/mongodb atlas as provider


To install dependencies:

```bash
npm install
```

To run:

```bash
npm run dev
```

Production:
```bash
npm run start
```




## Endpoints
`/setup:` initial server setup

`/update:` update the database with new data from nft pools(no need for graphql endpoint) 

`/pools:` get all pools

`/pools/:id:` get pool by id

`/pools/:address` get pool by address

