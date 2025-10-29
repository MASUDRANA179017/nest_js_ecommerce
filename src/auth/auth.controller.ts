import { Body, Controller, Get, Post, Req, UseGuards, UnauthorizedException, Param, Request, Delete, Put } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refreshToken.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../jwt-auth.guard";
import { User } from "src/entity/user.entity";
import { UpdateDto } from "./dto/Update.dto";
import { StatusDto } from "./dto/Status.dto";



@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) { }
  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({
    status: 201,
    description: "User registered successfully",
    type: RegisterDto,
  })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 409, description: "Conflict" })
  @ApiResponse({ status: 500, description: "Internal Server Error" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post("login")
  @ApiOperation({ summary: "Login a user" })
  @ApiResponse({
    status: 200,
    description: "User logged in successfully",
    type: LoginDto,
  })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 500, description: "Internal Server Error" })
  async login(@Body() loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;
    return this.authService.login(email, password);
  }

  @Post("refresh")
  @ApiOperation({ summary: "Refresh access token" })
  @ApiResponse({
    status: 200,
    description: "Access token refreshed successfully",
    type: RefreshTokenDto,
  })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<any> {
    return this.authService.refresh(refreshTokenDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post("edit-profile")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Edit user profile" })
  @ApiResponse({
    status: 200,
    description: "User profile updated successfully",
  })
  async editProfile(@Req() req: any, @Body() updateDto: UpdateDto): Promise<Partial<User>> {

    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.authService.editProfile(updateDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user profile" })
  @ApiResponse({
    status: 200,
    description: "User profile retrieved successfully",
  })
  @ApiResponse({ status: 401, description: "Forbidden" })
  async getProfile(@Req() req: any) {
    const email = req.user.email;
    return this.authService.getProfile(email);
  }


  @UseGuards(JwtAuthGuard)
  @Get("all-users")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({
    status: 200,
    description: "All users retrieved successfully",
  })
  async getAllUsers() {
    const users = await this.authService.getAllUsers();
    if (!users || users.length === 0) {
      throw new UnauthorizedException('No users found');
    }
    return users;
  }


  @UseGuards(JwtAuthGuard)
  @Put("activate/:id")
  @ApiBearerAuth()
  @ApiOperation({ summary: " status update user" })
  @ApiResponse({
    status: 200,
    description: "User status updated successfully",
  })
  async statusUser(@Param("id") @Req() req: any, @Body() statusDto: StatusDto) {

    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.authService.updateStatus(req.user.id, statusDto.isActive);
  }
}


