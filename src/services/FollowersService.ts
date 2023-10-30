import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { Followers } from "../entities/followers";
import { createFollowerSchema } from "../utils/validator/Follow";

export default new (class FollowersService {
  private readonly FollowerRepository: Repository<Followers> =
    AppDataSource.getRepository(Followers);

  async find(req: Request, res: Response): Promise<Response> {
    try {
      const followers = await this.FollowerRepository.find({
        relations: [
          "followingId",
          "followersId",
          "followingId.userId",
          "followersId.userId",
        ],
      });

      return res.status(200).json(followers);
    } catch (error) {
      return res.status(500).json({ Error: `${error}` });
    }
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const followers = await this.FollowerRepository.findOne({
        where: {
          id: id,
        },
        relations: [
          "followingId",
          "followersId",
          "followingId.userId",
          "followersId.userId",
        ],
      });
      return res.status(200).json(followers);
    } catch (error) {
      return res.status(500).json({ Error: `${error}` });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;

      const { error, value } = createFollowerSchema.validate(data);

      if (error) return res.status(400).json({ Error: `${error}` });

      const followers = this.FollowerRepository.create({
        followingId: value.followingId,
        followersId: value.followersId,
      });

      const createFollowers = await this.FollowerRepository.save(followers);

      return res.status(200).json(createFollowers);
    } catch (error) {
      return res.status(500).json({ Error: `${error}` });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);

      const followers = await this.FollowerRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!followers)
        return res.status(404).json({ Error: "ID Followers Not Found" });

      const response = await this.FollowerRepository.delete({
        id: id,
      });
      return res.status(200).json({ Message: "Delete Followers Succesfully" });
    } catch (error) {
      return res.status(500).json({ Error: `${error}` });
    }
  }
})();
