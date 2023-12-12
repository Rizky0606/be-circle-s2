import { Repository } from "typeorm";
import { User } from "../entities/user";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { createUsersSchema, updateUsersSchema } from "../utils/validator/Users";
import { DEFAULT_EXPIRATION, client } from "../libs/redisConfig";

export default new (class UsersService {
  private readonly UserRepository: Repository<User> =
    AppDataSource.getRepository(User);

  async find(req: Request, res: Response): Promise<Response> {
    try {
      const users = await this.UserRepository.find();

      const following = await this.UserRepository.query(
        "SELECT u.id, u.username, u.full_name, u.photo_profile, follow.following_id, follow.follower_id FROM following as follow INNER JOIN users as u ON u.id=follow.following_id"
      );
      const follower = await this.UserRepository.query(
        "SELECT u.id, u.username, u.full_name, u.photo_profile, follow.follower_id, follow.following_id FROM following as follow INNER JOIN users as u ON u.id=follow.follower_id "
      );

      const usersMap = users.map((user) => {
        const followingPersonal = following.filter((following) => {
          return following.follower_id === user.id;
        });
        const followerPersonal = follower.filter((follower) => {
          return follower.following_id === user.id;
        });

        return {
          ...user,
          following: followingPersonal,
          follower: followerPersonal,
        };
      });

      return res.status(200).json(usersMap);
    } catch (error) {
      return res.status(500).json({ Error: "Error while getting users" });
    }
  }

  async findByJWT(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(res.locals.loginSession.user.id);

      const redisKey = id.toString();   

      const redisCache = await client.get(redisKey);

      if (redisCache) {
        const following = await this.UserRepository.query(
          "SELECT u.id, u.username, u.full_name, u.photo_profile FROM following as follow INNER JOIN users as u ON u.id=follow.following_id WHERE follow.follower_id=$1",
          [res.locals.loginSession.user.id]
        );
        const follower = await this.UserRepository.query(
          "SELECT u.id, u.username, u.full_name, u.photo_profile FROM following as follow INNER JOIN users as u ON u.id=follow.follower_id WHERE follow.following_id=$1",
          [res.locals.loginSession.user.id]
        );

        return res.status(200).json({
          data: JSON.parse(redisCache),
          follow: {
            follower,
            following,
          },
        });
      }

      const user = await this.UserRepository.findOne({
        where: {
          id: id,
        },
        relations: ["threads", "threads.likes", "threads.replies"],
      });

      if (!user) {
        throw new Error(`User ID ${res.locals.loginSession.user.id} not found`);
      }

      const following = await this.UserRepository.query(
        "SELECT u.id, u.username, u.full_name, u.photo_profile FROM following as follow INNER JOIN users as u ON u.id=follow.following_id WHERE follow.follower_id=$1",
        [res.locals.loginSession.user.id]
      );
      const follower = await this.UserRepository.query(
        "SELECT u.id, u.username, u.full_name, u.photo_profile FROM following as follow INNER JOIN users as u ON u.id=follow.follower_id WHERE follow.following_id=$1",
        [res.locals.loginSession.user.id]
      );

      client.setEx(redisKey, DEFAULT_EXPIRATION, JSON.stringify(user));

      return res.status(200).json({
        data: {
          ...user,
          password: null,
          follower,
          following,
        },
      });
    } catch (error) {
      return res.status(500).json({ Error: `${error}` });
    }
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const user = await this.UserRepository.findOne({
        where: {
          id: id,
        },
        relations: ["threads", "threads.likes", "threads.replies"],
      });

      const following = await this.UserRepository.query(
        "SELECT u.id, u.username, u.full_name, u.photo_profile FROM following as follow INNER JOIN users as u ON u.id=follow.following_id WHERE follow.follower_id=$1",
        [id]
      );
      const follower = await this.UserRepository.query(
        "SELECT u.id, u.username, u.full_name, u.photo_profile FROM following as follow INNER JOIN users as u ON u.id=follow.follower_id WHERE follow.following_id=$1",
        [id]
      );
      return res.status(200).json({ user, follower, following });
    } catch (error) {
      console.log(error);

      return res.status(500).json({ Error: "Error while getting user" });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;

      const { error, value } = createUsersSchema.validate(data);

      if (error) return res.status(400).json({ Error: `${error}` });

      const user = this.UserRepository.create({
        full_name: value.full_name,
        username: value.username,
        email: value.email,
        password: value.password,
        photo_profile: value.photo_profile,
        bio: value.bio,
      });

      const createUser = await this.UserRepository.save(user);
      return res.status(200).json(createUser);
    } catch (error) {
      return res.status(500).json({ Error: `${error}` });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const user = await this.UserRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!user) return res.status(404).json({ Error: "User Not Found" });

      const data = req.body;

      const { error } = updateUsersSchema.validate(data);
      if (error) return res.status(400).json({ Error: `${error}` });

      if (data.username != "") user.username = data.username;
      if (data.full_name != "") user.full_name = data.full_name;
      if (data.email != "") user.email = data.email;
      if (data.password != "") user.password = data.password;
      if (data.photo_profile != "") user.photo_profile = data.photo_profile;
      if (data.bio != "") user.bio = data.bio;

      const update = await this.UserRepository.save(user);
      return res.status(201).json(update);
    } catch (error) {
      return res.status(500).json({ Error: `${error}` });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);

      const user = await this.UserRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!user) return res.status(404).json({ Error: `User Not Found` });

      const response = await this.UserRepository.save(user);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ Error: "Error while getting user" });
    }
  }
})();
