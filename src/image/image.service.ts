import { Injectable } from '@nestjs/common';
import { File } from 'multer';

@Injectable()
export class ImageService {
    async uploadImage(file: File): Promise<{ url: string }> {
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        const fileName = file.filename || file.originalname;
        const url = `${baseUrl}/uploads/${fileName}`;

        return { url };
    }
}
