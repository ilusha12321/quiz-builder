export type QuestionType = 'BOOLEAN' | 'INPUT' | 'CHECKBOX';

export interface QuizOption {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  type: QuestionType;
  text: string;
  booleanAnswer: boolean | null;
  textAnswer: string | null;
  options: QuizOption[];
}

export interface QuizDetails {
  id: number;
  title: string;
  createdAt: string;
  questions: Question[];
}

export interface QuizSummary {
  id: number;
  title: string;
  createdAt: string;
  questionsCount: number;
}

export interface OptionPayload {
  text: string;
  isCorrect: boolean;
}

export type CreateQuestionPayload =
  | { type: 'BOOLEAN'; text: string; booleanAnswer: boolean }
  | { type: 'INPUT'; text: string; textAnswer: string }
  | { type: 'CHECKBOX'; text: string; options: OptionPayload[] };

export interface CreateQuizPayload {
  title: string;
  questions: CreateQuestionPayload[];
}
