import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum } from 'class-validator';

export enum TagType {
    PRODUCT = 'product',
    POST = 'post',
}

export class CreateTagDto {
    @ApiProperty({
        description: 'Name of the tag',
        example: 'Technology',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Slug for the tag',
        example: 'technology',
    })
    @IsString()
    slug: string;

    @ApiProperty({
        description: 'Type of the tag',
        example: 'post',
        enum: TagType,
    })
    @IsEnum(TagType)
    type: TagType;

    @ApiProperty({
        description: 'Description of the tag',
        example: 'A tag related to technology topics',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    created_by_id?: number;

    @IsNumber()
    @IsOptional()
    blogs_count?: number;

    @IsNumber()
    @IsOptional()
    products_count?: number;
}
