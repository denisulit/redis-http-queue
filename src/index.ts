import express, { Request, Response } from "express";
import { config } from "./config";
import queueManager from "./queueManager";

const app = express();
app.use(express.json());

app.post("/queue", async (req: Request, res: Response) => {
  const { id, url, options, password } = req.body; // Options is an object that can contain any axios options

  if (!id || !url) {
    return res.status(400).send("id and url are required");
  }

  if (config.QUEUE_PASSWORD && password !== config.QUEUE_PASSWORD) {
    return res.status(401).send("Unauthorized");
  }

  await queueManager.addToQueue({ id, url, options: options || {} });
  res.status(200).send("Added to queue");
});

const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  queueManager.processQueue();
});
