import { Module } from '@nestjs/common';
import { PrismaModule } from './prismaConfig/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EducationModule } from './education/education.module';
import { SocialMediasModule } from './social-medias/social-medias.module';
import { LanguagesModule } from './languages/languages.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    EducationModule,
    SocialMediasModule,
    LanguagesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
