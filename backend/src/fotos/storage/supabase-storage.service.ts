import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseStorageService {
  private readonly client: SupabaseClient;
  private readonly bucket: string;

  constructor(private readonly config: ConfigService) {
    this.client = createClient(
      this.config.get<string>('SUPABASE_URL') || '',
      this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY') || '',
    );
    this.bucket = this.config.get<string>('SUPABASE_BUCKET') || 'fotos-checklist';
  }

  async upload(path: string, buffer: Buffer, contentType: string) {
    const { error } = await this.client.storage.from(this.bucket).upload(path, buffer, {
      contentType,
      upsert: false,
    });

    if (error) {
      throw new InternalServerErrorException('Erro ao enviar foto para o storage.');
    }

    const { data } = this.client.storage.from(this.bucket).getPublicUrl(path);
    return data.publicUrl;
  }
}
