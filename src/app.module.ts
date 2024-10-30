import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { QuizModule } from './quiz/quiz.module';
import { ScoreModule } from './score/score.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [ MongooseModule.forRoot('mongodb://localhost:27017/quiz-app'), AuthModule, QuizModule, ScoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
