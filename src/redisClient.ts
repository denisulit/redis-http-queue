import { createClient } from "redis";
import { config } from "./config";

const redisClient = createClient({
  url: config.REDIS_URL,
});

redisClient.on("error", (err) => {
  console.error("Redis client error", err);
});

(async () => {
  await redisClient.connect();
})();

export default redisClient;
