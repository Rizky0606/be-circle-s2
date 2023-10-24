import { AppDataSource } from "./data-source";
import * as express from "express";
import { Request, Response } from "express";
import router from "./route";

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    const port = 5000;

    app.use(express.json());
    app.use("/api/v1", router);

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => console.log(error));
