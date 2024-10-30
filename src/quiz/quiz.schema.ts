import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuizDocument = Quiz & Document;

@Schema()
export class Quiz {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  teacherId: string;

  @Prop({ required: true })
  timeLimit: number;

  @Prop({ required: true })
  deadline: Date;

  @Prop({ type: [{ id: String, text: String, options: [String], correctAnswer: String }] })
  questions: Question[];
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);

export class Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}
