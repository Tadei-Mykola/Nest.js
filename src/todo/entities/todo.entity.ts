import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  isDone: boolean;

  @Column({default: 0})
  userId: number;

  @Column({ type: 'timestamp', nullable: true })
  date: string
}
