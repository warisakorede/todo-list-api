import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TodoListService } from '../todo-list/todo-list.service';

export enum TaskPriority {
  GREEN = 'green',
  AMBER = 'amber',
  RED = 'red',
}

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private todoListService: TodoListService,
  ) {}

  private getTaskPriority(dueDate: Date): TaskPriority {
    const now = new Date();
    const diffMs = dueDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 3) {
      return TaskPriority.RED;
    } else if (diffHours < 24) {
      return TaskPriority.AMBER;
    }

    return TaskPriority.GREEN;
  }

  async create(
    todoListId: string,
    userId: string,
    createTaskDto: CreateTaskDto,
  ) {
    await this.todoListService.findOne(todoListId, userId);

    const task = this.taskRepository.create({
      ...createTaskDto,
      dueDate: new Date(createTaskDto.dueDate),
      todoListId,
    });

    const savedTask = await this.taskRepository.save(task);

    return {
      ...savedTask,
      priority: this.getTaskPriority(savedTask[0].dueDate),
    };
  }

  async findAll(
    todoListId: string,
    userId: string,
    skip: number = 0,
    take: number = 10,
    status?: TaskStatus,
  ) {
    await this.todoListService.findOne(todoListId, userId);

    const whereClause: any = { todoListId, isDeleted: false };

    if (status) {
      whereClause.status = status;
    }

    const [tasks, total] = await this.taskRepository.findAndCount({
      where: whereClause,
      skip,
      take,
      order: { dueDate: 'ASC' },
    });

    const tasksWithPriority = tasks.map((task) => ({
      ...task,
      priority: this.getTaskPriority(task.dueDate),
    }));

    return {
      data: tasksWithPriority,
      total,
      page: skip / take + 1,
      pageSize: take,
    };
  }

  async findOne(taskId: string, todoListId: string, userId: string) {
    await this.todoListService.findOne(todoListId, userId);

    const task = await this.taskRepository.findOne({
      where: { id: taskId, todoListId, isDeleted: false },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return {
      ...task,
      priority: this.getTaskPriority(task.dueDate),
    };
  }

  async update(
    taskId: string,
    todoListId: string,
    userId: string,
    updateTaskDto: UpdateTaskDto,
  ) {
    const task = await this.findOne(taskId, todoListId, userId);

    Object.assign(task, {
      ...updateTaskDto,
      dueDate: updateTaskDto.dueDate
        ? new Date(updateTaskDto.dueDate)
        : task.dueDate,
    });

    if (
      updateTaskDto.status === TaskStatus.COMPLETED &&
      task.status !== TaskStatus.COMPLETED
    ) {
      task.completedAt = new Date();
    }

    const updatedTask = await this.taskRepository.save(task);

    return {
      ...updatedTask,
      priority: this.getTaskPriority(updatedTask.dueDate),
    };
  }

  async remove(taskId: string, todoListId: string, userId: string) {
    const task = await this.findOne(taskId, todoListId, userId);

    task.isDeleted = true;

    await this.taskRepository.save(task);

    return { message: 'Task deleted successfully' };
  }
}