import { Request, Response } from "express";
import RepliesService from "../services/RepliesService";

export default new (class RepliesController {
  find(req: Request, res: Response) {
    RepliesService.find(req, res);
  }

  findOne(req: Request, res: Response) {
    RepliesService.findOne(req, res);
  }

  create(req: Request, res: Response) {
    RepliesService.create(req, res);
  }

  update(req: Request, res: Response) {
    RepliesService.update(req, res);
  }

  delete(req: Request, res: Response) {
    RepliesService.delete(req, res);
  }
})();
