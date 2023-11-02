// import { AppDataSource } from "../data-source";
// import cloudinary from "../libs/cloudinary";
// import * as amqp from "amqplib";
// import ThreadWorker from "./ThreadWorker";

// export default new (class WorkerHub {
//   constructor() {
//     AppDataSource.initialize()
//       .then(async () => {
//         cloudinary.upload();

//         const connection = await amqp.connect(process.env.RABBIT_MQ_CONNECTION);

//         // create worker
//         const response = await ThreadWorker.create(
//           process.env.THREADS_QUEUE,
//           connection
//         );
//       })
//       .catch((error) => console.log(error));
//   }
// })();

// // import * as amqp from "amqplib";
// // import "dotenv/config";
// // import { AppDataSource } from "../data-source";
// // import cloudinary from "../libs/cloudinary";
// // import ThreadWorker from "./ThreadWorker";

// // export default new (class WorkerHub {
// //   constructor() {
// //     AppDataSource.initialize()
// //       .then(async () => {
// //         cloudinary.upload();

// //         const connection = await amqp.connect(process.env.RABBIT_MQ);

// //         // create worker anymore
// //         const resp = await ThreadWorker.create(process.env.THREAD, connection);
// //         // console.log(resp);
// //       })
// //       .catch((err) => console.log(err));
// //   }
// // })();

import * as amqp from "amqplib";
import "dotenv/config";
import { AppDataSource } from "../data-source";
import cloudinary from "../libs/cloudinary";
import ThreadWorker from "./ThreadWorker";
import RepliesWorker from "./RepliesWorker";

export default new (class WorkerHub {
  constructor() {
    AppDataSource.initialize()
      .then(async () => {
        cloudinary.upload();

        const connection = await amqp.connect(process.env.RABBIT_MQ);

        // create worker anymore
        const responseThread = await ThreadWorker.create(
          process.env.THREAD,
          connection
        );
        const responseReplies = await RepliesWorker.create(
          process.env.REPLIES,
          connection
        );
        // console.log(resp);
      })
      .catch((err) => console.log(err));
  }
})();
