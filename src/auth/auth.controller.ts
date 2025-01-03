import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../auth/user.schema'; // Use the correct User schema



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() user: User) {
    return this.authService.signup(user);
  }

  @Post('login')
  login(@Body() user: User) {
    return this.authService.login(user);
  }
}
