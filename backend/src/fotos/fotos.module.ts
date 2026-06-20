import { Module } from '@nestjs/common';
import { FotosController } from './fotos.controller';
import { FotosService } from './fotos.service';
import { SupabaseStorageService } from './storage/supabase-storage.service';

@Module({
  controllers: [FotosController],
  providers: [FotosService, SupabaseStorageService],
})
export class FotosModule {}
