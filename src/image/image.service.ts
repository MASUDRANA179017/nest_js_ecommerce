import { Injectable } from '@nestjs/common';
import { File } from 'multer';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class ImageService {
  async uploadImage(file: File, folder: 'profiles' | 'stores' | 'products' | 'default' = 'profiles'): Promise<{ url: string }> {
    const baseUrl = process.env.BASE_URL || 'http://localhost:8000';
    const fileName = file.filename || file.originalname;
    const url = `${baseUrl}/uploads/${folder}/${fileName}`;
    return { url };
  }

  async deleteImage(
    fileUrl: string,
    folder: 'profiles' | 'stores' | 'products' | 'default' = 'profiles',
  ) {
    if (!fileUrl) return;

    try {
      // Extract the filename from the URL
      const fileName = fileUrl.split('/').pop();
      if (!fileName) return;

      const filePath = join(process.cwd(), 'uploads', folder, fileName);
      await unlink(filePath);
      console.log(`Deleted image: ${filePath}`);
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  }
}
