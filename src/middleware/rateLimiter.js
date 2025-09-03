import rateLimit from "../config/upstash.js"

const rateLimiter = async(req, res, next) => {
    try {
        console.log(`🔍 Rate limiter check - ${req.method} ${req.url}`);
        
        const { success, limit, remaining, reset } = await rateLimit.limit("my-rate-limit");
        
        console.log(`📊 Rate limit result: success=${success}, remaining=${remaining}/${limit}`);

        if (!success) {
            console.log(`🚫 RATE LIMIT EXCEEDED! Blocking request.`);
            return res.status(429).json({message: "Too many request, please try again later."})
        }

        console.log(`✅ Request allowed, continuing...`);
        next()
    } catch (error) {
        console.log("❌ Rate limit error", error)
        next(error)
    }
}
export default rateLimiter