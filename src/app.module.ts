import { Module } from '@nestjs/common';
import { PrismaModule } from './prismaConfig/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EducationModule } from './education/education.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    EducationModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
