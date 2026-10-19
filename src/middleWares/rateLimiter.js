const { RateLimiterMemory } = require("rate-limiter-flexible");
// const { RateLimiterRedis } = require("rate-limiter-flexible"); // for production

const POINTS = 5;          // 5 attempts
const DURATION = 15 * 60;  // per 15 minutes (in seconds)

const createLimiter = (keyPrefix) =>
  new RateLimiterMemory({ 
    keyPrefix, 
    points: POINTS, 
    duration: DURATION 
});

const loginLimiter = createLimiter("login");
const signupLimiter = createLimiter("signup");
const resendOtpLimiter = createLimiter("resend_otp");

const getKey = (req) => {
  const email = req.body?.email?.toLowerCase().trim();
  return email || req.ip;
};

const rateLimit = (limiter, message) => async (req, res, next) => {
  const key = getKey(req);
  try {
    const result = await limiter.consume(key);
    res.set({
      "X-RateLimit-Limit": POINTS,
      "X-RateLimit-Remaining": result.remainingPoints,
    });
    req.rateLimitKey = key; // handy for resetting later
    next();
  } catch (err) {
    // Real errors (e.g. Redis failure) are Error instances; rejections from the limiter are RateLimiterRes
    if (err instanceof Error) return next(err);

    const retryAfter = Math.ceil(err.msBeforeNext / 1000);
    res.set("Retry-After", retryAfter);
    return res.status(429).json({
      success: false,
      message,
      retryAfterSeconds: retryAfter,
    });
  }
};

module.exports = {
  loginLimiter,
  loginRateLimit: rateLimit(loginLimiter, "Too many login attempts. Try again later."),
  signupRateLimit: rateLimit(signupLimiter, "Too many signup attempts. Try again later."),
  resendOtpRateLimit: rateLimit(resendOtpLimiter, "Too many OTP requests. Try again later."),
};