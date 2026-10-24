# MCV4U Lines and Planes

A standalone Next.js course website covering lines, planes, intersections, and distance. The source, homework, quizzes, unit tests, examination, visualizers, PDF, and two slide decks are included.

## Run on your computer

Install Node.js 22.13 or later, which includes npm. Extract the project, then open a terminal inside the folder containing `package.json`.

The same commands work in Windows PowerShell, macOS Terminal, and Linux:

```sh
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Keep the terminal open while using the development server. Press Ctrl+C to stop it.

No environment variables, API keys, database, or account are required.

An internet connection is needed for MathJax, which renders the LaTeX equations from the jsDelivr CDN. Video recordings also need access to their configured hosting service. The PDF and PowerPoint downloads are included locally.

## Production build

```sh
npm run typecheck
npm run build
npm start
```

`npm start` serves the production build at [http://localhost:3000](http://localhost:3000); run `npm run build` first.

## Deploy on Vercel

1. Put the project in a GitHub repository, or upload it using the Vercel CLI.
2. Import the project into Vercel and select the **Next.js** framework preset.
3. Use the default install command and `npm run build` as the build command. Leave the output directory at its Next.js default.
4. Use Node.js 22.x or newer. No environment variables are required.

Deploy the folder containing `package.json` as the project root. No custom server or hosting adapter is needed.

## Edit the course

| Location | Content |
| --- | --- |
| `app/` | Pages and global styling |
| `components/lessons/` | Lesson displays and teaching demonstrations |
| `components/assessments/` | Homework and assessment interfaces |
| `components/vectors/` | Calculators and interactive geometry |
| `data/classroomLessons.ts` | Section content and lesson sequence |
| `data/linesAndPlanesData.ts` | Shared course data, assessment types, and final examination |
| `data/lessonExtensions.ts` | Additional lesson explanations and examples |
| `data/sectionHomework.ts` | Homework questions, hints, and worked solutions |
| `data/unitAssessments.ts` | Four unit quizzes and four unit tests |
| `data/courseUnits.ts` | Unit coverage and links between lessons and assessments |
| `data/videoRecordings.ts` | Recording URLs |
| `data/videoOneTeaching.ts` | Line-teaching demonstration content |
| `public/course/` | Downloadable course PDF and slide decks |

To publish a recording, set its URL in `data/videoRecordings.ts`. The available keys are `video-lines`, `video-planes`, `video-intersections`, and `video-distances`. Use a YouTube URL or a public MP4/WebM URL. An empty URL leaves that recording pending.

Homework completion, assessment attempts, and scores are saved in the current browser's local storage. They are not synced between devices or browsers. Written responses are self-assessed; recorded marks are practice estimates.

The project uses Next.js, React, Tailwind CSS, Framer Motion, Three.js, React Three Fiber, and Drei. Dependency versions match the versions used for the course site.
