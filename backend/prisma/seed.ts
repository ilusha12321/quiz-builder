import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SAMPLE_TITLE = 'Sample quiz: JavaScript basics';

async function main() {
  // Keep the seed idempotent: replace the previous sample quiz if it exists.
  await prisma.quiz.deleteMany({ where: { title: SAMPLE_TITLE } });

  const quiz = await prisma.quiz.create({
    data: {
      title: SAMPLE_TITLE,
      questions: {
        create: [
          {
            type: 'BOOLEAN',
            text: 'JavaScript and Java are the same language.',
            position: 0,
            booleanAnswer: false,
          },
          {
            type: 'INPUT',
            text: 'Which keyword declares a block-scoped constant?',
            position: 1,
            textAnswer: 'const',
          },
          {
            type: 'CHECKBOX',
            text: 'Which of these are JavaScript primitive types?',
            position: 2,
            options: {
              create: [
                { text: 'string', isCorrect: true, position: 0 },
                { text: 'number', isCorrect: true, position: 1 },
                { text: 'array', isCorrect: false, position: 2 },
                { text: 'boolean', isCorrect: true, position: 3 },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`Created sample quiz #${quiz.id}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
