import { Module } from '@nestjs/common';
import { CvgeneratorService } from './cvgenerator.service';
import { CvgeneratorController } from './cvgenerator.controller';

@Module({
  controllers: [CvgeneratorController],
  providers: [CvgeneratorService],
})
export class CvgeneratorModule {}
