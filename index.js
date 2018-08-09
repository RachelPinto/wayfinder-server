'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const passport = require('passport');
const localStrategy = require('./passport/local');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
const jwtStrategy = require('./passport/jwt');
// const {dbConnect} = require('./db-knex');

const recordsRouter = require('./routes/records');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

// Create an Express application
const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

// Parse request body
app.use(express.json());
app.use('/api', authRouter);

passport.use(localStrategy);
passport.use(jwtStrategy);

// Mount routers
app.use('/api/records', recordsRouter);
app.use('/api', usersRouter);


function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}



if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
