import { IsString, IsDateString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Complete project documentation' })
  @IsString()
  @MinLength(3)
  description: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  @IsDateString()
  dueDate: string;
}