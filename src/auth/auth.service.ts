import { RegisterDto } from "./dto/register.dto";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "../entity/user.entity";
import * as bcrypt from "bcryptjs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class AuthService {
  refresh(refresh_Token: string) {
    throw new Error("Method not implemented.");
  }
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, username, role } = registerDto;
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


  async login(email: string, password: string): Promise<{ access_Token: string }> {
    if (!password) {
      throw new Error("Password must be provided");
    }
    if (!password) {
      throw new Error("Password must be provided");
    }
    if (!email || !password) {
      throw new Error("Email and password must be provided");
    }
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    const payload = { email: user.email, sub: user.id };
    const access_Token = this.jwtService.sign(payload);
    return { access_Token };
  }
}
