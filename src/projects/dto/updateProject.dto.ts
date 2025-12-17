import {
  IsArray,
  IsDate,
  IsOptional,
  IsString,
  IsUrl,
  ArrayNotEmpty,
  IsNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProjectDto {
  @ApiProperty({
    example: 'Portfolio API',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: 'Backend project',
  })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional({
    example: 'API built with NestJS',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://github.com/user/repo',
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsUrl()
  repoUrl?: string;

  @ApiPropertyOptional({
    example: 'https://demo.vercel.app',
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsUrl()
  demoUrl?: string;

  @ApiProperty({
    example: 'NestJS,Prisma,Supabase',
    description: 'Comma separated values',
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
    description: 'Project date (ISO 8601 format)',
  })
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsNotEmpty()
  @IsDate()
  finishDate: Date;

  @ApiPropertyOptional({
    example: 'projects/userId/img1.png,projects/userId/img2.png',
    description: 'Paths of images to keep (comma separated)',
  })
  @Transform(({ value }) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return value.split(',').map((v) => v.trim());
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keepImagesPath?: string[];
}
