import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private users: User[] = [];

  constructor(private readonly jwtService: JwtService) {}

  async signup(user: User) {
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;

    if (!cnicRegex.test(user.cnic)) {
      throw new BadRequestException('Invalid CNIC format. It should be in the format 12345-1234567-1.');
    }

    if (user.password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long.');
    }

    const validRoles = ['teacher', 'student'];
    if (!validRoles.includes(user.role.toLowerCase())) {
      throw new BadRequestException('Invalid role. Role must be either "teacher" or "student".');
    }

    const userExists = this.users.find(u => u.cnic === user.cnic);
    if (userExists) {
      throw new BadRequestException('User with this CNIC already exists.');
    }

    // Hash the password before saving it
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    user.id = Math.random().toString(36).substr(2, 9);
    this.users.push(user);

    return { message: 'User registered successfully' };
  }

  async login(user: User) {
    const foundUser = this.users.find(u => u.cnic === user.cnic);
    if (!foundUser) {
      throw new BadRequestException('Invalid credentials');
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(user.password, foundUser.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { username: foundUser.username, sub: foundUser.id, role: foundUser.role };
    const token = this.jwtService.sign(payload, { expiresIn: '1h' });

    return {
      access_token: token,
    };
  }
}
