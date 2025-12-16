import { Module } from '@nestjs/common';
import { EducationService } from './education.service';
import { EducationController } from './education.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [EducationController],
  providers: [EducationService],
  imports:[AuthModule]
})
export class EducationModule {}
