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
        let user = await User.findOne({
          $or: [{ email: profile.emails[0].value }, { googleId: profile.id }],
        });

        if (!user) {
          user = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            role: "user",
            isVerified: true,
          });
          await user.save();
        }

        const customAccessToken = generateAccessToken(user._id);
        const customRefreshToken = generateRefreshToken(user._id);

        user.refreshToken = customRefreshToken;
        user.refreshTokenExpiresAt = new Date(
          Date.now() + 1000 * 60 * 60 * 24 * 7
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

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["read:user", "user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails && profile.emails[0] ? profile.emails[0].value : null;

        let user = await User.findOne({
          $or: [{ email }, { githubId: profile.id }],
        });

        if (!user) {
          user = new User({
            username: profile.username || profile.displayName,
            email,
            githubId: profile.id,
            isVerified: true,
            role: "user",
          });
          await user.save();
        } else {
          if (!user.githubId) {
            user.githubId = profile.id;
          }
          if (!user.email && email) {
            user.email = email;
          }
          await user.save();
        }

        const customAccessToken = generateAccessToken(user._id);
        const customRefreshToken = generateRefreshToken(user._id);

        user.refreshToken = customRefreshToken;
        user.refreshTokenExpiresAt = new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
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

export default passport;
