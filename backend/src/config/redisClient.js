// backend>src>config>redisClient.js

import redis from "redis";

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

client.on("error", (error) => {
  console.error(`Redis error: ${error}`);
});

export default client;
