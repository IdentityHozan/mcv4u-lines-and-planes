import { MathJaxRenderer } from "@/components/ui/MathJaxRenderer";

export function StudyPrompt({ prompt, className = "" }: { prompt: string; className?: string }) {
  const parts = prompt.split(/\s+(?=\([a-d]\)\s+[A-Z])/);
  if (parts.length === 1) return <MathJaxRenderer math={prompt} className={className} />;

  const [setup, ...tasks] = parts;
  return (
    <div className={className}>
      {setup && <MathJaxRenderer math={setup} />}
      <ol className="mt-2 space-y-1">
        {tasks.map((task) => (
          <li key={task} className="grid grid-cols-[1.8rem_minmax(0,1fr)] items-baseline gap-1">
            <span className="text-sm font-semibold">{task.slice(0, 3)}</span>
            <MathJaxRenderer math={task.slice(3).trim()} />
          </li>
        ))}
      </ol>
    </div>
  );
}
