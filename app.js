const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const expressSession = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');

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
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

// Import routers
const indexRouter = require('./routes/indexRouter');
const usersRouter = require('./routes/usersRouter');

// Routers
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  }

  console.log('App listening to requests on port ' + PORT + '.');
});
