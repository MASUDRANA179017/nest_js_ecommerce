import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { diskStorage, File } from 'multer';
import { extname } from 'path';
import { UploadImageDto } from './dto/upload-image-dto';

@ApiTags('image')
@Controller('image')
export class ImageController {
    constructor(private readonly imageService: ImageService) { }

    @Post('upload')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Upload an image' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Image file to upload',
        type: UploadImageDto,
    })
    @ApiResponse({
        status: 200,
        description: 'Image uploaded successfully',
        type: File,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (_req: Express.Request, file: File, cb: (error: Error | null, filename: string) => void) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const fileExtension = extname(file.originalname);
                cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
            },
        }),
        fileFilter: (_req: Express.Request, file: File, cb: (error: Error | null, acceptFile: boolean) => void) => {
            const allowedTypes = /jpeg|png|gif|jpg/;
            const fileExtension = extname(file.originalname).toLowerCase();
            const extIsValid = allowedTypes.test(fileExtension);
            const mimetypeIsValid = allowedTypes.test(file.mimetype);
            if (extIsValid && mimetypeIsValid) {
                return cb(null, true);
            }
            cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and JPG are allowed.'), false);
    
        },
    })
    )

    async uploadImage(@UploadedFile() file: File) {
        return this.imageService.uploadImage(file);
    }
    
   



}


