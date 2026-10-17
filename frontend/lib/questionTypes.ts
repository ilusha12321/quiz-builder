import type { QuestionType } from '@/types/quiz';

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  BOOLEAN: 'True / False',
  INPUT: 'Short text',
  CHECKBOX: 'Multiple choice',
};

export const QUESTION_TYPES = Object.keys(QUESTION_TYPE_LABELS) as QuestionType[];
