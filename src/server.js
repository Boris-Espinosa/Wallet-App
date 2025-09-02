import express from "express"
import { initDB } from "./config/db.js"
import rateLimiter from "./middleware/rateLimiter.js"

import transactionsRoute from "./routes/transactionsRoute.js"
import job from "./config/cron.js"

const app = express()

if (process.env.NODE==="production") job.start()

//middleware

app.use(rateLimiter)
app.use(express.json())

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok"})
})

app.use("/api/transactions", transactionsRoute)


initDB()