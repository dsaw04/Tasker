import jwt from "jsonwebtoken";

/**
 * Generates a short-lived access token for authenticated users.
 * @param {string} userId - The ID of the user.
 * @returns {string} - A JWT access token valid for 15 minutes.
 */
export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

/**
 * Generates a refresh token for authenticated users.
 * @param {string} userId - The ID of the user.
 * @returns {string} - A JWT refresh token valid for 7 days.
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: "7d",
  });
};

/**
 * Generates a shorter-lived refresh token for guest users.
 * @param {string} userId - The ID of the guest user.
 * @returns {string} - A JWT refresh token valid for 30 minutes.
 */
export const generateGuestRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: "30m",
  });
};
