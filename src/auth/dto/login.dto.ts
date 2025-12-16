import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'john.doe@email.com',
    description: 'Email or phone number',
  })
  @IsNotEmpty()
  @IsString()
  identifier: string;

  @ApiProperty({
    example: 'StrongP4ssword',
    description: 'User password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
