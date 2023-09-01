import redis from "redis";

let client;

const connectRedis = () => {
  client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    retry_strategy: function (options) {
      if (options.error && options.error.code === "ECONNREFUSED") {
        // End reconnecting on a specific error and flush all commands with
        // an individual error
        return new Error("The server refused the connection");
      }
      if (options.total_retry_time > 1000 * 60 * 60) {
        // End reconnecting after a specific timeout and flush all commands
        // with a individual error
        return new Error("Retry time exhausted");
      }
      if (options.attempt > 10) {
        // End reconnecting with built-in error
        return undefined;
      }
      // Reconnect after this time
      return Math.min(options.attempt * 100, 3000);
    },
  });

  client.on("error", (error) => {
    console.error(`Redis error: ${error}`);
  });

  client.on("end", () => {
    console.warn("Redis disconnected. Reconnecting...");
    connectRedis();
  });
};

connectRedis();

export default client;
