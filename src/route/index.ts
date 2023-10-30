import * as express from "express";
import ThreadController from "../controllers/ThreadController";
import RepliesController from "../controllers/RepliesController";
import LikesController from "../controllers/LikesController";
import UsersController from "../controllers/UsersController";
import AuthController from "../controllers/AuthController";
import AuthenticationMiddleware from "../middlewares/Auth";
import UploadFile from "../middlewares/UploadFile";
import FollowersController from "../controllers/FollowersController";
import ThreadQueue from "../queue/ThreadQueue";

const router = express.Router();

// ThreadController
router.get("/threads", ThreadController.find);
router.get("/thread/:id", ThreadController.findOne);
router.post(
  "/thread",
  AuthenticationMiddleware.Authentication,
  UploadFile.Upload("image"),
  ThreadController.create
);
// router.post(
//   "/thread",
//   AuthenticationMiddleware.Authentication,
//   UploadFile.Upload("image"),
//   ThreadQueue.create
// );
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

// AuthController
router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);
router.get(
  "/auth/check",
  AuthenticationMiddleware.Authentication,
  AuthController.check
);

// FollowersController
router.get("/followers", FollowersController.find);
router.get("/follower/:id", FollowersController.findOne);
router.post("/follower", FollowersController.create);
router.delete("/follower/:id", FollowersController.delete);

export default router;
