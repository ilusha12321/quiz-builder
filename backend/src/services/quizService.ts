import { Prisma } from '@prisma/client';
import { prisma } from '../db';
import { HttpError } from '../errors';
import type { CreateQuizInput, QuestionType } from '../schemas/quiz';

const quizDetailsInclude = {
  questions: {
    orderBy: { position: 'asc' },
    include: { options: { orderBy: { position: 'asc' } } },
  },
} satisfies Prisma.QuizInclude;

type QuizWithQuestions = Prisma.QuizGetPayload<{ include: typeof quizDetailsInclude }>;

export interface OptionDto {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface QuestionDto {
  id: number;
  type: QuestionType;
  text: string;
  booleanAnswer: boolean | null;
  textAnswer: string | null;
  options: OptionDto[];
}

export interface QuizDto {
  id: number;
  title: string;
  createdAt: string;
  questions: QuestionDto[];
}

export interface QuizSummaryDto {
  id: number;
  title: string;
  createdAt: string;
  questionsCount: number;
}

function toQuizDto(quiz: QuizWithQuestions): QuizDto {
  return {
    id: quiz.id,
    title: quiz.title,
    createdAt: quiz.createdAt.toISOString(),
    questions: quiz.questions.map((question) => ({
      id: question.id,
      // The type column is only ever written by this service, from a validated value.
      type: question.type as QuestionType,
      text: question.text,
      booleanAnswer: question.booleanAnswer,
      textAnswer: question.textAnswer,
      options: question.options.map((option) => ({
        id: option.id,
        text: option.text,
        isCorrect: option.isCorrect,
      })),
    })),
  };
}

function toQuestionCreateInput(
  question: CreateQuizInput['questions'][number],
  position: number,
): Prisma.QuestionCreateWithoutQuizInput {
  const base = { type: question.type, text: question.text, position };

  switch (question.type) {
    case 'BOOLEAN':
      return { ...base, booleanAnswer: question.booleanAnswer };
    case 'INPUT':
      return { ...base, textAnswer: question.textAnswer };
    case 'CHECKBOX':
      return {
        ...base,
        options: {
          create: question.options.map((option, optionPosition) => ({
            text: option.text,
            isCorrect: option.isCorrect,
            position: optionPosition,
          })),
        },
      };
  }
}

export async function createQuiz(input: CreateQuizInput): Promise<QuizDto> {
  const quiz = await prisma.quiz.create({
    data: {
      title: input.title,
      questions: {
        create: input.questions.map((question, position) =>
          toQuestionCreateInput(question, position),
        ),
      },
    },
    include: quizDetailsInclude,
  });

  return toQuizDto(quiz);
}

export async function listQuizzes(): Promise<QuizSummaryDto[]> {
  const quizzes = await prisma.quiz.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      createdAt: true,
      _count: { select: { questions: true } },
    },
  });

  return quizzes.map((quiz) => ({
    id: quiz.id,
    title: quiz.title,
    createdAt: quiz.createdAt.toISOString(),
    questionsCount: quiz._count.questions,
  }));
}

export async function getQuizById(id: number): Promise<QuizDto> {
  const quiz = await prisma.quiz.findUnique({ where: { id }, include: quizDetailsInclude });

  if (!quiz) {
    throw new HttpError(404, 'Quiz not found');
  }

  return toQuizDto(quiz);
}

export async function deleteQuiz(id: number): Promise<void> {
  try {
    await prisma.quiz.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new HttpError(404, 'Quiz not found');
    }
    throw error;
  }
}
