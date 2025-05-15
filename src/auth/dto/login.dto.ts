import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
    @ApiProperty({ description: "user email", example: "user@gmail.com" })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: "user password", example: "password1234" })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}