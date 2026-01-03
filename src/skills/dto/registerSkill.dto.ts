import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class RegisterSkillDto {
  @ApiProperty({
    example: 'TypeScript',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 4,
    description: 'Skill level from 1 to 10',
  })
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  level?: number;

  @ApiPropertyOptional({
    example: 'Backend',
  })
  @IsOptional()
  @IsString()
  category?: string;
}
