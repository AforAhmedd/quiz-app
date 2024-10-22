import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private users: User[] = [];

  constructor(private readonly jwtService: JwtService) {}

  signup(user: User) {
    // Regular expression for validating CNIC format "12345-1234567-1"
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;

    // Validate CNIC format
    if (!cnicRegex.test(user.cnic)) {
      throw new BadRequestException('Invalid CNIC format. It should be in the format 12345-1234567-1.');
    }

    // Check if user with the same CNIC exists
    const userExists = this.users.find(u => u.cnic === user.cnic);
    if (userExists) {
      throw new BadRequestException('User with this CNIC already exists.');
    }

    // In real cases, we will use hash
    user.id = Math.random().toString(36).substr(2, 9); // Generate a random user ID
    this.users.push(user);
    return { message: 'User registered successfully' };
  }

  login(user: User) {
    // Find user by CNIC and password
    const foundUser = this.users.find(u => u.cnic === user.cnic && u.password === user.password);
    if (!foundUser) {
      return { message: 'Invalid credentials' };
    }
    const payload = { username: foundUser.username, sub: foundUser.id, role: foundUser.role }; // Use foundUser's role
    const token = this.jwtService.sign(payload);
    return {
      access_token: token,
    };
  }
}
