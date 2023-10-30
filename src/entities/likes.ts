import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Threads } from "./thread";
import { User } from "./user";
import { Replies } from "./replies";

@Entity({ name: "likes" })
export class Likes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;

  @ManyToOne(() => Threads, (thread) => thread.likes, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "threadsId" })
  threadsId: Threads;

  @ManyToOne(() => User, (user) => user.like, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  userId: User;

  @ManyToOne(() => Replies, (reply) => reply.likeId, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "repliesId" })
  repliesId: Replies;
}
