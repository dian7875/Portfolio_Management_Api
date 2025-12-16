import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLanguageDto {
  @ApiProperty({
    description: 'Language name',
    example: 'English',
  })
  @IsString()
  @IsNotEmpty()
  language: string;

  @ApiProperty({
    description: 'Language proficiency level',
    example: 'B2',
  })
  @IsString()
  @IsNotEmpty()
  level: string;
}
