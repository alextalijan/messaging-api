const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up cors
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

// Set up parsing of json for incoming requests
app.use(express.json());

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
// https://github.com/jwalton/passport-api-docs
const passport = require('passport');
require('./config/passport');

// Initialize Passport
app.use(passport.initialize());

// Enable Passport session support (must be after express-session)
app.use(passport.session());

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
