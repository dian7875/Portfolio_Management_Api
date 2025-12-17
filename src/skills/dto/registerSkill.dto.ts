import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class RegisterSkillDto {
  @ApiProperty({
    example: 'TypeScript',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 4,
    description: 'Skill level from 1 to 5',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  level?: number;

  @ApiPropertyOptional({
    example: 'Backend',
  })
  @IsOptional()
  @IsString()
  category?: string;
}
