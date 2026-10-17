import Head from 'next/head';
import { QuizForm } from '@/components/QuizForm/QuizForm';

export default function CreateQuizPage() {
  return (
    <div className="narrow">
      <Head>
        <title>Create quiz | Quiz Builder</title>
      </Head>
      <div className="page-head">
        <h1>Create quiz</h1>
        <p className="muted">Give your quiz a title and add the questions it should contain.</p>
      </div>
      <QuizForm />
    </div>
  );
}
