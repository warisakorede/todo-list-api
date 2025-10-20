import {
  IsString,
  IsDateString,
  IsOptional,
  IsEnum,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../entities/task.entity';

export class UpdateTaskDto {
  @ApiProperty({ example: 'Updated task description', required: false })
  @IsOptional()
  @IsString()
  @MinLength(3)
  description?: string;

  @ApiProperty({ example: '2024-01-20T10:30:00Z', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({
    enum: TaskStatus,
    example: TaskStatus.COMPLETED,
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}