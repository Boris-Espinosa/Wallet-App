import { Redis } from '@upstash/redis'
import { Ratelimit } from "@upstash/ratelimit"

const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  
  limiter: Ratelimit.slidingWindow(100, "60 s"),
  analytics: true
})

console.log("Rate limiter configured: 100 requests per 60 seconds");

export default rateLimit