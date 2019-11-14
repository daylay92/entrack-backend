/* eslint-disable no-console */
import redis from 'redis';
import { promisifyAll } from 'bluebird';
import 'dotenv/config';

promisifyAll(redis);

const { NODE_ENV, REDIS_URL } = process.env;
const option = NODE_ENV === 'production' ? [REDIS_URL] : [];

const client = redis.createClient(...option);

if (NODE_ENV === 'test') {
  client.select(3, err => {
    if (err) console.log(err.message);
  });
}

client.on('error', err => {
  console.log(`Error ${err}`);
});

export default client;
