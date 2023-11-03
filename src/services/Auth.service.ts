import { Repository } from "typeorm";
import { User } from "../entities/user";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../utils/validator/Auth";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
export default new (class AuthService {
  private readonly AuthRepository: Repository<User> =
    AppDataSource.getRepository(User);

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const { error, value } = registerSchema.validate(data);

      if (error) return res.status(400).json({ Error: `${error}` });

      const isCheckEmail = await this.AuthRepository.count({
        where: {
          email: value.email,
        },
      });

      if (isCheckEmail > 0)
        return res.status(400).json({ Error: "Email already exists" });

      const handlePassword = await bcrypt.hash(value.password, 10);

      const user = this.AuthRepository.create({
        full_name: value.full_name,
        username: value.username,
        email: value.email,
        password: handlePassword,
      });

      const createdUser = await this.AuthRepository.save(user);
      return res.status(201).json({
        message: "User created successfully",
        user: createdUser,
      });
    } catch (error) {
      return res.status(500).json({ Error: `${error}` });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;

      const { error, value } = loginSchema.validate(data);

      const isCheckEmail = await this.AuthRepository.findOne({
        where: {
          email: value.email,
        },

        select: [
          "id",
          "username",
          "full_name",
          "email",
          "password",
          "photo_profile",
          "bio",
          "threads",
          "like",
        ],
      });

      if (!isCheckEmail)
        return res.status(404).json({ Error: `Email Not Found` });

      const isCheckPassword = await bcrypt.compare(
        value.password,
        isCheckEmail.password
      );

      if (!isCheckPassword)
        return res.status(400).json({ Error: "Incorrect Password" });

      const user = this.AuthRepository.create({
        id: isCheckEmail.id,
        full_name: isCheckEmail.full_name,
        username: isCheckEmail.username,
        email: isCheckEmail.email,
        bio: isCheckEmail.bio,
        photo_profile: isCheckEmail.photo_profile,
        threads: isCheckEmail.threads,
        like: isCheckEmail.like,
      });

      const token = await jwt.sign({ user }, "token", { expiresIn: "1h" });

      return res.status(200).json({
        token,
        user,
      });
    } catch (error) {
      return res.status(500).json({ Error: `${error}` });
    }
  }

  async check(req: Request, res: Response): Promise<Response> {
    try {
      const loginSession = res.locals.loginSession;

      const user = await this.AuthRepository.findOne({
        where: {
          id: loginSession.user.id,
        },
      });

      return res.status(200).json({
        user,
        message: "Logged in",
      });
    } catch (error) {
      return res.status(500).json({ Error: "Error while checking" });
    }
  }
})();
