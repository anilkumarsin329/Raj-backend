import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Only register Google strategy if credentials are present
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id_here') {

  passport.use(new GoogleStrategy.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (user) return done(null, user);

      user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        user.googleId = profile.id;
        user.isGoogleUser = true;
        if (profile.photos?.[0]?.value) user.profilePicture = profile.photos[0].value;
        await user.save();
        return done(null, user);
      }

      const hashedPassword = await bcrypt.hash(`google_${profile.id}`, 10);
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        password: hashedPassword,
        googleId: profile.id,
        profilePicture: profile.photos?.[0]?.value || '',
        isGoogleUser: true
      });
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));

  console.log('✅ Google OAuth strategy registered');
} else {
  console.log('⚠️  Google OAuth skipped - credentials not configured');
}

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
