import { Request, Response } from "express";
import UsersService from "../services/UsersService";

export default new (class UsersController {
  find(req: Request, res: Response) {
    UsersService.find(req, res);
  }

  findOne(req: Request, res: Response) {
    UsersService.findOne(req, res);
  }

  create(req: Request, res: Response) {
    UsersService.create(req, res);
  }

  update(req: Request, res: Response) {
    UsersService.create(req, res);
  }

  delete(req: Request, res: Response) {
    UsersService.delete(req, res);
  }
})();
