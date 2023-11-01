import { Hono } from 'hono'
import mongoose from "mongoose"
import Pool from "./db/nftPool"
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import update from "../update"







const app = new Hono()
app.use('*', logger())
mongoose.connect('mongodb+srv://admin:CurHwwz7V7LN9ns0@isekai.jwwg3iz.mongodb.net/');
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function () {
  console.log("connected to db")
})




app.get('/setup', (c) => {
  return c.text('ok')
})

app.get("/", (c) => {
  return c.text('ok')
})



app.get('/update', async (c) => {
  await update()
  return c.text('updated')
})


app.get("/pool/:address", async (c) => {
  const pool = await Pool.findOne({ address: c.req.param("address")})
  console.log(c.req.param("address"))
  console.log(pool)
  return c.json(pool)
})

app.get("/pools", async (c) => {
  const pools = await Pool.find({})
  return c.json(pools)
})

//get pools, paginate
app.get("/pools/:page", async (c) => {
  const pools = await Pool.find({}).sort({tvlUSD:-1}).skip(parseInt(c.req.param("page")) * 10).limit(10)
  return c.json(pools)
})

export default app