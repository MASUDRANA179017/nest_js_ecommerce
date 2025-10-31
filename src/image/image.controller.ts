import { Controller, Post, UploadedFile, UseGuards, UseInterceptors, Body, BadRequestException, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadImageDto } from './dto/upload-image-dto';


@ApiTags('image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload an image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadImageDto })
  @ApiResponse({ status: 200, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          // Choose folder dynamically: ?folder=profiles or ?folder=stores
          const folder = req.query.folder === 'stores' ? 'uploads/stores' : 'uploads/profiles';
          cb(null, folder);
        },
        filename: (_req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExtension = extname(file.originalname);
          cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
        },
      }),
      fileFilter: (_req, file, cb) => {
        const allowedTypes = /jpeg|png|gif|jpg/;
        const extIsValid = allowedTypes.test(extname(file.originalname).toLowerCase());
        const mimeIsValid = allowedTypes.test(file.mimetype);
        if (extIsValid && mimeIsValid) return cb(null, true);
        cb(new BadRequestException('Invalid file type. Only JPEG, PNG, GIF, and JPG are allowed.'), false);
      },
    }),
  )
  async uploadImage(
    @UploadedFile() file: File,
    @Query('folder') folder: 'profiles' | 'stores' = 'profiles',
  ) {
    return this.imageService.uploadImage(file, folder);
  }
}
