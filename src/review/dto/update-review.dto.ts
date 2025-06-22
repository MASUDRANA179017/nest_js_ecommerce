import { ApiProperty } from "@nestjs/swagger"
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, max, Min } from "class-validator";

export class UpdateReviewDto {
    @ApiProperty({
        description: "Rating (1 to 5)",
        example: 5,
    })
    @IsInt()
    @Min(1)
    @Max(5)
    @IsOptional()
    rating?: number;

    @ApiProperty({
        description: "Comment",
        example: "Great product!",
        required: false,
    })
    @IsString()
    @IsOptional()
    comment?: string;


}