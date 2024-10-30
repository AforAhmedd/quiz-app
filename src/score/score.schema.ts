// src/score/score.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Score extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  quizId: string;

  @Prop({ required: true })
  score: number;
}

export type ScoreDocument = Score & Document;
export const ScoreSchema = SchemaFactory.createForClass(Score);
