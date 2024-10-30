import { Injectable, BadRequestException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz, QuizDocument } from './quiz.schema';

@Injectable()
export class QuizService {
  constructor(@InjectModel(Quiz.name) private quizModel: Model<QuizDocument>) {}

  async createQuiz(quiz: Quiz, teacherId: string): Promise<any> {
    // Validate the deadline
    const quizDeadline = new Date(quiz.deadline).getTime();
    const currentTime = new Date().getTime();

    if (isNaN(quizDeadline) || quizDeadline <= currentTime) {
      throw new BadRequestException('Invalid deadline. Deadline must be a future date.');
    }

    // Validate the time limit
    if (!quiz.timeLimit || typeof quiz.timeLimit !== 'number' || quiz.timeLimit <= 0) {
      throw new BadRequestException('Invalid time limit. Time limit must be a positive number.');
    }

    quiz.teacherId = teacherId;
    const newQuiz = new this.quizModel(quiz);
    await newQuiz.save();

    return { message: 'Quiz created successfully', QuizId: newQuiz.id, quiz: newQuiz };
  }

  async canTakeQuiz(quizId: string): Promise<boolean> {
    const quiz = await this.quizModel.findById(quizId).exec();
    if (!quiz) {
      throw new BadRequestException('Quiz not found');
    }

    const currentTime = new Date().getTime();
    const quizDeadline = new Date(quiz.deadline).getTime();

    return currentTime <= quizDeadline;
  }

  async getQuizzesByTeacher(teacherId: string): Promise<Quiz[]> {
    return await this.quizModel.find({ teacherId }).exec();
  }

  async getQuizById(quizId: string, teacherId: string): Promise<Quiz | null> {
    return await this.quizModel.findOne({ _id: quizId, teacherId }).exec();
  }

  async getQuizzesByTitle(title: string, teacherId: string): Promise<Quiz[]> {
    return await this.quizModel
      .find({ title: new RegExp(title, 'i'), teacherId })
      .exec();
  }

  async getQuizForScoreSubmission(quizId: string): Promise<Quiz | null> {
    return await this.quizModel.findById(quizId).exec();
  }
}
