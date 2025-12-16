import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateLanguageDto {
  @ApiPropertyOptional({
    description: 'Language name',
    example: 'Spanish',
  })
  @IsOptional()
  language?: string;

  @ApiPropertyOptional({
    description: 'Language proficiency level',
    example: 'C1',
  })
  @IsOptional()
  level?: string;
}
