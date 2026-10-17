import cors from 'cors';
import express from 'express';
import { config } from './config';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { quizzesRouter } from './routes/quizzes';

export const app = express();

app.use(cors({ origin: config.FRONTEND_URL }));
app.use(express.json({ limit: '100kb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/quizzes', quizzesRouter);

app.use(notFoundHandler);
app.use(errorHandler);
