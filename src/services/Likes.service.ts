import { Repository } from "typeorm";
import { Likes } from "../entities/likes";
import { AppDataSource } from "../data-source";
import { Threads } from "../entities/thread";
import { User } from "../entities/user";
import { Request, Response } from "express";

export default new (class LikeService {
  private readonly LikeRepository: Repository<Likes> =
    AppDataSource.getRepository(Likes);
  private readonly ThreadRepository: Repository<Threads> =
    AppDataSource.getRepository(Threads);
  private readonly UserRepository: Repository<User> =
    AppDataSource.getRepository(User);

  async like(req: Request, res: Response): Promise<Response> {
    try {
      const { threadId } = req.params;
      console.log(res.locals.loginSession);

      const userSelected = await this.UserRepository.findOne({
        where: {
          id: res.locals.loginSession.user.id,
        },
      });

      if (!userSelected) {
        throw new Error(`User ID ${res.locals.loginSession} not found`);
      }

      const threadSelected = await this.ThreadRepository.findOne({
        where: {
          id: Number(threadId),
        },
      });

      if (!threadSelected) {
        throw new Error(`Thread ID ${threadId} not found`);
      }

      // Checking Like Threads
      const likeSelected = await this.LikeRepository.findOne({
        where: {
          userId: {
            id: userSelected.id,
          },
          threadsId: {
            id: threadSelected.id,
          },
        },
      });

      // If Already Like
      if (likeSelected) {
        await this.LikeRepository.delete(likeSelected.id);

        return res.status(200).json({ message: "Undo Like Thread Succes" });
      }

      const like = new Likes();
      like.userId = userSelected;
      like.threadsId = threadSelected;
      await this.LikeRepository.save(like);

      return res.status(201).json({ message: "Like Thread Succes" });
    } catch (error) {
      return res.status(500).json({ Error: "Something error" });
    }
  }
})();
