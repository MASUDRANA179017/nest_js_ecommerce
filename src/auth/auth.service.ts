import { RegisterDto } from "./dto/register.dto";
import { Injectable, Req, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "../entity/user.entity";
import * as bcrypt from "bcryptjs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { UpdateDto } from "./dto/Update.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, username, profileImage, role } = registerDto;
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email: email,
      username: username,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      profileImage: profileImage, 
      role: role,
      refreshToken: uuidv4(),
    });
    await this.userRepository.save(user);
    const payload = {
      email: user.email,
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      role: user.role,
    };
    return {
      access_Token: this.jwtService.sign(payload),
      refresh_Token: this.jwtService.sign(payload, {
        expiresIn: "7d",
      }),
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        role: user.role,
      },
    };
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const payload = {
      email: user.email,
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      role: user.role,
    };
    return {
      access_Token: this.jwtService.sign(payload),
      refresh_Token: user.refreshToken,
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        role: user.role,
      },
    };
  }

  async refresh(refreshToken: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { refreshToken } });
    if (!user) {
      throw new UnauthorizedException("Invalid refresh token");
    }
    const payload = {
      email: user.email,
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      role: user.role,
    };
    return {
      access_Token: this.jwtService.sign(payload),
      refresh_Token: this.jwtService.sign(payload, {
        expiresIn: "7d",
      }),
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        role: user.role,
      },
    };
  }


  async getProfile(email: string) {

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }


  // edit profile
  async editProfile(updateDto: UpdateDto, userId: number): Promise<Partial<User>> {
    const { password, profileImage, firstName, lastName, username, isActive } = updateDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Only hash password if provided
    if (password && password.trim() !== "") {
      user.password = await bcrypt.hash(password, 10);
    }

    // Update other fields
    user.firstName = firstName;
    user.lastName = lastName;
    user.username = username;
    user.profileImage = profileImage,
    user.isActive = isActive;

    // Save the updated user
    await this.userRepository.save(user);

    return user;
  }


  //Update status user active or inactive
  async updateStatus(id: number, isActive: boolean) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.update(id, { isActive });
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    return updatedUser;
  }



  //all users 
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }
}