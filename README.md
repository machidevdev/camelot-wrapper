# server

## Description
This server is made to handle camelot's data in a more organized way. 

It grabs data from their nft pools enpoint and their graqhql endpoint and stores it in a database, giving names to the pools and the tokens.


Stack: 
- Typescript
- Bun
- Mongoose w/mongodb atlas as provider


To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/index.ts
```

Will currently run the setup() function when started. Note: some tokens in the nft pools are not token pairs but sigle tokens(need to handle this)


## Endpoints
/setup: initial server setup

/update: update the database with new data from nft pools(no need for graphql endpoint) 

/pools: get all pools

/pools/:id: get pool by id

/pools/:address get pool by address

