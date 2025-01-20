import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/userModel.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenUtils.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, googleRefreshToken, profile, done) => {
      try {
        // Find user by email or Google ID
        let user = await User.findOne({
          $or: [{ email: profile.emails[0].value }, { googleId: profile.id }],
        });

        if (!user) {
          // Create a new user if they don't exist
          user = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            role: "user",
            isVerified: true,
          });
          await user.save();
        }

        // Generate tokens using MongoDB `_id`
        const customAccessToken = generateAccessToken(user._id);
        const customRefreshToken = generateRefreshToken(user._id);

        // Update user's refresh token
        user.refreshToken = customRefreshToken;
        user.refreshTokenExpiresAt = new Date(
          Date.now() + 1000 * 60 * 60 * 24 * 7
        ); // 7 days
        await user.save();

        // Return tokens and user data
        return done(null, {
          user,
          customAccessToken,
          refreshToken: customRefreshToken,
        });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['read:user', 'user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the profile contains an email, or use null as a fallback
        const email =
          profile.emails && profile.emails[0] ? profile.emails[0].value : null;

        // Find or create user based on email or GitHub ID
        let user = await User.findOne({
          $or: [{ email }, { githubId: profile.id }],
        });

        if (!user) {
          user = new User({
            username: profile.username || profile.displayName,
            email, // Optional: Null if missing
            githubId: profile.id,
            isVerified: true,
            role: "user",
          });
          await user.save();
        } else {
          // Update GitHub ID or email if they are missing
          if (!user.githubId) {
            user.githubId = profile.id;
          }
          if (!user.email && email) {
            user.email = email;
          }
          await user.save();
        }

        // Generate tokens
        const customAccessToken = generateAccessToken(user._id);
        const customRefreshToken = generateRefreshToken(user._id);

        user.refreshToken = customRefreshToken;
        user.refreshTokenExpiresAt = new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
        );
        await user.save();

        return done(null, {
          user,
          customAccessToken,
          refreshToken: customRefreshToken,
        });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.user ? user.user._id : user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
