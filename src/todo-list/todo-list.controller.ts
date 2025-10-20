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
import { TodoListService } from './todo-list.service';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { UpdateTodoListDto } from './dto/update-todo-list.dto';

@ApiTags('To-Do Lists')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('todo-lists')
export class TodoListController {
  constructor(private todoListService: TodoListService) {}

  @Post()
  create(@Request() req: any, @Body() createTodoListDto: CreateTodoListDto) {
    return this.todoListService.create(req.user.userId, createTodoListDto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  findAll(
    @Request() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    return this.todoListService.findAll(req.user.userId, skip, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.todoListService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updateTodoListDto: UpdateTodoListDto,
  ) {
    return this.todoListService.update(id, req.user.userId, updateTodoListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.todoListService.remove(id, req.user.userId);
  }
}