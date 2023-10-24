import { Repository } from "typeorm";
import { Threads } from "../entities/thread";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import {
  createThreadsSchema,
  updateThreadsSchema,
} from "../utils/validator/Thread";

export default new (class ThreadService {
  private readonly ThreadRepository: Repository<Threads> =
    AppDataSource.getRepository(Threads);

  async find(req: Request, res: Response): Promise<Response> {
    try {
      const thread = await this.ThreadRepository.find({
        relations: ["userId"],
      });

      let newResponse = [];
      thread.forEach((data) => {
        newResponse.push({
          ...data,
          likes_count: Math.floor(Math.random() * 10),
          replies_count: Math.floor(Math.random() * 10),
        });
      });

      return res.status(200).json(thread);
    } catch (err) {
      return res.status(500).json({ Error: "Error while getting threads" });
    }
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const thread = await this.ThreadRepository.findOne({
        where: {
          id: id,
        },
      });

      return res.status(200).json(thread);
    } catch (error) {
      return res.status(400).json({ Error: "Bad Request" });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;

      const { error } = createThreadsSchema.validate(data);
      if (error) return res.status(400).json({ Error: `${error}` });

      const thread = this.ThreadRepository.create({
        content: data.content,
        Image: data.Image,
        userId: data.userId,
      });

      const createdThread = await this.ThreadRepository.save(thread);
      res.status(200).json(createdThread);
    } catch (error) {
      return res.status(500).json({ Error: `${error}` });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const thread = await this.ThreadRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!thread)
        return res.status(400).json({ Error: "Thread ID not found" });

      const data = req.body;

      const { error } = updateThreadsSchema.validate(data);
      if (error) return res.status(400).json({ Error: error });

      if (data.content != "") thread.content = data.content;
      if (data.Image != "") thread.Image = data.Image;

      const update = await this.ThreadRepository.save(thread);
      return res.status(201).json(update);
    } catch (error) {
      return res.status(500).json({ Error: "Bad Request" });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);

      const thread = await this.ThreadRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!thread)
        return res.status(404).json({ Error: `Thread ID Not Found` });

      const response = await this.ThreadRepository.delete({
        id: id,
      });

      return res.status(200).json({ response });
    } catch (error) {
      return res.status(500).json({ Error: "Bad Request" });
    }
  }
})();
