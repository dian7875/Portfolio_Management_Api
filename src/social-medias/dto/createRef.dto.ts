import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateSocialMediaDto {
  @ApiProperty({
    description: 'Social media name (e.g. GitHub, LinkedIn, Twitter)',
    example: 'GitHub',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Redirect URL to the social media profile',
    example: 'https://github.com/username',
  })
  @IsNotEmpty()
  @IsString()
  @IsUrl({}, { message: 'redirectLink must be a valid URL' })
  redirectLink: string;
}
