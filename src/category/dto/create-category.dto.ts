import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({
        description: "The name of the category",
        example: "Electronics",
    })
    @IsString()
    @IsNotEmpty()
    name: string;

   
    @ApiProperty({
        description: "The description of the category",
        example: "Devices and gadgets",
    })
    @IsString()
    @IsOptional()
    description: string;
    
}
