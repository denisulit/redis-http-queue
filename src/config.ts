import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  REDIS_URL: z.string().url(),
  QUEUE_PASSWORD: z.string().optional(),
  PORT: z.string().optional().default("3000"),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error("Invalid environment variables:", env.error.format());
  process.exit(1);
}

export const config = env.data;
