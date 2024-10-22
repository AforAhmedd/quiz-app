import { Injectable, BadRequestException } from '@nestjs/common';
import { Quiz } from '../entities/quiz.entity';

@Injectable()
export class QuizService {
  private quizzes: Quiz[] = [];

  createQuiz(quiz: Quiz, teacherId: string) {
    quiz.id = Math.random().toString(36).substr(2, 9); // Generate a random quiz ID
    quiz.teacherId = teacherId; // Associate quiz with the teacher who created it
    this.quizzes.push(quiz);
    return { message: 'Quiz created successfully', QuizId: quiz.id, quiz };
  }

  // Check if a quiz can be taken (before the deadline)
  canTakeQuiz(quizId: string): boolean {
    const quiz = this.quizzes.find(quiz => quiz.id === quizId);
    if (!quiz) {
      throw new BadRequestException('Quiz not found');
    }

    const currentTime = new Date().getTime();
    const quizDeadline = new Date(quiz.deadline).getTime();

    return currentTime <= quizDeadline; // Ensure current time is before the deadline
  }

  getQuizzesByTeacher(teacherId: string) {
    return this.quizzes.filter(quiz => quiz.teacherId === teacherId);
  }

  getQuizById(quizId: string, teacherId: string) {
    return this.quizzes.find(quiz => quiz.id === quizId && quiz.teacherId === teacherId);
  }

  getQuizzesByTitle(title: string, teacherId: string) {
    return this.quizzes.filter(quiz => quiz.title.toLowerCase().includes(title.toLowerCase()) && quiz.teacherId === teacherId);
  }


  getQuizForScoreSubmission(quizId: string): Quiz {
    return this.quizzes.find(quiz => quiz.id === quizId);
  }
}
