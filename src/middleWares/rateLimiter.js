const rateLimit = require("express-rate-limit");

// General API limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message: "Too many requests. Please try again later.",
  },
});

const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message: "Too many signup attempts. Please try again later.",
  },
});


// Login limiter
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message: "Too many login attempts. Please try again after 10 minutes.",
  },
});


// OTP verification limiter
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message: "Too many OTP attempts. Please try again later.",
  },
});


// OTP resend limiter
const resendOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message: "Too many OTP requests. Please try again later.",
  },
});


module.exports = {
  generalLimiter,
  signupLimiter,
  loginLimiter,
  otpLimiter,
  resendOtpLimiter,
};