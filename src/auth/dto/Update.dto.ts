import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateDto {

  @ApiPropertyOptional({ description: "user password", example: "password1234" })
  @IsOptional()
  @IsString()
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
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  profileImage?: string; 

  @ApiProperty({ description: "user isActive status", example: true })
  isActive: boolean;
}
