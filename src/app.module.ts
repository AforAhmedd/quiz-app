import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { QuizModule } from './quiz/quiz.module';
import { ScoreModule } from './score/score.module';

@Module({
  imports: [AuthModule, QuizModule, ScoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
