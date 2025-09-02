import express from "express"
import cors from "cors"
import { initDB } from "./config/db.js"
import rateLimiter from "./middleware/rateLimiter.js"

import transactionsRoute from "./routes/transactionsRoute.js"
import job from "./config/cron.js"

const app = express()

console.log("🚀 Starting server...");
console.log("Environment:", process.env.NODE_ENV);
console.log("Port:", process.env.PORT || 5001);

if (process.env.NODE_ENV === "production") {
    console.log("📅 Starting cron job...");
    job.start()
}

//middleware
app.set('trust proxy', 1); // Para obtener la IP real en producción

// CORS y JSON parser antes del rate limiter
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}))

app.use(express.json())
app.use(rateLimiter)

app.get("/api/health", (req, res) => {
    console.log("🏥 Health check endpoint called");
    res.status(200).json({ status: "ok"})
})

// Endpoint específico para testing del rate limiter
app.post("/api/test-rate-limit", (req, res) => {
    console.log("🧪 Rate limit test endpoint called");
    const { user_id } = req.body;
    res.status(200).json({ 
        message: "Rate limit test successful",
        user_id: user_id,
        timestamp: new Date().toISOString()
    })
})

app.use("/api/transactions", transactionsRoute)

const PORT = process.env.PORT || 5001;

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🎯 Server running on port ${PORT}`)
        console.log(`📊 Rate limiter: 3 requests per 60 seconds`)
        console.log(`🔍 Logs should appear below for each request...`)
    })
})