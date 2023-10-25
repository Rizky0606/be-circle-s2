import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { Replies } from "../entities/replies";
import {
  createRepliesSchema,
  updateRepliesSchema,
} from "../utils/validator/Replies";

export default new (class RepliesService {
  private readonly RepliesRepository: Repository<Replies> =
    AppDataSource.getRepository(Replies);

  async find(req: Request, res: Response): Promise<Response> {
    try {
      const replies = await this.RepliesRepository.find({
        relations: ["userId", "threadsId"],
      });

      return res.status(200).json(replies);
    } catch (err) {
      return res.status(500).json({ Error: "Error while getting replies" });
    }
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const reply = await this.RepliesRepository.findOne({
        where: {
          id: id,
        },
        relations: ["userId", "threadsId"],
      });
      return res.status(200).json(reply);
    } catch (error) {
      return res.status(500).json({ Error: "Error while Getting reply" });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;

      const { error, value } = createRepliesSchema.validate(data);

      if (error) return res.status(400).json({ Error: `${error}` });

      const replies = this.RepliesRepository.create({
        content: value.content,
        userId: value.userId,
        threadsId: value.threadsId,
      });

      const createdReplies = await this.RepliesRepository.save(replies);
      return res.status(201).json(createdReplies);
    } catch (error) {
      return res.status(500).json({ Error: "Error while getting replies" });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const reply = await this.RepliesRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!reply) return res.status(400).json({ Error: "Reply Not Found" });

      const data = req.body;

      const { error } = updateRepliesSchema.validate(data);

      if (error)
        return res.status(400).json({
          Error: `${error}`,
        });

      if (data.content != "") reply.content = data.content;

      const update = await this.RepliesRepository.save(reply);
      return res.status(201).json(update);
    } catch (error) {
      return res.status(500).json({ Error: `${error}` });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);

      const replies = await this.RepliesRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!replies) return res.status(404).json({ Error: "Reply Not Found" });

      const response = await this.RepliesRepository.delete({
        id: id,
      });
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ Error: `${error}` });
    }
  }
})();
