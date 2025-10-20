import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoList } from './entities/todo-list.entity';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { UpdateTodoListDto } from './dto/update-todo-list.dto';

@Injectable()
export class TodoListService {
  constructor(
    @InjectRepository(TodoList)
    private todoListRepository: Repository<TodoList>,
  ) {}

  async create(userId: string, createTodoListDto: CreateTodoListDto) {
    const todoList = this.todoListRepository.create({
      ...createTodoListDto,
      userId,
    });

    return await this.todoListRepository.save(todoList);
  }

  async findAll(userId: string, skip: number = 0, take: number = 10) {
    const [data, total] = await this.todoListRepository.findAndCount({
      where: { userId },
      relations: ['tasks'],
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    return { data, total, page: skip / take + 1, pageSize: take };
  }

  async findOne(id: string, userId: string) {
    const todoList = await this.todoListRepository.findOne({
      where: { id, userId },
      relations: ['tasks'],
    });

    if (!todoList) {
      throw new NotFoundException('To-do list not found');
    }

    return todoList;
  }

  async update(
    id: string,
    userId: string,
    updateTodoListDto: UpdateTodoListDto,
  ) {
    const todoList = await this.findOne(id, userId);

    Object.assign(todoList, updateTodoListDto);

    return await this.todoListRepository.save(todoList);
  }

  async remove(id: string, userId: string) {
    const todoList = await this.findOne(id, userId);

    await this.todoListRepository.remove(todoList);

    return { message: 'To-do list deleted successfully' };
  }
}