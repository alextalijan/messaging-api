// Import passport.js and sessions
// https://github.com/jwalton/passport-api-docs
const passport = require('passport').Passport();
const { PrismaClient } = require('@prisma/client');
const LocalStrategy = require('passport').Strategy;
const bcrypt = require('bcryptjs');

// Create a new prisma client
const prisma = new PrismaClient();

// Initialize Passport
app.use(passport.initialize());

// Enable Passport session support (must be after express-session)
app.use(passport.session());

// Set up local strategy
passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await prisma.user.findUnique({
        username: username,
      });

      if (!user) {
        return done(null, false);
      }

      const passwordMatch = await bcrypt.compare(password, user.hash);
      if (!passwordMatch) {
        return done(null, false);
      }

      return done(null, user);
    } catch (err) {
      console.error(err);
    }
  })
);

// These are used to save and restore the user to the session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await prisma.user.findUnique({
      id: id,
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
