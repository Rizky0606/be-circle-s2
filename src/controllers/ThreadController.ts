import { Request, Response } from "express";
import ThreadService from "../services/Thread.service";
import ThreadQueue from "../queue/ThreadQueue";

export default new (class ThreadControllers {
  find(req: Request, res: Response) {
    ThreadService.find(req, res);
  }

  findOne(req: Request, res: Response) {
    ThreadService.findOne(req, res);
  }

  create(req: Request, res: Response) {
    ThreadQueue.create(req, res);
  }

  update(req: Request, res: Response) {
    ThreadService.update(req, res);
  }

  delete(req: Request, res: Response) {
    ThreadService.delete(req, res);
  }
})();
