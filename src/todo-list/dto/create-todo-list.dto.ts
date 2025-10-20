import { IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoListDto {
  @ApiProperty({ example: 'My Daily Tasks' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: 'Tasks for today', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
