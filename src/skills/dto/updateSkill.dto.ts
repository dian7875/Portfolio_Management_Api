import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateSkillDto {
  @ApiPropertyOptional({
    example: 'TypeScript',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 5,
  })
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  level?: number;

  @ApiPropertyOptional({
    example: 'Front-End',
  })
  @IsOptional()
  @IsString()
  category?: string;
}
