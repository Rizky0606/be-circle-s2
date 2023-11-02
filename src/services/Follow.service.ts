import { Repository } from "typeorm";
import { User } from "../entities/user";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";

export default new (class FollowService {
  private readonly UserRepository: Repository<User> =
    AppDataSource.getRepository(User);

  async follow(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;

      const followingUser = await this.UserRepository.findOne({
        where: {
          id: parseInt(userId),
        },
      });

      if (!followingUser) {
        throw new Error(`User ID ${userId} not found`);
      }

      const followerUser = await this.UserRepository.findOne({
        where: {
          id: res.locals.loginSession.user.id,
        },
      });

      if (!followerUser) {
        throw new Error(`User ID ${res.locals.loginSession.user.id} not found`);
      }

      if (followerUser.id === followingUser.id) {
        throw new Error(`You can't follow yourself`);
      }

      const checkFollow = await this.UserRepository.query(
        "SELECT * FROM following WHERE following_id=$1 AND follower_id=$2",
        [followingUser.id, followerUser.id]
      );

      if (checkFollow.length) {
        await this.UserRepository.query(
          "DELETE FROM following WHERE following_id=$1 AND follower_id=$2",
          [followingUser.id, followerUser.id]
        );

        return res
          .status(200)
          .json({ status: "Success", message: "Unfollow User Successfuly" });
      }

      await this.UserRepository.query(
        "INSERT INTO following(following_id, follower_id) VALUES($1, $2)",
        [followingUser.id, followerUser.id]
      );

      return res
        .status(201)
        .json({ status: "Success", message: "Follow User Success" });
    } catch (error) {
      return res.status(500).json({ Error: `${error}` });
    }
  }
})();
