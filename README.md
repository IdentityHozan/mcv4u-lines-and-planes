# MCV4U Lines and Planes

Grade 12 Calculus and Vectors: Sections 8.1–9.6.

## Run locally

Use Node.js 22.13 or newer. From this folder, run:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For a production build, use `npm run build` followed by `npm start`.

## Deploy to Vercel

Import this folder as a standard Next.js project. The install command is `npm ci` and the build command is `npm run build`. No database, account connection, or environment variables are required. Keep `public/course/videos` in the deployment; it contains the four full recordings. Git hosts with a small per-push limit may need the videos added in separate commits.

## Course content

- `data/written-chapter8.json` and `data/written-chapter9.json`: written lessons.
- `data/studyGuides.ts`: the method and try-it checkpoint for each section.
- `data/sectionHomework.ts`: homework and worked solutions.
- `data/unitAssessments.ts` and `data/linesAndPlanesData.ts`: quizzes, tests and final.
- `public/course/videos`: captioned recordings and posters.
- `public/course/website.pdf`: printable version, with links to the published course.
- `npm run check:course`: checks question counts, tags and worked solutions.

The published Sites instance uses a separate Worker for media ranges. This portable version uses Next.js static MP4 assets directly. Practice scores are stored in the browser. Multiple-choice questions are marked automatically; written work uses criteria and model answers for self-marking.
