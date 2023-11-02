import { Repository } from "typeorm";
import { Replies } from "../entities/replies";
import { AppDataSource } from "../data-source";
import { EventEmitter } from "stream";

export default new (class RepliesWorker {
  private readonly RepliesRepository: Repository<Replies> =
    AppDataSource.getRepository(Replies);
  private emitter = new EventEmitter();

  async create(queueName: string, connection: any) {
    try {
      const channel = await connection.createChannel();
      await channel.assertQueue(queueName);
      await channel.consume(queueName, async (message) => {
        try {
          if (message !== null) {
            const payload = JSON.parse(message.content.toString());

            const replies = this.RepliesRepository.create({
              content: payload.content,
              threadsId: payload.threadsId,
              userId: {
                id: payload.userId,
              },
            });

            const repliesResponse = await this.RepliesRepository.save(replies);

            this.emitter.emit("message");
            console.log("(Worker) : Replies is create", repliesResponse);

            channel.ack(message);
          }
        } catch (error) {
          console.log("(Worker) : Thread is failed");
        }
      });
    } catch (error) {
      console.log("(Worker) : Error while consume queue from thread");
    }
  }
})();
