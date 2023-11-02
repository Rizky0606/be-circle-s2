import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Threads } from "./thread";
import { Replies } from "./replies";
import { Likes } from "./likes";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  full_name: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ nullable: true })
  photo_profile: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;

  @OneToMany(() => Threads, (thread) => thread.userId, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  threads: Threads[];

  @OneToMany(() => Replies, (reply) => reply.userId, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  replies: Replies[];

  @OneToMany(() => Likes, (like) => like.userId, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  like: Likes[];

  @ManyToMany(() => User, (user) => user.users)
  @JoinTable({
    name: "following",
    joinColumn: {
      name: "following_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "follower_id",
      referencedColumnName: "id",
    },
  })
  users!: User[];
}
