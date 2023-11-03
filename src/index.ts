import { AppDataSource } from "./data-source";
import * as express from "express";
import { Request, Response } from "express";
import router from "./route";
import * as cors from "cors";
import * as redis from "redis";
import "dotenv/config";

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    const port = 5000;
    const redisClient = redis.createClient();

    app.use(cors());
    app.use(express.json());
    app.use("/api/v1", router);

    app.listen(port, () => {
      // async function redisConnect() {
      //   try {
      //     await redisClient.connect();
      //     console.log("Connected to Redis");
      //   } catch (error) {
      //     console.log("Error connect to Redis");
      //   }
      // }
      // redisConnect();
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => console.log(error));
