import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { QuestionView } from '@/components/QuestionView';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { ApiError, getErrorMessage, quizApi } from '@/services/api';
import type { QuizDetails } from '@/types/quiz';

type State =
  | { status: 'loading' }
  | { status: 'success'; quiz: QuizDetails }
  | { status: 'error'; message: string; notFound: boolean };

export default function QuizDetailPage() {
  const { isReady, query } = useRouter();
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    if (!isReady) return;

    const id = Number(query.id);
    if (!Number.isInteger(id) || id <= 0) {
      setState({ status: 'error', message: 'Quiz not found.', notFound: true });
      return;
    }

    let cancelled = false;
    setState({ status: 'loading' });

    quizApi
      .get(id)
      .then((quiz) => {
        if (!cancelled) setState({ status: 'success', quiz });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const notFound = error instanceof ApiError && error.status === 404;
        setState({
          status: 'error',
          message: notFound ? 'Quiz not found.' : getErrorMessage(error),
          notFound,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [isReady, query.id]);

  const title = state.status === 'success' ? state.quiz.title : 'Quiz';

  return (
    <div className="narrow">
      <Head>
        <title>{`${title} | Quiz Builder`}</title>
      </Head>

      <Link href="/quizzes" className="back-link">
        Back to quizzes
      </Link>

      {state.status === 'loading' && <Spinner label="Loading quiz…" />}

      {state.status === 'error' && (
        <div className="state-box">
          <Alert variant="error">{state.message}</Alert>
          {!state.notFound && (
            <button type="button" className="btn btn-secondary" onClick={() => location.reload()}>
              Try again
            </button>
          )}
        </div>
      )}

      {state.status === 'success' && (
        <>
          <div className="page-head">
            <h1>{state.quiz.title}</h1>
            <p className="muted">
              {state.quiz.questions.length}{' '}
              {state.quiz.questions.length === 1 ? 'question' : 'questions'}
            </p>
          </div>
          <ol className="question-list">
            {state.quiz.questions.map((question, index) => (
              <QuestionView key={question.id} question={question} index={index} />
            ))}
          </ol>
        </>
      )}
    </div>
  );
}
