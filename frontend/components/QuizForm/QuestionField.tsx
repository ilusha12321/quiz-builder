import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { Field } from '@/components/ui/Field';
import { QUESTION_TYPES, QUESTION_TYPE_LABELS } from '@/lib/questionTypes';
import { MAX_OPTIONS, type QuizFormValues } from '@/lib/quizForm';

interface QuestionFieldProps {
  index: number;
  canRemove: boolean;
  onRemove: () => void;
}

export function QuestionField({ index, canRemove, onRemove }: QuestionFieldProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<QuizFormValues>();

  const type = useWatch({ control, name: `questions.${index}.type` });
  const {
    fields: options,
    append,
    remove,
  } = useFieldArray({ control, name: `questions.${index}.options` });

  const questionErrors = errors.questions?.[index];
  const groupError = questionErrors?.options?.root?.message;

  return (
    <section className="card question-card" aria-label={`Question ${index + 1}`}>
      <div className="question-card-head">
        <h2 className="question-card-title">
          <span className="q-num" aria-hidden="true">
            {index + 1}
          </span>
          Question {index + 1}
        </h2>
        <button
          type="button"
          className="btn btn-ghost btn-danger"
          onClick={onRemove}
          disabled={!canRemove}
          title={canRemove ? 'Remove question' : 'A quiz needs at least one question'}
        >
          Remove
        </button>
      </div>

      <div className="field-row">
        <Field label="Question type" htmlFor={`q-${index}-type`}>
          <select id={`q-${index}-type`} className="input" {...register(`questions.${index}.type`)}>
            {QUESTION_TYPES.map((value) => (
              <option key={value} value={value}>
                {QUESTION_TYPE_LABELS[value]}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Question text"
          htmlFor={`q-${index}-text`}
          error={questionErrors?.text?.message}
        >
          <input
            id={`q-${index}-text`}
            className="input"
            type="text"
            placeholder="What would you like to ask?"
            aria-invalid={Boolean(questionErrors?.text)}
            {...register(`questions.${index}.text`)}
          />
        </Field>
      </div>

      {type === 'BOOLEAN' && (
        <fieldset className="choice-fieldset">
          <legend className="label">Correct answer</legend>
          <div className="choice-list">
            {(['true', 'false'] as const).map((value) => (
              <label key={value} className="choice">
                <input
                  type="radio"
                  value={value}
                  {...register(`questions.${index}.booleanAnswer`)}
                />
                <span>{value === 'true' ? 'True' : 'False'}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {type === 'INPUT' && (
        <Field
          label="Correct answer"
          htmlFor={`q-${index}-answer`}
          error={questionErrors?.textAnswer?.message}
        >
          <input
            id={`q-${index}-answer`}
            className="input"
            type="text"
            placeholder="Short text answer"
            aria-invalid={Boolean(questionErrors?.textAnswer)}
            {...register(`questions.${index}.textAnswer`)}
          />
        </Field>
      )}

      {type === 'CHECKBOX' && (
        <fieldset className="choice-fieldset">
          <legend className="label">Options (tick every correct one)</legend>
          <ul className="option-list">
            {options.map((option, optionIndex) => {
              const optionError = questionErrors?.options?.[optionIndex]?.text?.message;
              return (
                <li key={option.id} className="option-row">
                  <input
                    type="checkbox"
                    aria-label={`Option ${optionIndex + 1} is correct`}
                    {...register(`questions.${index}.options.${optionIndex}.isCorrect`)}
                  />
                  <div className="option-input">
                    <input
                      className="input"
                      type="text"
                      placeholder={`Option ${optionIndex + 1}`}
                      aria-label={`Option ${optionIndex + 1} text`}
                      aria-invalid={Boolean(optionError)}
                      {...register(`questions.${index}.options.${optionIndex}.text`)}
                    />
                    {optionError && <p className="field-error">{optionError}</p>}
                  </div>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => remove(optionIndex)}
                    disabled={options.length <= 2}
                    aria-label={`Remove option ${optionIndex + 1}`}
                    title="Remove option"
                  >
                    ×
                  </button>
                </li>
              );
            })}
          </ul>
          {groupError && <p className="field-error">{groupError}</p>}
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={() => append({ text: '', isCorrect: false })}
            disabled={options.length >= MAX_OPTIONS}
          >
            Add option
          </button>
        </fieldset>
      )}
    </section>
  );
}
