import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService], // Export QuizService so it can be used in other modules
})
export class QuizModule {}
