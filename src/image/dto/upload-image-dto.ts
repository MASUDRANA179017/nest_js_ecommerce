import { ApiProperty } from "@nestjs/swagger";

export class UploadImageDto {
    @ApiProperty({
        description: 'The image file to upload',
        type: 'string',
        format: 'binary',
        required: true,
    })
    file: File;
}