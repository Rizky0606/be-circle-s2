import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user";

@Entity({ name: "threads" })
export class Threads {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true })
  Image: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.threads, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  userId: User;
}
