import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateStoreDto {
    @ApiProperty({
        description: "The name of the store",
        example: "My Updated Store",
        required: false
    })
    @IsString()
    @IsNotEmpty()
    name?: string;

    @ApiProperty({
        description: "A brief description of the store",
        example: "This store now sells even more awesome products.",
        required: false
    })
    @IsString()
    @IsNotEmpty()
    description?: string;
    @ApiProperty({
        description: "Store Image URL",
        example: "https://example.com/updated-store-image.jpg",
        required: false
    })
    @IsString()
    imageUrl?: string;

}

