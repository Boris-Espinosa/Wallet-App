import express from "express"
import dotenv from "dotenv"
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

import transactionsRoute from "./routes/transactionsRoute.js"
import job from "./config/cron.js"

dotenv.config()

const app = express()

//middleware

app.use(rateLimiter)
app.use(express.json())

// app.use((req, res, next) => {
//     console.log("hey", req.method)
//     next()
// })

const PORT = process.env.PORT || 5001;

app.use("/api/transactions", transactionsRoute)


initDB().then(() => {
    app.listen(PORT, () => {
    console.log("My port:", PORT)
    })
})