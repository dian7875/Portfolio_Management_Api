import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from 'src/common/pagination.dto';

export class ProjectFiltersDto extends PaginationDto {
  @ApiPropertyOptional({ example: 'aa7d2c79-02b8-49cf-b193-8209c3819187' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value === 'true' || value === '1';
    }
    return undefined;
  })
  @IsBoolean()
  hidden?: boolean;

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
