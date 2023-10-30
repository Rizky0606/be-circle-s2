import { Repository } from "typeorm";
import { User } from "../entities/user";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { createUsersSchema, updateUsersSchema } from "../utils/validator/Users";

export default new (class UsersService {
  private readonly UserRepository: Repository<User> =
    AppDataSource.getRepository(User);

  async find(req: Request, res: Response): Promise<Response> {
    try {
      const users = await this.UserRepository.find({
        select: {
          id: true,
          username: true,
          full_name: true,
          email: true,
          photo_profile: true,
          bio: true,
          created_at: true,
          threads: true,
        },
        relations: {
          threads: true,
          like: true,
        },
      });

      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ Error: "Error while getting users" });
    }
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const user = await this.UserRepository.findOne({
        where: {
          id: id,
        },
      });
      return res.status(200).json(user);
    } catch (error) {
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
      return res.status(500).json({ Error: "Error while getting user" });
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

      if (data.username != "") user.username = data.username;
      if (data.full_name != "") user.full_name = data.full_name;
      if (data.email != "") user.email = data.email;
      if (data.password != "") user.password = data.password;
      if (data.photo_profile != "") user.photo_profile = data.photo_profile;
      if (data.bio != "") user.bio = data.bio;

      const update = await this.UserRepository.save(user);
      return res.status(201).json(update);
    } catch (error) {
      return res.status(500).json({ Error: "Error while getting user" });
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
