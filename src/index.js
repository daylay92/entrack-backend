/* eslint-disable no-console */
import 'dotenv/config';
import express, { json, urlencoded } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import client from './database';

const { PORT } = process.env;
// create express app
const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// Handle all Requests not handled by all designated routes
app.use((req, res, next) => {
  const err = new Error('Not found');
  err.status = 404;
  next(err);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'something is wrong'
  });
});

// listen for redis database connection
client.on('connect', () => {
  console.log('DB is connected');
});

// set port
const port = PORT || 3000;

app.listen(port, () => {
  console.log(`Amazing Stuff is Happening on: ${port}`);
});
