import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoList } from './entities/todo-list.entity';
import { TodoListService } from './todo-list.service';
import { TodoListController } from './todo-list.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TodoList])],
  providers: [TodoListService],
  controllers: [TodoListController],
  exports: [TodoListService],
})
export class TodoListModule {}