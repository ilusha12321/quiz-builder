# Quiz Builder

Full-stack quiz creation app. Users can create quizzes with three question types
(True/False, short text, multiple choice with several correct answers), list all quizzes,
open a quiz in read-only mode and delete quizzes.

- **Backend:** Node.js, Express, TypeScript, Prisma ORM, SQLite, Zod validation
- **Frontend:** Next.js (Pages Router), React, TypeScript, React Hook Form, Zod, plain CSS

```
quiz-builder/
├── backend/    # REST API (src/, prisma/)
├── frontend/   # Next.js app (pages/, components/, services/)
└── README.md
```

## Requirements

- Node.js 18.18 or newer (Node 20 LTS recommended) and npm

No Docker or external database server is needed: the database is a local SQLite file.

## 1. Backend

```bash
cd backend
cp .env.example .env        # Windows PowerShell: Copy-Item .env.example .env
npm install
npm run db:migrate          # creates prisma/dev.db, applies the schema and seeds a sample quiz
npm run dev                 # http://localhost:4000
```

Run the commands one per line (Windows PowerShell 5.1 does not support `&&`). If PowerShell
blocks `npm`, run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` once.

Environment variables (`backend/.env`):

| Variable       | Default                 | Description                      |
| -------------- | ----------------------- | -------------------------------- |
| `DATABASE_URL` | `file:./dev.db`         | SQLite file, relative to `prisma/` |
| `PORT`         | `4000`                  | API port                         |
| `FRONTEND_URL` | `http://localhost:3000` | Allowed CORS origin              |

Production build: `npm run build && npm start`.

## 2. Frontend

```bash
cd frontend
cp .env.example .env.local  # Windows PowerShell: Copy-Item .env.example .env.local
npm install
npm run dev                 # http://localhost:3000
```

| Variable              | Default                 | Description          |
| --------------------- | ----------------------- | -------------------- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | Base URL of the API  |

Production build: `npm run build && npm start`.

## 3. Create a sample quiz

Either:

- it is created automatically by the first `npm run db:migrate`; to recreate it run `npm run db:seed` in `backend/` (creates "Sample quiz: JavaScript basics" with one question of each type), or
- open http://localhost:3000/create, enter a title, add questions, and press **Save quiz**, or
- call the API directly:

```bash
curl -X POST http://localhost:4000/quizzes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Geography",
    "questions": [
      { "type": "BOOLEAN", "text": "Kyiv is the capital of Ukraine.", "booleanAnswer": true },
      { "type": "INPUT", "text": "Longest river in Ukraine?", "textAnswer": "Dnipro" },
      { "type": "CHECKBOX", "text": "Which are Ukrainian cities?",
        "options": [
          { "text": "Lviv", "isCorrect": true },
          { "text": "Warsaw", "isCorrect": false },
          { "text": "Odesa", "isCorrect": true }
        ] }
    ]
  }'
```

## API

| Method | Path           | Description                                              | Success |
| ------ | -------------- | -------------------------------------------------------- | ------- |
| POST   | `/quizzes`     | Create a quiz                                            | 201     |
| GET    | `/quizzes`     | List quizzes (`id`, `title`, `createdAt`, `questionsCount`) | 200  |
| GET    | `/quizzes/:id` | Quiz with all questions and options                      | 200     |
| DELETE | `/quizzes/:id` | Delete a quiz (questions and options are removed too)    | 204     |

Errors use the shape `{ "error": { "message": "...", "details": [{ "path", "message" }] } }`:
`400` for invalid input or id, `404` for an unknown quiz or route, `500` for unexpected errors.

Question payloads, by `type`:

- `BOOLEAN`: `text`, `booleanAnswer` (boolean)
- `INPUT`: `text`, `textAnswer` (non-empty string)
- `CHECKBOX`: `text`, `options[]` (2 to 10 items of `{ text, isCorrect }`, at least one correct)

## Code quality

Both packages have ESLint and Prettier configured:

```bash
npm run lint
npm run format        # rewrite files with Prettier
npm run format:check
npm run typecheck
```

`.env` files are git-ignored; only `.env.example` files are committed.
