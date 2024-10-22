import { Controller, Post, Get, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ScoreService } from './score.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('scores')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  // Submit a score for a quiz (Only teachers can submit scores)
  @Post()
  @UseGuards(AuthGuard)
  submitScore(@Body() body, @Request() req) {
    const { quizId, score } = body;

    // Check if the user is a teacher
    if (req.user.role !== 'teacher') {
      return { message: 'Only teachers can submit scores' };
    }

    if (!quizId || score == null) {
      return { message: 'Quiz ID and score are required' };
    }

    return this.scoreService.submitScore(req.user.sub, quizId, score);
  }

  // Get the leaderboard for a specific quiz
  @Get()
  @UseGuards(AuthGuard)
  getLeaderboard(@Query('quizId') quizId: string) {
    if (!quizId) {
      return { message: 'Quiz ID is required' };
    }
    return this.scoreService.getLeaderboard(quizId);
  }
}
