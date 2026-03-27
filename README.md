# EnglishPro - Comprehensive English Learning Platform

A full-stack PWA web application for learning English, featuring 8 interactive modules, 4000+ vocabulary words, and bilingual UI (EN/ZH). Built with Next.js, Tailwind CSS, and AI integration.

## Features

### Core Learning Modules
- **Vocabulary** — Tinder-style swipe flashcards with SM-2 spaced repetition. 8 word banks including CET-6, TOEFL, IELTS, GRE (4200+ words)
- **Wordbook** — Global word notebook. Save words from any module, auto-integrated into review flow
- **Grammar** — 20 interactive topics with 200+ exercises (fill-blank, multiple-choice, rewrite)
- **Reading** — Article reader with click-to-define word lookup, wordbook word highlighting, and comprehension quizzes
- **Listening** — Audio player with speed control, A-B loop, dictation mode, and comprehension exercises
- **Speaking** — Voice recording with Web Speech API recognition, pronunciation scoring, and word-by-word comparison
- **AI Chat** — Conversational practice with scenario-based prompts and real-time grammar correction
- **Quiz** — Placement test, level reviews, and comprehensive mock exams with timed assessments

### Platform Features
- **PWA** — Installable as a native app, offline caching, home screen shortcuts
- **Bilingual UI** — Full English/Chinese interface, switchable in Settings
- **Dark Mode** — System-aware theme with manual toggle
- **Progress Tracking** — Daily goals, streak counter, XP system, and learning analytics
- **Responsive** — Optimized for desktop, tablet, and mobile

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) + TypeScript |
| UI | Tailwind CSS 4 + shadcn/ui + Lucide Icons |
| Database | SQLite + Prisma ORM 6 |
| AI | OpenAI API (optional — works with mock mode) |
| Speech | Web Speech API (browser-native STT/TTS) |
| Charts | Recharts |
| PWA | Custom Service Worker + Web App Manifest |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/kchris1027/english-learning-app.git
cd english-learning-app
npm install
```

### Database Setup

```bash
npx prisma migrate dev --name init
npm run db:seed
```

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="your-openai-api-key-here"  # Optional — app works without it
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:seed` | Seed database with learning content |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:studio` | Open Prisma Studio (database GUI) |
| `npm run db:reset` | Reset database and re-seed |

## Project Structure

```
src/
├── app/
│   ├── (app)/              # Main app routes (authenticated layout)
│   │   ├── dashboard/      # Overview with daily goals and quick-start
│   │   ├── vocabulary/     # Word banks, flashcards, review, stats, wordbook
│   │   ├── grammar/        # 20 topics with interactive exercises
│   │   ├── reading/        # 10 articles with word lookup and quizzes
│   │   ├── listening/      # 8 audio contents with exercises and dictation
│   │   ├── speaking/       # 12 prompts with voice recording
│   │   ├── chat/           # AI conversation with scenarios
│   │   ├── quiz/           # 5 quizzes (placement, review, mock exam)
│   │   ├── progress/       # Learning analytics and streak tracking
│   │   └── settings/       # Language, theme, and app settings
│   └── api/                # RESTful API routes for all modules
├── components/
│   ├── ui/                 # shadcn/ui component library (17 components)
│   ├── layout/             # Sidebar, topbar, mobile nav
│   ├── vocabulary/         # Swipe cards, add-word dialog
│   ├── chat/               # Scenario picker, message bubble
│   └── speaking/           # Waveform, page clients
├── hooks/                  # useAudioRecorder, useSpeechRecognition
└── lib/                    # Utilities (db, auth, SM2, i18n, markdown, etc.)

prisma/
├── schema.prisma           # 20+ models for all features
├── seed.ts                 # Modular seed orchestrator
└── seed-data/
    ├── vocabulary/         # 8 JSON word banks (4200+ words)
    ├── grammar.ts          # 20 topics, 200+ exercises
    ├── reading.ts          # 10 articles, 40 questions
    ├── listening.ts        # 8 contents, 30 exercises
    ├── speaking.ts         # 12 prompts
    └── quizzes.ts          # 5 quizzes, 58 questions
```

## Learning Content

| Module | Content |
|--------|---------|
| Vocabulary | 8 banks: Essential Daily, CET-6 (1000), TOEFL (1000), IELTS (1000), GRE (1000), Phrasal Verbs (100), Idioms (100), Business English |
| Grammar | 20 topics: Tenses (6), Comparatives, Prepositions, Articles, Modals, Relative Clauses, Passive Voice, Conditionals, Reported Speech, Gerunds/Infinitives, Countable/Uncountable, Subject-Verb Agreement, Conjunctions, Question Tags |
| Reading | 10 articles across science, technology, culture, education, environment, business |
| Listening | 8 contents: conversations, news, academic lectures, tours |
| Speaking | 12 prompts: read-aloud, picture-describe, free-talk |
| Quiz | 5 quizzes: placement test, beginner/intermediate/advanced review, comprehensive mock exam |

## Notes

- **Authentication** is architecturally reserved but not yet implemented. A default user is used for development.
- **AI Chat** works in mock mode without an OpenAI API key, providing simulated responses.
- **Audio files** for listening exercises are placeholders; the app falls back to browser TTS.
- **PWA** install prompt appears on supported browsers (Chrome, Edge). Safari supports Add to Home Screen manually.

## License

ISC
