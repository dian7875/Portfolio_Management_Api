import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateExperienceDto {
  @ApiPropertyOptional({
    example: 'Senior Backend Developer',
    description: 'Role or position held',
  })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({
    example: 'Google',
    description: 'Company name',
  })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({
    example: '2021-01-15',
    description: 'Start date (ISO 8601 format)',
  })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({
    example: '2024-06-30',
    description: 'End date (ISO 8601 format)',
    nullable: true,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  @IsDate()
  endDate?: Date | null;

  @ApiPropertyOptional({
    example: 'Worked on scalable microservices',
    description: 'Optional description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: ['API design', 'Code reviews'],
    description: 'List of responsibilities',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  responsibilities?: string[];
}
