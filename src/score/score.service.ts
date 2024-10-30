// src/score/score.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Score, ScoreDocument } from './score.schema'; // Ensure this is correct
import { QuizService } from '../quiz/quiz.service';

@Injectable()
export class ScoreService {
  constructor(
    @InjectModel(Score.name) private readonly scoreModel: Model<ScoreDocument>, // Inject ScoreModel
    private readonly quizService: QuizService,
  ) {}

  async submitScore(userId: string, quizId: string, score: number) {
    if (typeof score !== 'number' || isNaN(score) || score < 0) {
      throw new BadRequestException('Score must be a valid number and greater than or equal to 0.');
    }

    const quiz = await this.quizService.getQuizById(quizId, userId);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const existingScore = await this.scoreModel.findOne({ userId, quizId });
    if (existingScore) {
      existingScore.score = score;
      await existingScore.save();
      return { message: 'Score updated successfully' };
    }

    const newScore = new this.scoreModel({ userId, quizId, score });
    await newScore.save();
    return { message: 'Score submitted successfully' };
  }

  async getLeaderboard(quizId: string) {
    const leaderboard = await this.scoreModel.find({ quizId }).sort({ score: -1 });
    return leaderboard.length > 0 ? leaderboard : { message: 'No scores found for this quiz' };
  }
}
