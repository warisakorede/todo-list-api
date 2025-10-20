import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TodoListModule } from '../todo-list/todo-list.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), TodoListModule],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}