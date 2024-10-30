import { Controller, Post, Get, Param, Query, Body, UseGuards, Request, BadRequestException, ForbiddenException } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { Quiz, QuizDocument } from './quiz.schema'; // Import from the MongoDB schema file
import { AuthGuard } from '../auth/auth.guard';
import { UserRole } from '../auth/user-role.enum';

@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createQuiz(@Body() quiz: Quiz, @Request() req) {
    if (req.user.role !== UserRole.Teacher) {
      return { message: 'Only teachers can create quizzes' };
    }
    if (!quiz.deadline || !quiz.timeLimit) {
      throw new BadRequestException('Deadline and time limit are required');
    }
    return await this.quizService.createQuiz(quiz, req.user.sub); // Pass teacher's ID
  }

  @Get()
  @UseGuards(AuthGuard)
  async getQuizzes(@Request() req, @Query('id') quizId?: string, @Query('title') title?: string) {
    if (req.user.role !== UserRole.Teacher) {
      return { message: 'Only teachers can retrieve quizzes' };
    }

    if (quizId) {
      const quiz = await this.quizService.getQuizById(quizId, req.user.sub);
      return quiz ? quiz : { message: 'Quiz not found or you are not authorized to access it' };
    }

    if (title) {
      const quizzes = await this.quizService.getQuizzesByTitle(title, req.user.sub);
      return quizzes.length > 0 ? quizzes : { message: 'No quizzes found with the given title' };
    }

    return await this.quizService.getQuizzesByTeacher(req.user.sub);
  }

  @Get('take/:id')
  @UseGuards(AuthGuard)
  async takeQuiz(@Param('id') quizId: string, @Request() req) {
    if (req.user.role === UserRole.Teacher) {
      throw new ForbiddenException('Only students can take quizzes');
    }

    const canTakeQuiz = await this.quizService.canTakeQuiz(quizId);
    if (!canTakeQuiz) {
      return { message: 'The quiz deadline has passed. You cannot take this quiz.' };
    }
    return { message: 'You can take the quiz now' };
  }
}
