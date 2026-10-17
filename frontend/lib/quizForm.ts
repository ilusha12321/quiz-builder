import { z } from 'zod';
import type { CreateQuestionPayload, CreateQuizPayload } from '@/types/quiz';

export const MAX_OPTIONS = 10;

const optionFormSchema = z.object({
  text: z.string(),
  isCorrect: z.boolean(),
});

// Every question keeps all fields so the user can switch types without losing input;
// only the fields relevant to the selected type are validated and sent.
const questionFormSchema = z
  .object({
    type: z.enum(['BOOLEAN', 'INPUT', 'CHECKBOX']),
    text: z
      .string()
      .trim()
      .min(1, 'Question text is required')
      .max(500, 'Question text must be at most 500 characters'),
    booleanAnswer: z.enum(['true', 'false']),
    textAnswer: z.string(),
    options: z.array(optionFormSchema).max(MAX_OPTIONS),
  })
  .superRefine((question, ctx) => {
    if (question.type === 'INPUT') {
      const answer = question.textAnswer.trim();
      if (!answer) {
        ctx.addIssue({ code: 'custom', path: ['textAnswer'], message: 'Answer is required' });
      } else if (answer.length > 255) {
        ctx.addIssue({
          code: 'custom',
          path: ['textAnswer'],
          message: 'Answer must be at most 255 characters',
        });
      }
    }

    if (question.type === 'CHECKBOX') {
      if (question.options.length < 2) {
        ctx.addIssue({
          code: 'custom',
          path: ['options', 'root'],
          message: 'Add at least two options',
        });
      } else if (!question.options.some((option) => option.isCorrect)) {
        ctx.addIssue({
          code: 'custom',
          path: ['options', 'root'],
          message: 'Mark at least one option as correct',
        });
      }

      question.options.forEach((option, index) => {
        if (!option.text.trim()) {
          ctx.addIssue({
            code: 'custom',
            path: ['options', index, 'text'],
            message: 'Option text is required',
          });
        }
      });
    }
  });

export const quizFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(200, 'Title must be at most 200 characters'),
  questions: z.array(questionFormSchema).min(1, 'Add at least one question').max(50),
});

export type QuizFormValues = z.infer<typeof quizFormSchema>;
export type QuestionFormValues = QuizFormValues['questions'][number];

export function createEmptyQuestion(): QuestionFormValues {
  return {
    type: 'BOOLEAN',
    text: '',
    booleanAnswer: 'true',
    textAnswer: '',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ],
  };
}

function toQuestionPayload(question: QuestionFormValues): CreateQuestionPayload {
  const text = question.text.trim();

  switch (question.type) {
    case 'BOOLEAN':
      return { type: 'BOOLEAN', text, booleanAnswer: question.booleanAnswer === 'true' };
    case 'INPUT':
      return { type: 'INPUT', text, textAnswer: question.textAnswer.trim() };
    case 'CHECKBOX':
      return {
        type: 'CHECKBOX',
        text,
        options: question.options.map((option) => ({
          text: option.text.trim(),
          isCorrect: option.isCorrect,
        })),
      };
  }
}

export function toPayload(values: QuizFormValues): CreateQuizPayload {
  return {
    title: values.title.trim(),
    questions: values.questions.map(toQuestionPayload),
  };
}
