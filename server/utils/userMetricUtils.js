import { redisClient } from "../config/redisClient.js";
import UserMetrics from "../models/userMetricsModel.js";

/**
 * Retrieves user streak, using Redis cache first.
 */
export const getUserStreak = async (userId) => {
  const cacheKey = `streak:${userId}`;
  let streak = await redisClient.get(cacheKey);
  if (streak !== null) {
    return parseInt(streak, 10);
  }

  const userMetrics = await UserMetrics.findOne({ user: userId }, "streak");
  if (!userMetrics) throw new Error("User metrics not found");

  streak = userMetrics.streak;

  await redisClient.set(cacheKey, streak, { EX: 86400 });

  return streak;
};

/**
 * Increments user streak, using Redis cache first.
 */
export const incrementUserStreak = async (userId) => {
  const cacheKey = `streak:${userId}`;
  let userMetrics = await UserMetrics.findOne({ user: userId });

  userMetrics.streak += 1;
  await userMetrics.save();

  await redisClient.set(cacheKey, userMetrics.streak, { EX: 86400 });

  return userMetrics.streak;
};

/*
 * Creates user metrics
 */
export const createUserMetrics = async (userId, role) => {
  const userMetrics = new UserMetrics({
    user: userId,
    role: role,
  });

  await userMetrics.save();

  return userMetrics;
};
