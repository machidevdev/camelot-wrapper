import mongoose, { connect } from "mongoose"
import Pool from "./db/nftPool"
import express from "express"
import setup from "./setup";
import serverlessHttp from 'serverless-http';
import { connectToDatabase } from "./db/connection";
import dotenv from "dotenv"
import { tokenPriceCache, updatePriceCache } from "./utils/utils";
import { viemClient } from "./client";
import update from "./update";
dotenv.config()
const app = express()


app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).send('Error connecting to the database');
  }
});


app.get("/block", (req, res) => {
  viemClient.getBlockNumber().then(block => {
    res.json(Number(block))
   })
})


app.get("/pool/:address", async (req, res) => {
  const pool = await Pool.findOne({ address: req.params.address.toLowerCase()})
  res.json(pool)
})

app.get("/pools", async (req, res) => {
  const pools = await Pool.find({})
  res.json(pools)
})

//get pools, paginate
app.get("/pools/:page", async (req, res) => {
  const pools = await Pool.find({}).sort({tvlUSD:-1}).skip(parseInt(req.params.page) * 10).limit(10)
  return res.json(pools)
})

app.get("/setup", async (req, res) => {
  try{
    await setup()
    res.send("done")
  }catch(e){
    console.error(e)
    res.send("error setting up pools!")
  }
})

app.get("/update", async (req, res) => {
  try{
    const pools = await update()
    res.send(pools)
  }catch(e){
    res.send("error updating pools!" +  e)
  }
  
})



app.get("/prices", async (req, res) => {
  const prices = await updatePriceCache();
  const pricesObject = Object.fromEntries(prices!.data);
  console.log(pricesObject);
  res.json(pricesObject);
})



export const handler = serverlessHttp(app);