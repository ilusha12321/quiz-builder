import { QUESTION_TYPE_LABELS } from '@/lib/questionTypes';
import type { Question } from '@/types/quiz';

interface QuestionViewProps {
  question: Question;
  index: number;
}

export function QuestionView({ question, index }: QuestionViewProps) {
  const name = `question-${question.id}`;

  return (
    <li className="card question-view">
      <div className="question-view-head">
        <span className="q-num" aria-hidden="true">
          {index + 1}
        </span>
        <h2 className="question-title">{question.text}</h2>
        <span className="badge">{QUESTION_TYPE_LABELS[question.type]}</span>
      </div>

      {question.type === 'BOOLEAN' && (
        <div className="choice-list" role="radiogroup" aria-label={question.text}>
          {[true, false].map((value) => {
            const correct = question.booleanAnswer === value;
            return (
              <label key={String(value)} className={correct ? 'choice is-correct' : 'choice'}>
                <input type="radio" name={name} checked={correct} disabled readOnly />
                <span>{value ? 'True' : 'False'}</span>
              </label>
            );
          })}
        </div>
      )}

      {question.type === 'INPUT' && (
        <p className="answer-box" aria-label="Correct answer">
          {question.textAnswer}
        </p>
      )}

      {question.type === 'CHECKBOX' && (
        <ul className="choice-list">
          {question.options.map((option) => (
            <li key={option.id}>
              <label className={option.isCorrect ? 'choice is-correct' : 'choice'}>
                <input type="checkbox" checked={option.isCorrect} disabled readOnly />
                <span>{option.text}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
