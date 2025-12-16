import { Module } from '@nestjs/common';
import { SocialMediasService } from './social-medias.service';
import { SocialMediasController } from './social-medias.controller';

@Module({
  controllers: [SocialMediasController],
  providers: [SocialMediasService]
})
export class SocialMediasModule {}
