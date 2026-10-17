import { Router } from 'express';
import { createQuizSchema, quizIdSchema } from '../schemas/quiz';
import { createQuiz, deleteQuiz, getQuizById, listQuizzes } from '../services/quizService';
import { asyncHandler } from '../utils/asyncHandler';

export const quizzesRouter = Router();

quizzesRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const input = createQuizSchema.parse(req.body);
    const quiz = await createQuiz(input);
    res.status(201).json(quiz);
  }),
);

quizzesRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    res.json(await listQuizzes());
  }),
);

quizzesRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = quizIdSchema.parse(req.params.id);
    res.json(await getQuizById(id));
  }),
);

quizzesRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = quizIdSchema.parse(req.params.id);
    await deleteQuiz(id);
    res.status(204).send();
  }),
);
