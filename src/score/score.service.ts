import { Injectable, NotFoundException } from '@nestjs/common';
import { QuizService } from '../quiz/quiz.service';

@Injectable()
export class ScoreService {
  private scores = [];

  constructor(private readonly quizService: QuizService) {}

  submitScore(teacherId: string, quizId: string, score: number) {
    // Check if the quiz exists
    const quiz = this.quizService.getQuizById(quizId, teacherId); // Make sure to pass the required arguments
    if (!quiz) {
      throw new NotFoundException('Quiz not found'); // If quiz doesn't exist, throw an error
    }

    // Proceed to submit score if quiz exists
    this.scores.push({ teacherId, quizId, score });
    return { message: 'Score submitted successfully' };
  }

  // Retrieve leaderboard for a specific quiz
  getLeaderboard(quizId: string) {
    const leaderboard = this.scores.filter(score => score.quizId === quizId);
    if (leaderboard.length === 0) {
      return { message: 'No scores found for this quiz' };
    }
    return leaderboard.sort((a, b) => b.score - a.score); // Sort by highest score
  }
}
