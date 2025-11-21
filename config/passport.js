const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const prisma = new (require('@prisma/client').PrismaClient)();
const bcrypt = require('bcryptjs');

// Set up local strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) return done(null, false);

      const match = await bcrypt.compare(password, user.hash);
      if (!match) return done(null, false);

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// These are used to save and restore the user to the session
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});
