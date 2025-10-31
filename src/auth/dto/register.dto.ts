import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({ description: "User's email address", example: "user@gmail.com"})
  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  @ApiProperty({ description: "user password", example: "password1234"})
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
  
  @ApiProperty({ description: "user firstName", example: "Masud" })
  @IsString()
  @IsNotEmpty()
  firstName: string;
  
  @ApiProperty({ description: "user lastName", example: "Rana" })
  @IsString()
  @IsNotEmpty()
  lastName: string;
  
  @ApiProperty({ description: "user username", example: "masudrana" })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({description: "Profile Image", example:"http://localhost:8000/uploads/file-1761868815552-365027602.jpg"})
  @IsString()
  @IsNotEmpty()
  profileImage: string;

  @ApiProperty({ description: "user role", example: "user" })
  @IsString()
  @IsNotEmpty()
  role: string;
}
