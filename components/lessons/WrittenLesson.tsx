import { Fragment, type ReactNode } from "react";
import { MathJaxRenderer } from "@/components/ui/MathJaxRenderer";
import { studyGuides } from "@/data/studyGuides";
import { LessonDiagram } from "./LessonDiagram";
import chapter8 from "@/data/written-chapter8.json";
import chapter9 from "@/data/written-chapter9.json";

type WrittenLessonContent = {
  section: string;
  title: string;
  intro: string;
  objectives: string[];
  blocks: { title: string; body: string }[];
  summary: string[];
};

export const writtenLessons: WrittenLessonContent[] = [...chapter8, ...chapter9];

const inline = (value: string) => value.split(/(\$[^$\n]+\$|\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
  if (part.startsWith("$") && part.endsWith("$") && part.length > 2) return <Fragment key={i}>{String.raw`\(` + part.slice(1, -1) + String.raw`\)`}</Fragment>;
  if (part.startsWith("**") && part.endsWith("**") && part.length > 4) return <strong key={i}>{inline(part.slice(2, -2))}</strong>;
  if (part.startsWith("`") && part.endsWith("`") && part.length > 2) return <code key={i}>{part.slice(1, -1)}</code>;
  return <Fragment key={i}>{part}</Fragment>;
});

function Prose({ body }: { body: string }) {
  return <>{body.split(/(\$\$[\s\S]+?\$\$)/g).map((part, i) => {
    if (part.startsWith("$$") && part.endsWith("$$")) {
      return <div className="lesson-equation" key={i}>{String.raw`\[` + part.slice(2, -2).trim() + String.raw`\]`}</div>;
    }
    return part.trim().split(/\n\s*\n/).filter(Boolean).map((paragraph, j) => {
      const lines = paragraph.split("\n");
      const key = `${i}-${j}`;
      if (lines.every((line) => /^\s*\d+\.\s/.test(line))) {
        return <ol key={key}>{lines.map((line, k) => <li key={k}>{inline(line.replace(/^\s*\d+\.\s+/, ""))}</li>)}</ol>;
      }
      if (lines.every((line) => /^\s*[-*]\s/.test(line))) {
        return <ul key={key}>{lines.map((line, k) => <li key={k}>{inline(line.replace(/^\s*[-*]\s+/, ""))}</li>)}</ul>;
      }
      return <p key={key} className={/^\*\*(?:Step \d|\d+\.|Given|Find|Check|Answer|Result)/i.test(paragraph) ? "lesson-example-step" : undefined}>{inline(paragraph.replace(/\n/g, " "))}</p>;
    });
  })}</>;
}

function blockTitle(title: string) {
  return title.replace(/^Worked example:\s*/i, "").replace(/^./, (letter) => letter.toUpperCase());
}

export function WrittenLesson({ content, lessonId, children }: { content: WrittenLessonContent; lessonId: string; children: ReactNode }) {
  const guide = studyGuides[content.section];
  const firstExample = content.blocks.findIndex((block) => /^Worked example:/i.test(block.title));
  const [foundation, ...otherFoundations] = content.blocks.slice(0, firstExample);
  const example = content.blocks[firstExample];
  const followUps = content.blocks.slice(firstExample + 1);
  const source = [guide.hook, ...guide.steps.map(({ body }) => body), guide.checkpoint.prompt, guide.checkpoint.answer, ...content.objectives, ...content.blocks.map(({ body }) => body), ...content.summary].join("\n");

  return <div className="reading-main">
    <MathJaxRenderer math={source} className="lesson-prose">
      <section id="understand" aria-labelledby="understand-title" className="lesson-block">
        <h2 id="understand-title">{foundation.title}</h2>
        <div className="lesson-lead"><Prose body={guide.hook} /></div>
        <LessonDiagram lessonId={lessonId} />
        <div id="topic-1"><Prose body={foundation.body} /></div>
      </section>

      <section id="method" aria-labelledby="method-title" className="lesson-block">
        <h2 id="method-title">Method</h2>
        <ol className="lesson-method">{guide.steps.map((step) => <li key={step.title}>
          <strong>{step.title}</strong>
          <Prose body={step.body} />
        </li>)}</ol>
        {otherFoundations.map((block, index) => <details className="lesson-disclosure" key={block.title} id={`topic-${index + 2}`}>
          <summary>{block.title}</summary>
          <Prose body={block.body} />
        </details>)}
      </section>

      <section id="worked-example" aria-labelledby="example-title" className="lesson-block">
        <h2 id="example-title">Worked example</h2>
        <div id={`topic-${firstExample + 1}`} className="lesson-example">
          <h3>{blockTitle(example.title)}</h3>
          <Prose body={example.body} />
        </div>
      </section>

      <section id="try-it" aria-labelledby="try-title" className="lesson-block">
        <h2 id="try-title">Try it</h2>
        <Prose body={guide.checkpoint.prompt} />
        <details className="lesson-disclosure">
          <summary>Show solution</summary>
          <Prose body={guide.checkpoint.answer} />
        </details>
      </section>

      {followUps.length > 0 && <section aria-labelledby="more-examples-title" className="lesson-block lesson-more">
        <h2 id="more-examples-title">More examples</h2>
        {followUps.map((block, index) => <details className="lesson-disclosure" key={block.title} id={`topic-${firstExample + index + 2}`}>
          <summary>{blockTitle(block.title)}</summary>
          <Prose body={block.body} />
        </details>)}
      </section>}

      <details className="lesson-disclosure lesson-recap" id="summary">
        <summary>Key takeaways</summary>
        <ul>{content.summary.map((item) => <li key={item}>{inline(item)}</li>)}</ul>
      </details>
      <details className="lesson-disclosure">
        <summary>Learning goals</summary>
        <ul>{content.objectives.map((goal) => <li key={goal}>{inline(goal)}</li>)}</ul>
      </details>
    </MathJaxRenderer>

    <section id="homework" className="lesson-block lesson-homework-block" aria-labelledby="homework-title">
      <h2 id="homework-title">Homework {content.section}</h2>
      {children}
    </section>
  </div>;
}
