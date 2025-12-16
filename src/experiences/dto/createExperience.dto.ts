import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateExperienceDto {
  @ApiProperty({
    example: 'Senior Backend Developer',
    description: 'Role or position held',
  })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({
    example: 'Google',
    description: 'Company name',
  })
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty({
    example: '2021-01-15',
    description: 'Start date (ISO 8601 format)',
  })
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsDate()
  startDate: Date;

  @ApiPropertyOptional({
    example: '2024-06-30',
    description:
      'End date (ISO 8601 format). Nullable if experience is ongoing',
    nullable: true,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsDate()
  endDate?: Date | null;

  @ApiPropertyOptional({
    example: 'Worked on scalable microservices architecture',
    description: 'Optional experience description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: ['API design', 'Database optimization', 'Code reviews'],
    description: 'List of responsibilities',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  responsibilities: string[];

  @ApiPropertyOptional({
    example: false,
    description: 'Whether the experience is hidden',
    default: false,
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
  hidden?: boolean;
}
