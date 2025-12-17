import { Module } from '@nestjs/common';
import { PrismaModule } from './prismaConfig/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EducationModule } from './education/education.module';
import { SocialMediasModule } from './social-medias/social-medias.module';
import { LanguagesModule } from './languages/languages.module';
import { ExperiencesModule } from './experiences/experiences.module';
import { SkillsModule } from './skills/skills.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    EducationModule,
    SocialMediasModule,
    LanguagesModule,
    ExperiencesModule,
    SkillsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
