const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const expressSession = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');

// Initialize prisma client and store
const prisma = new PrismaClient();
const store = new PrismaSessionStore(prisma, {
  checkPeriod: 2 * 60 * 1000, //ms
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
});

// https://github.com/kleydon/prisma-session-store#readme
// Set up express sessions with prisma store
app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    },
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store,
  })
);

// Set up passport
// Import passport.js and sessions
// https://github.com/jwalton/passport-api-docs
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Initialize Passport
app.use(passport.initialize());

// Enable Passport session support (must be after express-session)
app.use(passport.session());

// Set up local strategy
passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
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
      where: {
        id: id,
      },
      select: {
        id: true,
        username: true,
      },
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Set up cors
app.use(cors());

// Set up parsing of json for incoming requests
app.use(express.json());

// Import routers
const indexRouter = require('./routes/indexRouter');
const usersRouter = require('./routes/usersRouter');
const chatsRouter = require('./routes/chatsRouter');

// Routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chats', chatsRouter);

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  }

  console.log('App listening to requests on port ' + PORT + '.');
});

module.exports = passport;
