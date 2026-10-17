import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { Alert } from '@/components/ui/Alert';
import { Field } from '@/components/ui/Field';
import {
  createEmptyQuestion,
  quizFormSchema,
  toPayload,
  type QuizFormValues,
} from '@/lib/quizForm';
import { ApiError, quizApi } from '@/services/api';
import { QuestionField } from './QuestionField';

export function QuizForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<ApiError | null>(null);

  const methods = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: { title: '', questions: [createEmptyQuestion()] },
  });
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;
  const { fields, append, remove } = useFieldArray({ control, name: 'questions' });

  const onSubmit = async (values: QuizFormValues) => {
    setSubmitError(null);
    try {
      await quizApi.create(toPayload(values));
      await router.push('/quizzes?created=1');
    } catch (error) {
      setSubmitError(
        error instanceof ApiError ? error : new ApiError('Something went wrong. Please try again.', 0),
      );
    }
  };

  return (
    <FormProvider {...methods}>
      <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {submitError && (
          <Alert variant="error">
            <strong>Could not save the quiz.</strong> {submitError.message}
            {submitError.details.length > 0 && (
              <ul className="alert-list">
                {submitError.details.map((detail) => (
                  <li key={`${detail.path}-${detail.message}`}>
                    {detail.path ? `${detail.path}: ` : ''}
                    {detail.message}
                  </li>
                ))}
              </ul>
            )}
          </Alert>
        )}

        <div className="card">
          <Field label="Quiz title" htmlFor="quiz-title" error={errors.title?.message}>
            <input
              id="quiz-title"
              className="input"
              type="text"
              placeholder="e.g. JavaScript basics"
              aria-invalid={Boolean(errors.title)}
              {...register('title')}
            />
          </Field>
        </div>

        {fields.map((field, index) => (
          <QuestionField
            key={field.id}
            index={index}
            canRemove={fields.length > 1}
            onRemove={() => remove(index)}
          />
        ))}

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => append(createEmptyQuestion())}
          >
            Add question
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save quiz'}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
