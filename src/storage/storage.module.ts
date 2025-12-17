import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { SupabaseProvider } from './storage.provider';

@Module({
  providers: [StorageService, SupabaseProvider],
  exports:[StorageService]
})
export class StorageModule {}
