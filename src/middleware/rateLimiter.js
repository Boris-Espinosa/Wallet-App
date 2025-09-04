import rateLimit from "../config/upstash.js"

const rateLimiter = async(req, res, next) => {
    try {
        console.log(`🔍 Rate limiter check - ${req.method} ${req.url}`);
        
        // Extraer user_id de diferentes partes de la request
        const userId = req.body?.user_id || req.params?.userId || req.query?.user_id;
        
        // Crear identificador único por usuario
        const identifier = userId ? `user:${userId}` : `ip:${req.ip || req.connection.remoteAddress || 'anonymous'}`;
        
        console.log(`👤 Rate limiting for: ${identifier}`);
        
        const { success, limit, remaining, reset } = await rateLimit.limit(identifier);
        
        console.log(`📊 Rate limit result: success=${success}, remaining=${remaining}/${limit}`);

        if (!success) {
            console.log(`🚫 RATE LIMIT EXCEEDED for ${identifier}! Blocking request.`);
            return res.status(429).json({
                message: "Too many requests, please try again later.",
                userId: userId,
                retryAfter: Math.round((reset - Date.now()) / 1000)
            });
        }

        console.log(`✅ Request allowed for ${identifier}, continuing...`);
        next();
    } catch (error) {
        console.log("❌ Rate limit error", error);
        next(error);
    }
}
export default rateLimiter