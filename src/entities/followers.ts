import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from "typeorm";
import { User } from "./user";
import { Following } from "./following";

@Entity({ name: "followers" })
export class Followers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.followersId, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  userId: User;

  @ManyToMany(() => Following, (following) => following.followersId, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "followingId" })
  followingId: Following[];

  @ManyToMany(() => Followers, (followers) => followers.followingId, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "followersId" })
  followersId: Followers[];
}
