import redis from "../config/redis_config.js";
import RedisStore from "rate-limit-redis";
import rateLimitMiddleware from "express-rate-limit";

// Configure rate limiter middleware
const rateLimiter = rateLimitMiddleware({
    store: new RedisStore({
        sendCommand: (...args) => redis.call(...args) // Use ioredis's call method
    }),
    windowMs: 60 * 1000, // 1 minute window
    max: 10, // Maximum 10 requests per window
    message: "Too many requests from this IP, please try again after some time.", // Custom message for rate limit exceeded
    statusCode: 429, // HTTP status code for rate limit exceeded
    keyGenerator: (req) => req.ip, // Use IP address as the key for rate limiting
});

// Export the rate limiter middleware
export default rateLimiter;
