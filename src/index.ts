import { AppDataSource } from "./data-source";
import * as express from "express";
import router from "./route";
import * as cors from "cors";
import "dotenv/config";
import { redisConnect } from "./libs/redisConfig";

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    const port = 5000;
    redisConnect();

    app.use(cors());
    app.use(express.json());
    app.use("/api/v1", router);

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => console.log(error));
