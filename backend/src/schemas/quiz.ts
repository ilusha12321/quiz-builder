import { z } from 'zod';

export const QUESTION_TYPES = ['BOOLEAN', 'INPUT', 'CHECKBOX'] as const;
export type QuestionType = (typeof QUESTION_TYPES)[number];

const questionText = z
  .string({ required_error: 'Question text is required' })
  .trim()
  .min(1, 'Question text is required')
  .max(500, 'Question text must be at most 500 characters');

const booleanQuestion = z.object({
  type: z.literal('BOOLEAN'),
  text: questionText,
  booleanAnswer: z.boolean({ required_error: 'booleanAnswer is required' }),
});

const inputQuestion = z.object({
  type: z.literal('INPUT'),
  text: questionText,
  textAnswer: z
    .string({ required_error: 'textAnswer is required' })
    .trim()
    .min(1, 'Answer is required')
    .max(255, 'Answer must be at most 255 characters'),
});

const optionSchema = z.object({
  text: z
    .string({ required_error: 'Option text is required' })
    .trim()
    .min(1, 'Option text is required')
    .max(255, 'Option text must be at most 255 characters'),
  isCorrect: z.boolean({ required_error: 'isCorrect is required' }),
});

const checkboxQuestion = z.object({
  type: z.literal('CHECKBOX'),
  text: questionText,
  options: z
    .array(optionSchema)
    .min(2, 'A checkbox question needs at least two options')
    .max(10, 'A checkbox question can have at most 10 options')
    .refine((options) => options.some((option) => option.isCorrect), {
      message: 'At least one option must be marked as correct',
    }),
});

const questionSchema = z.discriminatedUnion('type', [
  booleanQuestion,
  inputQuestion,
  checkboxQuestion,
]);

export const createQuizSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(1, 'Title is required')
    .max(200, 'Title must be at most 200 characters'),
  questions: z
    .array(questionSchema)
    .min(1, 'A quiz needs at least one question')
    .max(50, 'A quiz can have at most 50 questions'),
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;

export const quizIdSchema = z.coerce
  .number({ invalid_type_error: 'Quiz id must be a positive integer' })
  .int('Quiz id must be a positive integer')
  .positive('Quiz id must be a positive integer')
  .max(2147483647, 'Quiz id is out of range');
