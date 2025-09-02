import { Redis } from '@upstash/redis'
import { Ratelimit } from "@upstash/ratelimit"

const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  // Límite muy estricto para testing: 3 requests por 60 segundos
  limiter: Ratelimit.slidingWindow(3, "60 s"),
  analytics: true, // Para ver estadísticas en Upstash
})

export default rateLimit