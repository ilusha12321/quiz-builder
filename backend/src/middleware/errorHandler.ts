import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { HttpError } from '../errors';

interface BodyParserError {
  status: number;
  type: string;
}

function isBodyParserError(error: unknown): error is BodyParserError {
  if (typeof error !== 'object' || error === null) return false;
  const { status, type } = error as Partial<BodyParserError>;
  return typeof status === 'number' && typeof type === 'string' && status >= 400 && status < 500;
}

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({ error: { message: `Route ${req.method} ${req.path} not found` } });
};

// Express recognises error handlers by their four-argument signature.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      error: {
        message: 'Validation failed',
        details: error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      },
    });
    return;
  }

  if (error instanceof HttpError) {
    res.status(error.status).json({ error: { message: error.message } });
    return;
  }

  if (isBodyParserError(error)) {
    const message =
      error.type === 'entity.too.large' ? 'Request body is too large' : 'Invalid JSON body';
    res.status(error.status).json({ error: { message } });
    return;
  }

  console.error(error);
  res.status(500).json({ error: { message: 'Internal server error' } });
};
