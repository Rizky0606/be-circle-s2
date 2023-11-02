import { Request, Response } from "express";
import { createRepliesSchema } from "../utils/validator/Replies";
import MessageQueue from "../libs/rabbitmq";

type QueuePayload = {
  content: string;
  userId: number;
  threadsId: number;
};

export default new (class RepliesQueue {
  async create(req: Request, res: Response) {
    try {
      const loginSession = res.locals.loginSession;

      const data = {
        content: req.body.content,
        threadsId: req.body.threadsId,
      };

      const { error, value } = createRepliesSchema.validate(data);

      if (error) return res.status(400).json({ Error: `${error}` });

      const payload: QueuePayload = {
        content: value.content,
        threadsId: value.threadsId,
        userId: loginSession.user.id,
      };

      const errorQueue = await MessageQueue.MessageSend(
        process.env.REPLIES,
        payload
      );

      if (errorQueue)
        return res.status(500).json({ Message: "Something Error" });

      return res.status(201).json({
        message: "replies is queue !",
        payload,
      });
    } catch (error) {
      throw error;
    }
  }
})();
