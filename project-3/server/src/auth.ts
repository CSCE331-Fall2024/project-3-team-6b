import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config();

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name: string;
      picture: string;
    }
  }
}

export {};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`, // Ensure this matches the Google Console configuration
    },
    (accessToken, refreshToken, profile, done) => {
      // Transform the profile to match Express.User
      const user: Express.User = {
        id: profile.id,
        email: profile.emails?.[0]?.value || '', // Default to empty string if email is not available
        name: profile.displayName,
        picture: profile.photos?.[0]?.value || '', // Default to empty string if picture is not available
      };

      // Pass the transformed user object to Passport
      done(null, user);
    }
  )
);

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});

export default passport;
