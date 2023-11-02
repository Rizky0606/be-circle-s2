import { Request, Response } from "express";
import FollowService from "../services/Follow.service";

export default new (class FollowControllers {
  follow(req: Request, res: Response) {
    FollowService.follow(req, res);
  }
})();
