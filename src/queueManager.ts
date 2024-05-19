import redisClient from "./redisClient";
import axios from "axios";
import { config } from "./config";

interface QueueItem {
  id: string;
  url: string;
  options: Record<string, any>;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class QueueManager {
  private queueKey = "fetchQueue";
  private isProcessing = false;
  private timeout = config.QUEUE_TIMEOUT;
  private requeueDelay = config.REQUEUE_DELAY;

  async addToQueue(item: QueueItem): Promise<void> {
    await redisClient.rPush(this.queueKey, JSON.stringify(item));
  }

  async processQueueItem(item: QueueItem): Promise<void> {
    try {
      const response = await axios(item.url, item.options);

      // Update this logic to match what you expect from the API
      if (
        response.status === 200 &&
        (response.data.status === "FAILED" ||
          response.data.status === "COMPLETED")
      ) {
        // In my use case, if the API returns failed or completed, I don't want to keep queueing it. You can change this.
        // This condition is for if no requeue is needed
        console.log(`Successfully processed item with id ${item.id}`);
      } else {
        throw new Error(
          `Received status code ${response.status} with data ${JSON.stringify(
            response.data
          )} for item with id ${item.id}`
        );
      }
    } catch (error) {
      console.error("Error processing queue item", error);
      // Wait for the requeue delay before adding the item back to the queue
      await delay(this.requeueDelay);
      await this.addToQueue(item);
    }
  }

  async processQueue(): Promise<void> {
    this.isProcessing = true;
    while (this.isProcessing) {
      const itemString = await redisClient.lPop(this.queueKey);
      if (itemString) {
        const item: QueueItem = JSON.parse(itemString);
        this.processQueueItem(item); // Process item asynchronously
      } else {
        await delay(this.timeout);
      }
    }
  }

  stopProcessing(): void {
    this.isProcessing = false;
  }
}

export default new QueueManager();
