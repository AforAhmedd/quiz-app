import { Module } from '@nestjs/common';
import { ScoreController } from './score.controller';
import { ScoreService } from './score.service';
import { AuthModule } from '../auth/auth.module';
import { QuizModule } from '../quiz/quiz.module'; // Import QuizModule

@Module({
  imports: [AuthModule, QuizModule], // Add QuizModule here
  controllers: [ScoreController],
  providers: [ScoreService],
})
export class ScoreModule {}
