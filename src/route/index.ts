import * as express from "express";
import ThreadController from "../controllers/ThreadController";
import RepliesController from "../controllers/RepliesController";
import LikesController from "../controllers/LikesController";
import UsersController from "../controllers/UsersController";

const router = express.Router();

// ThreadController
router.get("/threads", ThreadController.find);
router.get("/thread/:id", ThreadController.findOne);
router.post("/thread", ThreadController.create);
router.patch("/thread/:id", ThreadController.update);
router.delete("/thread/:id", ThreadController.delete);

// RepliesController
router.get("/replies", RepliesController.find);
router.get("/reply/:id", RepliesController.findOne);
router.post("/reply", RepliesController.create);
router.patch("/reply/:id", RepliesController.update);
router.delete("/reply/:id", RepliesController.delete);

// LikesController
router.get("/likes", LikesController.find);
router.get("/like/:id", LikesController.findOne);
router.post("/like", LikesController.create);
router.delete("/like/:id", LikesController.delete);

// UsersController
router.get("/users", UsersController.find);
router.get("/user/:id", UsersController.findOne);
router.post("/user", UsersController.create);
router.patch("/user/:id", UsersController.update);
router.delete("/user/:id", UsersController.delete);

export default router;
