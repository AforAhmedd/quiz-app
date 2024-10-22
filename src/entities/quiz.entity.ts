export class Quiz {
  id: string;
  title: string;
  category: string;
  teacherId: string;
  timeLimit: number; // in seconds, the duration of the quiz
  deadline: Date; // the deadline before which the quiz can be started
  questions: Question[];
}

export class Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}
