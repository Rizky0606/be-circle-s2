import { Request, Response } from "express";
import { createThreadsSchema } from "../utils/validator/Thread";
import MessageQueue from "../libs/rabbitmq";

type QueuePayload = {
  content: string;
  image: string;
  userId: number;
};

export default new (class ThreadQueue {
  async create(req: Request, res: Response) {
    try {
      const loginSession = res.locals.loginSession;

      const data = {
        content: req.body.content,
        image: res.locals.filename,
      };

      const { error, value } = createThreadsSchema.validate(data);

      if (error) return res.status(400).json({ Error: `${error}` });

      const payload: QueuePayload = {
        content: value.content,
        image: value.image,
        userId: loginSession.user.id,
      };

      const errorQueue = await MessageQueue.MessageSend(
        process.env.THREAD,
        payload
      );
      if (errorQueue)
        return res.status(500).json({ Message: "Something error" });

      return res.status(201).json({
        message: "threads is queued !",
        payload,
      });
    } catch (error) {
      throw error;
    }
  }
})();
