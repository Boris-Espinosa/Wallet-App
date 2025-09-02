import rateLimit from "../config/upstash.js";

const rateLimiter = async(req, res, next) => {
    console.log(`=== RATE LIMITER START ===`);
    console.log(`Method: ${req.method}, URL: ${req.url}`);
    console.log(`Headers:`, JSON.stringify(req.headers, null, 2));
    console.log(`Body:`, JSON.stringify(req.body, null, 2));
    console.log(`Params:`, JSON.stringify(req.params, null, 2));
    console.log(`Query:`, JSON.stringify(req.query, null, 2));
    
    try {
        // Extraer user_id del cuerpo de la request o parámetros
        const userId = req.body?.user_id || req.params?.userId || req.params?.id || req.query?.user_id;
        
        console.log(`Extracted userId: ${userId}`);
        
        if (!userId) {
            // Si no hay user_id, usar IP como fallback
            const identifier = req.ip || req.connection.remoteAddress || "anonymous";
            console.log(`❌ No user_id found, using IP: ${identifier}`);
            
            const { success, limit, remaining, reset } = await rateLimit.limit(`ip:${identifier}`);
            console.log(`IP Rate limit result - Success: ${success}, Remaining: ${remaining}/${limit}`);
            
            if (!success) {
                console.log(`🚫 Rate limit exceeded for IP: ${identifier}`);
                return res.status(429).json({
                    message: "Too many requests, please try again later.",
                    retryAfter: Math.round((reset - Date.now()) / 1000)
                });
            }
            
            console.log(`✅ Request allowed for IP: ${identifier}, remaining: ${remaining}`);
            return next();
        }
        
        // Usar user_id de Clerk como identificador principal
        const identifier = `user:${userId}`;
        console.log(`👤 Rate limiting for user: ${userId} (identifier: ${identifier})`);
        
        const { success, limit, remaining, reset } = await rateLimit.limit(identifier);
        
        // Agregar headers informativos
        res.set({
            'X-RateLimit-Limit': limit,
            'X-RateLimit-Remaining': remaining,
            'X-RateLimit-Reset': new Date(reset).toISOString(),
            'X-RateLimit-User': userId
        });

        console.log(`Rate limit result - Success: ${success}, Remaining: ${remaining}/${limit}, Reset: ${new Date(reset).toISOString()}`);

        if (!success) {
            console.log(`🚫 Rate limit exceeded for user: ${userId}`);
            console.log(`RetryAfter: ${Math.round((reset - Date.now()) / 1000)} seconds`);
            return res.status(429).json({
                message: "Too many requests, please try again later.",
                userId: userId,
                limit: limit,
                retryAfter: Math.round((reset - Date.now()) / 1000)
            });
        }

        console.log(`✅ Request allowed for user: ${userId}, remaining: ${remaining}/${limit}`);
        console.log(`=== RATE LIMITER END ===`);
        next();
    } catch (error) {
        console.error("❌ Rate limit error:", error);
        console.error("Error stack:", error.stack);
        console.log(`=== RATE LIMITER ERROR END ===`);
        // En caso de error, permitir la request (fail-open)
        next();
    }
}

export default rateLimiter