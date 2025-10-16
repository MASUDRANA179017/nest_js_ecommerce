import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateBlogDto {
    @ApiProperty({
        description: 'Title of the blog',
        example: 'Understanding NestJS',
    })
    @IsString()
    title: string;

    @ApiProperty({
        description: 'Slug for the blog',
        example: 'understanding-nestjs',
    })
    @IsString()
    slug: string;

    @ApiProperty({
        description: 'Content of the blog',
        example: 'This is a blog post about understanding NestJS.',
    })
    @IsString()
    content: string;

    @ApiProperty({
        description: 'Image URL for the blog',
        example: 'https://example.com/image.jpg',
        required: false,
    })
    @IsString()
    image?: string;

    @ApiProperty({
        description: 'Tag ID associated with the blog',
        example: 1,
        required: false,
    })
    @IsOptional()
    @IsNumber({}, { each: true })
    tags?: number[];
}
