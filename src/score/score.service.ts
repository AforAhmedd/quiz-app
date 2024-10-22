import { Injectable, NotFoundException } from '@nestjs/common';
import { QuizService } from '../quiz/quiz.service';

@Injectable()
export class ScoreService {
  private scores = [];

  constructor(private readonly quizService: QuizService) {}

  submitScore(teacherId: string, quizId: string, score: number) {
    // Check if the quiz exists
    const quiz = this.quizService.getQuizById(quizId, teacherId); // Ensure the quiz belongs to the teacher
    if (!quiz) {
      throw new NotFoundException('Quiz not found'); // If quiz doesn't exist, throw an error
    }
  
    // Check if there is already a score submitted for the same quizId and teacherId
    const existingScore = this.scores.find(s => s.quizId === quizId && s.teacherId === teacherId);
  
    if (existingScore) {
      // If score exists, update it
      existingScore.score = score;
      return { message: 'Score updated successfully' };
    }
  
    // If no existing score, add a new entry to the scores array
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
