import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { QuizCard } from '@/components/QuizCard';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { getErrorMessage, quizApi } from '@/services/api';
import type { QuizSummary } from '@/types/quiz';

export default function QuizListPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<QuizSummary[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadQuizzes = useCallback(async () => {
    setLoadError(null);
    setQuizzes(null);
    try {
      setQuizzes(await quizApi.list());
    } catch (error) {
      setLoadError(getErrorMessage(error));
    }
  }, []);

  useEffect(() => {
    void loadQuizzes();
  }, [loadQuizzes]);

  // The create page redirects here with ?created=1 to show a success message.
  useEffect(() => {
    if (router.isReady && router.query.created) {
      setNotice('Quiz created successfully.');
      void router.replace('/quizzes', undefined, { shallow: true });
    }
  }, [router]);

  const handleDelete = async (quiz: QuizSummary) => {
    if (!window.confirm(`Delete "${quiz.title}"? This cannot be undone.`)) return;

    setDeletingId(quiz.id);
    setActionError(null);
    setNotice(null);
    try {
      await quizApi.remove(quiz.id);
      setQuizzes((current) => current?.filter((item) => item.id !== quiz.id) ?? null);
      setNotice('Quiz deleted.');
    } catch (error) {
      setActionError(getErrorMessage(error));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Head>
        <title>Quizzes | Quiz Builder</title>
      </Head>
      <div className="page-head page-head-row">
        <div>
          <h1>Quizzes</h1>
          <p className="muted">All quizzes saved in the database.</p>
        </div>
        <Link href="/create" className="btn btn-primary">
          Create quiz
        </Link>
      </div>

      {notice && (
        <Alert variant="success" onDismiss={() => setNotice(null)}>
          {notice}
        </Alert>
      )}
      {actionError && (
        <Alert variant="error" onDismiss={() => setActionError(null)}>
          {actionError}
        </Alert>
      )}

      {loadError && (
        <div className="state-box">
          <Alert variant="error">{loadError}</Alert>
          <button type="button" className="btn btn-secondary" onClick={() => void loadQuizzes()}>
            Try again
          </button>
        </div>
      )}

      {!loadError && quizzes === null && <Spinner label="Loading quizzes…" />}

      {quizzes && quizzes.length === 0 && (
        <div className="state-box empty">
          <h2>No quizzes yet</h2>
          <p className="muted">Create your first quiz to see it here.</p>
          <Link href="/create" className="btn btn-primary">
            Create quiz
          </Link>
        </div>
      )}

      {quizzes && quizzes.length > 0 && (
        <ul className="quiz-list">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              deleting={deletingId === quiz.id}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </>
  );
}
