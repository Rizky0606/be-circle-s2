import { Request, Response } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Likes } from "../entities/likes";
import { createLikeSchema } from "../utils/validator/Likes";

export default new (class LikesService {
  private readonly LikesRepository: Repository<Likes> =
    AppDataSource.getRepository(Likes);

  async find(req: Request, res: Response): Promise<Response> {
    try {
      const likes = await this.LikesRepository.find({
        relations: ["userId", "threadsId", "repliesId"],
      });
      return res.status(200).json(likes);
    } catch (error) {
      return res.status(500).json({ Error: `${error}` });
    }
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const like = await this.LikesRepository.findOne({
        where: {
          id: id,
        },
        relations: ["userId", "threadsId"],
      });
      return res.status(200).json(like);
    } catch (error) {
      return res.status(500).json({ Error: `${error}` });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;

      const { error, value } = createLikeSchema.validate(data);

      if (error)
        return res.status(400).json({
          Error: `${error}`,
        });

      const like = this.LikesRepository.create({
        userId: value.userId,
        threadsId: value.threadsId,
        repliesId: value.repliesId,
      });

      const createdLike = await this.LikesRepository.save(like);
      return res.status(201).json(createdLike);
    } catch (error) {
      return res.status(500).json({ Error: `${error}` });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);

      const like = await this.LikesRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!like) return res.status(404).json({ Error: "Like Not Found" });

      const response = await this.LikesRepository.delete({
        id: id,
      });
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ Error: `${error}` });
    }
  }
})();
