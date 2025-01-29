import rateLimit from "express-rate-limit";

export const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5,
  message: "Too many accounts created. Please try again later.",
});

// Limit login attempts
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 5,
  message: "Too many login attempts. Please try again later.",
});

// Limit password resets & verification emails
export const emailRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 3,
  message: "Too many requests. Please try again later.",
});

// Limit guest account creation to 2 per hour
export const guestRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 2,
    message: "Too many guest accounts created. Please try again later.",
  });
