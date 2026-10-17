import Link from 'next/link';
import type { QuizSummary } from '@/types/quiz';

interface QuizCardProps {
  quiz: QuizSummary;
  deleting: boolean;
  onDelete: (quiz: QuizSummary) => void;
}

export function QuizCard({ quiz, deleting, onDelete }: QuizCardProps) {
  const count = quiz.questionsCount;
  const created = new Date(quiz.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <li className="quiz-card">
      <Link href={`/quizzes/${quiz.id}`} className="quiz-card-link">
        <span className="quiz-card-title">{quiz.title}</span>
        <span className="quiz-card-meta">
          <span className="pill">
            {count} {count === 1 ? 'question' : 'questions'}
          </span>
          <span>{created}</span>
        </span>
      </Link>
      <button
        type="button"
        className="icon-button"
        onClick={() => onDelete(quiz)}
        disabled={deleting}
        aria-label={`Delete quiz ${quiz.title}`}
        title="Delete quiz"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </li>
  );
}
