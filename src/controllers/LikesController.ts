import { Request, Response } from "express";
import LikesService from "../services/Likes.service";

export default new (class LikesController {
  // find(req: Request, res: Response) {
  //   LikesService.find(req, res);
  // }

  // findOne(req: Request, res: Response) {
  //   LikesService.findOne(req, res);
  // }

  create(req: Request, res: Response) {
    LikesService.like(req, res);
  }

  // delete(req: Request, res: Response) {
  //   LikesService.delete(req, res);
  // }
})();
