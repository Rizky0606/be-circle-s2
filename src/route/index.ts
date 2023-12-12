import * as express from "express";
import ThreadController from "../controllers/ThreadController";
import RepliesController from "../controllers/RepliesController";
import LikesController from "../controllers/LikesController";
import UsersController from "../controllers/UsersController";
import AuthController from "../controllers/AuthController";
import AuthenticationMiddleware from "../middlewares/Auth";
import UploadFile from "../middlewares/UploadFile";
import FollowController from "../controllers/FollowController";

const router = express.Router();

// ThreadController
router.get(
  "/threads",
  AuthenticationMiddleware.Authentication,
  ThreadController.find
);
router.get(
  "/thread/:id",
  AuthenticationMiddleware.Authentication,
  ThreadController.findOne
);
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
router.delete(
  "/thread/:id",
  AuthenticationMiddleware.Authentication,
  ThreadController.delete
);

// RepliesController
router.get("/replies", RepliesController.find);
router.get("/reply/:id", RepliesController.findOne);
router.post(
  "/reply",
  AuthenticationMiddleware.Authentication,
  RepliesController.create
);
router.patch("/reply/:id", RepliesController.update);
router.delete("/reply/:id", RepliesController.delete);

// LikesController
router.post(
  "/thread/:threadId/like",
  AuthenticationMiddleware.Authentication,
  LikesController.create
);

// UsersController
router.get("/users", UsersController.find);
router.get(
  "/user/profile",
  AuthenticationMiddleware.Authentication,
  UsersController.findByJWT
);
router.get(
  "/user/:id",
  AuthenticationMiddleware.Authentication,
  UsersController.findOne
);
router.post(
  "/user",
  AuthenticationMiddleware.Authentication,
  UsersController.create
);
router.patch(
  "/user/:id",
  AuthenticationMiddleware.Authentication,
  UsersController.update
);
router.delete(
  "/user/:id",
  AuthenticationMiddleware.Authentication,
  UsersController.delete
);

// AuthController
router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);
router.get(
  "/auth/check",
  AuthenticationMiddleware.Authentication,
  AuthController.check
);

// FollowersController
router.post(
  "/follow/:userId",
  AuthenticationMiddleware.Authentication,
  FollowController.follow
);

export default router;
