import { ApiProperty } from "@nestjs/swagger";

export class StatusDto {

  @ApiProperty({ description: "user isActive status", example: true })
  isActive: boolean;
  

}
