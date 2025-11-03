import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadImageDto } from './dto/upload-image-dto';
import * as fs from 'fs';
import * as path from 'path';

type UploadFolder = 'profiles' | 'stores' | 'products' | 'default' ;

@ApiTags('image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload an image to a dynamic folder' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadImageDto })
  @ApiResponse({ status: 200, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, _file, cb) => {
          const allowedFolders: UploadFolder[] = ['profiles', 'stores', 'products', 'default'];

          // Normalize the folder name
          const folderQuery = req.query.folder?.toString().toLowerCase() as UploadFolder;

          // Validate and fallback
          const folderName = allowedFolders.includes(folderQuery)
            ? folderQuery
            : 'default';

          const uploadPath = path.join('uploads', folderName);

          // Create directory if missing
          if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

          cb(null, uploadPath);
        },
        filename: (_req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        const allowed = /jpeg|png|jpg|gif|webp/;
        const extValid = allowed.test(extname(file.originalname).toLowerCase());
        const mimeValid = allowed.test(file.mimetype);
        if (extValid && mimeValid) return cb(null, true);
        cb(new BadRequestException('Invalid file type.'), false);
      },
    }),
  )
  async uploadImage(
    @UploadedFile() file: File,
    @Query('folder') folder?: string, 
  ) {
    const allowedFolders: UploadFolder[] = ['profiles', 'stores', 'products', 'default'];
    const safeFolder: UploadFolder = allowedFolders.includes(folder as UploadFolder)
      ? (folder as UploadFolder)
      : 'default';

    return this.imageService.uploadImage(file, safeFolder);
  }
}
