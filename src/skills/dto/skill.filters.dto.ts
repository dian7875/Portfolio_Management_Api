import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from 'src/common/pagination.dto';

export class SkillFiltersDto extends PaginationDto {
  @ApiPropertyOptional({
    example: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    return value === 'true' || value === '1';
  })
  @IsBoolean()
  hidden?: boolean;

  @ApiPropertyOptional({
    example: 'Backend',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'User id (public profile)',
  })
  @IsOptional()
  @IsString()
  userId?: string;
}
