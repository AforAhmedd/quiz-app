import { Controller, Post, Get, Param, Query, Body, UseGuards, Request, BadRequestException, ForbiddenException } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { Quiz } from '../entities/quiz.entity';
import { AuthGuard } from '../auth/auth.guard';

@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @UseGuards(AuthGuard)
  createQuiz(@Body() quiz: Quiz, @Request() req) {
    if (req.user.role !== 'teacher') {
      return { message: 'Only teachers can create quizzes' };
    }
    // Ensure the teacher provides the deadline and time limit
    if (!quiz.deadline || !quiz.timeLimit) {
      throw new BadRequestException('Deadline and time limit are required');
    }
    return this.quizService.createQuiz(quiz, req.user.sub); // Pass teacher's ID
  }

  // Get all quizzes created by the teacher
  @Get()
  @UseGuards(AuthGuard)
  getQuizzes(@Request() req, @Query('id') quizId?: string, @Query('title') title?: string) {
    if (req.user.role !== 'teacher') {
      return { message: 'Only teachers can retrieve quizzes' };
    }

    if (quizId) {
      const quiz = this.quizService.getQuizById(quizId, req.user.sub); // Fetch quiz by ID
      return quiz ? quiz : { message: 'Quiz not found or you are not authorized to access it' };
    }

    if (title) {
      const quizzes = this.quizService.getQuizzesByTitle(title, req.user.sub); // Fetch quizzes by title
      return quizzes.length > 0 ? quizzes : { message: 'No quizzes found with the given title' };
    }

    return this.quizService.getQuizzesByTeacher(req.user.sub); // Return all quizzes created by the teacher
  }

  // API to take a quiz (check if it's before the deadline)
  @Get('take/:id')
  @UseGuards(AuthGuard)
  takeQuiz(@Param('id') quizId: string, @Request() req) {
    // Restrict teachers from taking the quiz
    if (req.user.role !== 'student') {
      throw new ForbiddenException('Only students can take quizzes');
    }

    const canTakeQuiz = this.quizService.canTakeQuiz(quizId);
    if (!canTakeQuiz) {
      return { message: 'The quiz deadline has passed. You cannot take this quiz.' };
    }
    return { message: 'You can take the quiz now' };
  }
}
