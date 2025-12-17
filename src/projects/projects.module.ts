import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports:[StorageModule]
})
export class ProjectsModule {}
