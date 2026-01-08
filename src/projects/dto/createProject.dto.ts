import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  ArrayNotEmpty,
  IsDate,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    example: 'Portfolio API',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: 'Backend for personal portfolio',
  })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional({
    example: 'REST API built with NestJS and Prisma',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://github.com/user/project',
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsUrl()
  repoUrl?: string;

  @ApiPropertyOptional({
    example: 'https://portfolio-demo.vercel.app',
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsUrl()
  demoUrl?: string;

  @ApiProperty({
    example: ['NestJS', 'Prisma', 'PostgreSQL'],
    isArray: true,
  })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      return value.split(',').map((v) => v.trim());
    }
    return [];
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  techStack: string[];

  @ApiProperty({
    example: '2024-06-30',
    description:
      'End date (ISO 8601 format). Nullable if experience is ongoing',
    nullable: false,
  })
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsNotEmpty()
  @IsDate()
  finishDate: Date;

  @ApiPropertyOptional({})
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value === 'true' || value === '1';
    }
    return Boolean(value);
  })
  @IsBoolean()
  highlight?: boolean;
}
