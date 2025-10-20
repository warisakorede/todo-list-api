import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TodoList } from '../../todo-list/entities/todo-list.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => TodoList, (list) => list.user, { onDelete: 'CASCADE' })
  todoLists: TodoList[];
}