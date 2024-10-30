// src/score/score.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule
import { ScoreController } from './score.controller';
import { ScoreService } from './score.service';
import { Score, ScoreSchema } from './score.schema'; // Import Score and ScoreSchema
import { AuthModule } from '../auth/auth.module';
import { QuizModule } from '../quiz/quiz.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Score.name, schema: ScoreSchema }]), // Register Score schema
    AuthModule,
    QuizModule,
  ],
  controllers: [ScoreController],
  providers: [ScoreService],
})
export class ScoreModule {}
