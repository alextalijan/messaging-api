const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Import routers
const usersRouter = require('./routes/usersRouter');

// Routers
app.use('/users', usersRouter);

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  }

  console.log('App listening to requests on port ' + PORT + '.');
});
