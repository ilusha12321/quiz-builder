import type { CreateQuizPayload, QuizDetails, QuizSummary } from '@/types/quiz';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

interface ApiErrorDetail {
  path: string;
  message: string;
}

interface ApiErrorBody {
  error?: { message?: string; details?: ApiErrorDetail[] };
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly details: ApiErrorDetail[] = [],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = init.body ? { 'Content-Type': 'application/json' } : undefined;
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, { ...init, headers });
  } catch {
    throw new ApiError('Unable to reach the server. Check that the backend is running.', 0);
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiError(
      body?.error?.message ?? `Request failed with status ${response.status}`,
      response.status,
      body?.error?.details,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

export const quizApi = {
  list: () => request<QuizSummary[]>('/quizzes'),
  get: (id: number) => request<QuizDetails>(`/quizzes/${id}`),
  create: (payload: CreateQuizPayload) =>
    request<QuizDetails>('/quizzes', { method: 'POST', body: JSON.stringify(payload) }),
  remove: (id: number) => request<void>(`/quizzes/${id}`, { method: 'DELETE' }),
};
