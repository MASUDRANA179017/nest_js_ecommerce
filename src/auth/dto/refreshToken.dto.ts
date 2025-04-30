import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class RefreshTokenDto {
@ApiProperty({ description: "refresh Token", example: "uuid-12345-67890" })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

