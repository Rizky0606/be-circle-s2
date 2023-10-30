import * as amqp from "amqplib";
import { Repository } from "typeorm";
import { Threads } from "../entities/thread";
import { AppDataSource } from "../data-source";
import { EventEmitter } from "stream";
import cloudinary from "../libs/cloudinary";

export default new (class ThreadWorker {
  private readonly ThreadRepository: Repository<Threads> =
    AppDataSource.getRepository(Threads);
  private emitter = new EventEmitter();

  async create(queueName: string, connection: any) {
    try {
      const channel = await connection.createChannel();
      await channel.assertQueue(queueName);
      await channel.consume(queueName, async (message) => {
        try {
          if (message !== null) {
            const payload = JSON.parse(message.content.toString());

            const cloudinaryResponse = await cloudinary.destination(
              payload.image
            );

            const thread = this.ThreadRepository.create({
              content: payload.content,
              image: cloudinaryResponse,
              userId: {
                id: payload.userId,
              },
            });

            const threadResponse = await this.ThreadRepository.save(thread);

            this.emitter.emit("message");
            console.log("(Worker) : Thread is create");

            channel.ack(message);
          }
        } catch (err) {
          console.log("(Worker) : Thread is failed");
        }
      });
    } catch (err) {
      console.log("(Worker) : Error while consume queue from thread");
    }
  }
})();
