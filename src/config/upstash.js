import { Redis } from '@upstash/redis'
import { Ratelimit } from "@upstash/ratelimit"

const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  // Límite muy estricto para testing: 2 requests por 30 segundos
  limiter: Ratelimit.slidingWindow(2, "30 s"),
  analytics: true
})

console.log("🔧 Rate limiter configured: 2 requests per 30 seconds");

export default rateLimit