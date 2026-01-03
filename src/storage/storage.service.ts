import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import path from 'path';
import { envs } from 'src/config/envs.conf';

@Injectable()
export class StorageService {
  private readonly bucket: string;

  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {
    this.bucket = envs.supabase_bucket;
  }

  async uploadFile(
    userId: string,
    file: Express.Multer.File,
    folder: string,
  ): Promise<{
    originalName: string;
    path: string;
    publicUrl: string;
  }> {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);

    const safeName = baseName
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_-]/g, '');

    const finalName = `${safeName}${ext}`;
    const storagePath = `${folder}/${finalName}`;

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    const { data } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(storagePath);

    return {
      originalName: file.originalname,
      path: storagePath,
      publicUrl: data.publicUrl,
    };
  }

  async deleteFile(path: string) {
    const { error } = await this.supabase.storage
      .from(this.bucket)
      .remove([path]);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  getPublicUrl(path: string) {
    return this.supabase.storage.from(this.bucket).getPublicUrl(path).data
      .publicUrl;
  }
}
