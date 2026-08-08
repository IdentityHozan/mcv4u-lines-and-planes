import { navigationItems } from "@/data/linesAndPlanesData";

type NavigationProps = {
  onNavigate?: () => void;
};

export function CourseNavigation({ onNavigate }: NavigationProps) {
  return (
    <nav aria-label="Course sections" className="flex h-full flex-col">
      <div className="mb-8">
        <p className="micro-label text-sky-300">Course map</p>
        <p className="mt-2 text-sm text-zinc-500">Lines and planes in R² and R³</p>
      </div>
      <ol className="space-y-0.5 overflow-y-auto pr-1">
        {navigationItems.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={onNavigate}
              className="group flex items-center gap-4 border-l border-white/10 px-4 py-2.5 text-sm text-zinc-500 transition hover:border-sky-400 hover:bg-sky-400/[0.045] hover:text-zinc-100"
            >
              <span className="font-mono text-[10px] text-zinc-600 transition group-hover:text-sky-300">
                {item.index}
              </span>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
      <div className="mt-auto border-t border-white/10 pt-5">
        <p className="micro-label text-zinc-600">Learning mode</p>
        <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400">
          <span className="h-1.5 w-1.5 bg-sky-300" />
          Explore · Practise · Assess
        </div>
      </div>
    </nav>
  );
}
