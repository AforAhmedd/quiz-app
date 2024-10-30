import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './user.schema'; // Mongoose User schema
import { UserRole } from './user-role.enum';

@Injectable()
export class AuthService {
  // Remove the in-memory users array
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>, // Inject User model
  ) {}

  // Sign up logic
  async signup(user: User) {
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;

    if (!cnicRegex.test(user.cnic)) {
      throw new BadRequestException('Invalid CNIC format. It should be in the format 12345-1234567-1.');
    }

    if (user.password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long.');
    }

    const validRoles = Object.values(UserRole);
    if (!validRoles.includes(user.role as UserRole)) {
      throw new BadRequestException('Invalid role. Role must be either "teacher" or "student".');
    }

    // Check if user already exists in MongoDB
    const userExists = await this.userModel.findOne({ cnic: user.cnic }).exec();
    if (userExists) {
      throw new BadRequestException('User with this CNIC already exists.');
    }

    // Hash the password before saving it
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // Save the new user in MongoDB
    const newUser = new this.userModel(user);
    await newUser.save();

    return { message: 'User registered successfully' };
  }

  // Login logic
  async login(user: User) {
    // Find the user by CNIC in MongoDB
    const foundUser = await this.userModel.findOne({ cnic: user.cnic }).exec();
    if (!foundUser) {
      throw new BadRequestException('Invalid credentials');
    }

    // Compare the provided password with the hashed password in MongoDB
    const isPasswordValid = await bcrypt.compare(user.password, foundUser.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    // Create JWT payload
    const payload = { username: foundUser.username, sub: foundUser.id, role: foundUser.role };
    const token = this.jwtService.sign(payload, { expiresIn: '1h' });

    return {
      access_token: token,
    };
  }
}
