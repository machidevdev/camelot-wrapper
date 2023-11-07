import mongoose from "mongoose"
import Pool from "./db/nftPool"
import express from "express"
import update from "../update"



const app = express()



mongoose.connect('mongodb+srv://admin:CurHwwz7V7LN9ns0@isekai.jwwg3iz.mongodb.net/');
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function () {
  console.log("connected to db")
  app.listen(8000, () => {
    console.log("listening on port 8000")
  } )
})






app.get('/update', async (req, res) => {
  await update()
  res.send("updated")
})


app.get("/pool/:address", async (req, res) => {
  const pool = await Pool.findOne({ address: req.params.address})
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

