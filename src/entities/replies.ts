import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "./user";
import { Threads } from "./thread";
import { Likes } from "./likes";

@Entity({ name: "replies" })
export class Replies {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  content: string;

  @ManyToOne(() => User, (user) => user.replies, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  userId: User;

  @ManyToOne(() => Threads, (thread) => thread.replies, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "threadsId" })
  threadsId: Threads;

  @OneToMany(() => Likes, (like) => like.repliesId, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "likeId" })
  likeId: Likes[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
