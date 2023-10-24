import * as express from "express";
import ThreadController from "../controllers/ThreadController";

const router = express.Router();

router.get("/threads", ThreadController.find);
router.get("/threads/:id", ThreadController.findOne);
router.post("/thread", ThreadController.create);
router.patch("/thread/:id", ThreadController.update);
router.delete("/thread/:id", ThreadController.delete);

export default router;
