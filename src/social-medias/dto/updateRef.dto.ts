import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsUrl } from "class-validator";

export class UpdateSocialMediaDto {
  @ApiPropertyOptional({
    description: 'Social media name',
    example: 'LinkedIn',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Redirect URL to the social media profile',
    example: 'https://linkedin.com/in/username',
  })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'redirectLink must be a valid URL' })
  redirectLink?: string;
}
