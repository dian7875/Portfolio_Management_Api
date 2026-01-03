import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsDate,
} from 'class-validator';

export class CreateDegreeDto {
  @ApiProperty({
    example: 'Universidad Nacional de Costa Rica',
    description: 'Institution where the record was obtained',
  })
  @IsNotEmpty()
  @IsString()
  institution: string;

  @ApiProperty({
    example: 'Bachelor of Computer Science',
    description: 'Title or degree name',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: 'Focused on software engineering and backend development',
    description: 'Optional description or notes',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Indicates whether the record is finished or in progress',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value === 'true' || value === '1';
    }
    return Boolean(value);
  })
  @IsBoolean()
  finished?: boolean;

  @ApiPropertyOptional({
    example: '2021-01-15',
    description: 'Start date (ISO 8601 format)',
  })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsDate()
  startDate: Date;

  @ApiPropertyOptional({
    example: '2024-06-30',
    description:
      'End date (ISO 8601 format). Only applicable if finished is true',
    nullable: true,
  })
  @IsOptional()
  @Transform(({ obj, value }) => {
    if (obj.finished === false) return null;
    return value ? new Date(value) : undefined;
  })
  endDate?: Date | null;
}
