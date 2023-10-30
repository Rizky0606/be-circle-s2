import { Request, Response } from "express";
import FollowersService from "../services/FollowersService";

export default new (class FollowersController {
  find(req: Request, res: Response) {
    FollowersService.find(req, res);
  }

  findOne(req: Request, res: Response) {
    FollowersService.findOne(req, res);
  }

  create(req: Request, res: Response) {
    FollowersService.create(req, res);
  }

  delete(req: Request, res: Response) {
    FollowersService.delete(req, res);
  }
})();
