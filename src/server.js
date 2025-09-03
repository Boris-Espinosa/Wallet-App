import express from "express"
import { initDB } from "./config/db.js"
import rateLimiter from "./middleware/rateLimiter.js"

import transactionsRoute from "./routes/transactionsRoute.js"
import job from "./config/cron.js"

const app = express()

console.log("🚀 Starting server...");
console.log("📦 Environment:", process.env.NODE_ENV || 'development');
console.log("🔍 DATABASE_URL:", process.env.DATABASE_URL ? "✅ Set" : "❌ Missing");
console.log("🔍 UPSTASH_REDIS_REST_URL:", process.env.UPSTASH_REDIS_REST_URL ? "✅ Set" : "❌ Missing");

if (process.env.NODE_ENV === "production") {
    console.log("📅 Starting cron job...");
    job.start()
}

//middleware

app.use(express.json())
app.use(rateLimiter)

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok"})
})

app.use("/api/transactions", transactionsRoute)

const PORT = process.env.PORT || 5001;

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`)
        console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
    })
}).catch((error) => {
    console.error("❌ Failed to initialize database:", error)
    process.exit(1)
})