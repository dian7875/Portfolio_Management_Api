import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from 'src/common/pagination.dto';

export class ExperienceFiltersDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by hidden status',
    example: false,
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

  @ApiPropertyOptional({
    description: 'User ID (UUID). Injected from access token',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsString()
  userId?: string;
}
