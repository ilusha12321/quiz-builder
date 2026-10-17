# Quiz Builder

A full-stack web application for creating and managing quizzes with different question types.

## Overview

Quiz Builder allows users to create quizzes, add questions, configure answer options, view quiz details, and manage existing quizzes through a clean and responsive interface.

## Features

- Create quizzes with custom titles.
- Add and manage questions.
- Support different question types:
  - **Boolean** — true or false questions.
  - **Input** — short text answer questions.
  - **Checkbox** — multiple-choice questions.
- View a list of available quizzes.
- View individual quiz details and questions.
- Delete quizzes.
- Store and manage quiz data through the backend.
- Responsive user interface for desktop and mobile devices.

## Screenshots

### 1. Quiz List

Displays the available quizzes, their titles, question counts, and available actions.

<img width="1218" height="936" alt="image" src="https://github.com/user-attachments/assets/c86911a1-75b5-4fae-888e-670fbd543da4" />


**Screenshot:** `quiz-list.png`

### 2. Create Quiz

Shows the quiz creation form, including the title field and question editor.

<img width="937" height="951" alt="image" src="https://github.com/user-attachments/assets/d813cb5f-bf04-4a7e-bec7-e88818355260" />

**Screenshot:** `create-quiz.png`

### 3. Question Types

Demonstrates the available question types and their configuration options.

<img width="953" height="936" alt="image" src="https://github.com/user-attachments/assets/b0116a92-0888-44e6-a1db-624f7b1c5fe6" />


**Screenshot:** `question-types.png`

### 4. Quiz Details

Displays an individual quiz and its questions.

<img width="868" height="917" alt="image" src="https://github.com/user-attachments/assets/21493a8b-2d2a-4953-887e-90a808b399fc" />


**Screenshot:** `quiz-details.png`

### 5. Delete Confirmation

Shows the confirmation dialog before deleting a quiz, if implemented.

<img width="990" height="493" alt="image" src="https://github.com/user-attachments/assets/72e16773-5d90-48d6-9e66-8f432aa79934" />


**Screenshot:** `delete-confirmation.png`

## Tech Stack

Update this section to match the technologies actually used in the project.

- **Frontend:** React, TypeScript, Next.js
- **Backend:** Node.js, Express.js
- **Database:** SQLite
- **ORM:** Prisma
- **Styling:** CSS / Tailwind CSS

## Project Structure

The project may be organized into frontend and backend applications:

```text
quiz-builder/
├── frontend/
│   ├── public/
│   │   └── screenshots/
│   └── src/
├── backend/
│   ├── prisma/
│   └── src/
├── .env.example
└── README.md
```

Adjust the structure above to reflect the actual repository.

## Getting Started

### Prerequisites

- Node.js
- npm
- A configured database, if required by the project
