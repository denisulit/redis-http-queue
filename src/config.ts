import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  REDIS_URL: z.string().url(),
  QUEUE_PASSWORD: z.string().optional(),
  PORT: z.string().optional().default("3000"),
  QUEUE_TIMEOUT: z.string().optional().default("1000").transform(Number),
  REQUEUE_DELAY: z.string().optional().default("30000").transform(Number),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error("Invalid environment variables:", env.error.format());
  process.exit(1);
}

export const config = env.data;
