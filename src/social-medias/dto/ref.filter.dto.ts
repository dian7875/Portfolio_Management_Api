import { IsOptional, IsBoolean, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/pagination.dto';

export class SocialMediaFiltersDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'User ID (UUID). Injected from access token',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Filter social media references by visibility',
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
}

export class GetOneSocialMediaFilter {
  @ApiPropertyOptional({})
  @IsOptional()
  @IsString()
  name?: string;
  
  @ApiPropertyOptional({
    description: 'User ID (UUID). Injected from access token',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsString()
  userId?: string;
}
