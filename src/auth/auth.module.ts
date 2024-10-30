import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
@Module({
  imports: [
    JwtModule.register({
      secret: 'qwertyuiop',
      signOptions: { expiresIn: '1h' },
      
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [JwtModule],
})
export class AuthModule {}
