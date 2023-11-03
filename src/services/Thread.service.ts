import { Repository } from "typeorm";
import { Threads } from "../entities/thread";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import {
  createThreadsSchema,
  updateThreadsSchema,
} from "../utils/validator/Thread";
import { v2 as cloudinary } from "cloudinary";
import * as redis from "redis";

export default new (class ThreadService {
  private readonly ThreadRepository: Repository<Threads> =
    AppDataSource.getRepository(Threads);

  async find(req: Request, res: Response): Promise<Response> {
    try {
      const threads = await this.ThreadRepository.find({
        select: {
          id: true,
          content: true,
          image: true,
          created_at: true,
          userId: {
            id: true,
            full_name: true,
            username: true,
            email: true,
            photo_profile: true,
          },
          replies: {
            id: true,
            image: true,
            content: true,
            userId: {
              id: true,
              full_name: true,
              username: true,
              email: true,
              photo_profile: true,
            },
          },
          likes: {
            id: true,
            userId: {
              id: true,
              full_name: true,
              username: true,
              email: true,
              photo_profile: true,
            },
          },
        },
        relations: {
          userId: true,
          replies: true,
          likes: { userId: true },
        },
        order: {
          id: "DESC",
        },
      });

      // const redisClient = redis.createClient();
      // await redisClient.connect();
      // const DEFAULT_EXPRIRATION = 3600;

      return res.status(200).json(threads);
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
        // select: {
        //   id: true,
        //   content: true,
        //   image: true,
        //   created_at: true,
        //   userId: {
        //     id: true,
        //     full_name: true,
        //     username: true,
        //     email: true,
        //     photo_profile: true,
        //   },
        // },
        // relations: {
        //   userId: true,
        //   likes: true,
        //   replies: true,
        // },
        relations: [
          "userId",
          "likes",
          "replies",
          "replies.userId",
          "likes.userId",
        ],
      });

      return res.status(200).json(thread);
    } catch (error) {
      return res.status(500).json({ Error: "Error while getting threads" });
    }
  }

  // async create(req: Request, res: Response): Promise<Response> {
  //   try {
  //     const data = req.body;
  //     const user = res.locals.loginSession;

  //     const { error } = createThreadsSchema.validate(data);
  //     if (error) return res.status(400).json({ Error: `${error}` });

  //     const thread = this.ThreadRepository.create({
  //       content: data.content,
  //  image: cloudinaryResponse.secure_url,
  //       userId: user.user.id,
  //     });

  //     const createdThread = await this.ThreadRepository.save(thread);
  //     res.status(200).json(createdThread);
  //   } catch (error) {
  //     return res.status(500).json({ Error: `${error}` });
  //   }
  // }

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
      if (data.image != "") thread.image = data.image;

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

      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ Error: "Bad Request" });
    }
  }
})();
