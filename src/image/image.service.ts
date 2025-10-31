import { Injectable } from '@nestjs/common';
import { File } from 'multer';

@Injectable()
export class ImageService {
  async uploadImage(file: File, folder: 'profiles' | 'stores' = 'profiles'): Promise<{ url: string }> {
    const baseUrl = process.env.BASE_URL || 'http://localhost:8000';
    const fileName = file.filename || file.originalname;
    const url = `${baseUrl}/uploads/${folder}/${fileName}`;
    return { url };
  }
}
