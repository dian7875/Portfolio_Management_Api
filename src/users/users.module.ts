import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports:[StorageModule]
})
export class UsersModule {}
