import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './entities/task.entity';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('todo-lists/:todoListId/tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  create(
    @Param('todoListId') todoListId: string,
    @Request() req: any,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.taskService.create(todoListId, req.user.userId, createTaskDto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['pending', 'completed'],
  })
  findAll(
    @Param('todoListId') todoListId: string,
    @Request() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: TaskStatus,
  ) {
    const skip = (page - 1) * limit;
    return this.taskService.findAll(
      todoListId,
      req.user.userId,
      skip,
      limit,
      status,
    );
  }

  @Get(':taskId')
  findOne(
    @Param('todoListId') todoListId: string,
    @Param('taskId') taskId: string,
    @Request() req: any,
  ) {
    return this.taskService.findOne(taskId, todoListId, req.user.userId);
  }

  @Patch(':taskId')
  update(
    @Param('todoListId') todoListId: string,
    @Param('taskId') taskId: string,
    @Request() req: any,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(
      taskId,
      todoListId,
      req.user.userId,
      updateTaskDto,
    );
  }

  @Delete(':taskId')
  remove(
    @Param('todoListId') todoListId: string,
    @Param('taskId') taskId: string,
    @Request() req: any,
  ) {
    return this.taskService.remove(taskId, todoListId, req.user.userId);
  }
}