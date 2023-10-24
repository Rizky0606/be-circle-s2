import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Threads } from "./thread";

@Entity({ name: "user" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  fullname: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  profile_picture: string;

  @Column({ nullable: true })
  profile_description: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @OneToMany(() => Threads, (thread) => thread.userId, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  threads: Threads[];
}
