import redisClient from "./redisClient";
import axios from "axios";

interface QueueItem {
  id: string;
  url: string;
  options: Record<string, any>;
}

class QueueManager {
  private queueKey = "fetchQueue";

  async addToQueue(item: QueueItem): Promise<void> {
    await redisClient.rPush(this.queueKey, JSON.stringify(item));
  }

  async processQueue(): Promise<void> {
    while (true) {
      const itemString = await redisClient.lPop(this.queueKey);
      if (itemString) {
        const item: QueueItem = JSON.parse(itemString);
        try {
          await axios(item.url, item.options);
        } catch (error) {
          console.error("Error processing queue item", error);
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }
}

export default new QueueManager();
