import cron from "node-cron"
import { Hono } from 'hono'
import { watchContractEvent } from "viem/actions"
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import update from "../update"
import setup from "./setup"







const app = new Hono()
app.use('*', logger())

app.use(cors())

app.get('/setup', (c) => {
  return c.text('ok')
})


app.get('/update', async(c) => {
  await update()
  return c.text('updated')
})

setup()