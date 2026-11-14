// Generate the print edition from the same lesson, homework and assessment data as the site.
// Usage: node scripts/export-course-pdf.mjs --tex-only /tmp/coursebook.tex
//        node scripts/export-course-pdf.mjs public/course/website.pdf
// A complete XeLaTeX install is required. Set COURSE_XELATEX_FMT only for a custom format.
import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, writeFileSync, copyFileSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";

const require = createRequire(import.meta.url);
const ts = require("typescript");
require.extensions[".ts"] = (module, filename) => {
  const result = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: filename,
  });
  module._compile(result.outputText, filename);
};
const { conceptModules, finalExam, homeworkSets, quizzes, tests, videoLessons, formulaGroups } = require("../data/linesAndPlanesData.ts");
const { courseUnits } = require("../data/courseUnits.ts");
const { studyGuides } = require("../data/studyGuides.ts");
const { recordingUrls } = require("../data/videoRecordings.ts");
const base = process.env.COURSE_PUBLIC_URL || "https://mcv4u-lines-and-planes.hozantaxprivate.chatgpt.site";
const dataDir = fileURLToPath(new URL("../data/", import.meta.url));
const lessonFiles = process.env.COURSE_LESSON_FILES?.split(":") || ["written-chapter8.json", "written-chapter9.json"].map(file => join(dataDir, file));
const lessons = lessonFiles.flatMap(file => JSON.parse(readFileSync(file, "utf8")));
const ids = new Map(conceptModules.map(l => [l.section ?? l.index, l.id]));
const expected = courseUnits.flatMap(unit => unit.sections);
assert.deepEqual(lessons.map(l => l.section), expected, "Print lesson order must match the live course");
assert.deepEqual(Object.keys(studyGuides).sort(), [...expected].sort(), "Every lesson needs a study guide");
assert.deepEqual(homeworkSets.map(h => h.number), expected, "Every lesson must have a matching homework set");
assert.equal(videoLessons.length, 4);
assert.equal(quizzes.length, 4);
assert.equal(tests.length, 4);
assert.ok(finalExam.questions.length);
for (const item of [...quizzes, ...tests, finalExam]) {
  assert.deepEqual([...new Set(item.questions.flatMap(q => q.tags))].sort(), ["A","C","K","T"]);
  assert.ok(item.questions.every(q => q.steps?.length && q.rationale), item.id + " requires typed solutions");
}
for (const set of homeworkSets) assert.ok(set.problems.every(q => q.steps?.length && q.answer), set.id + " requires typed solutions");

const raw = String.raw;
const output = [];
const emit = (...lines) => output.push(...lines);
const symbols = { "\\": raw`\textbackslash{}`, "{": raw`\{`, "}": raw`\}`, "#": raw`\#`, "$": raw`\$`, "%": raw`\%`, "&": raw`\&`, "_": raw`\_`, "~": raw`\textasciitilde{}`, "^": raw`\textasciicircum{}` };
const normalize = s => String(s ?? "").replace(/[‐‑‒–−]/g,"-").replace(/—/g,", ").replace(/•/g,"").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,"");
const safe = s => normalize(s).replace(/[\\{}#$%&_~^]/g,c=>symbols[c]);
const mathNormalize = s => s
  .replace(/−/g,"-").replace(/×/g,raw`\times `).replace(/·/g,raw`\cdot `)
  .replace(/≠/g,raw`\ne `).replace(/≤/g,raw`\le `).replace(/≥/g,raw`\ge `)
  .replace(/\bR\\?\^([23])\b/g,raw`\mathbb R^$1`)
  .replace(/°/g,raw`^{\circ}`).replace(/²/g,"^{2}").replace(/³/g,"^{3}")
  .trim();
const markup = s => safe(s).replace(/\*\*(.*?)\*\*/gs,raw`\textbf{$1}`).replace(/(^|[\s(])\*([^*\n]+)\*(?=$|[\s.,;:)])/g,raw`$1\emph{$2}`);
function mixed(s) {
  const input = String(s ?? "");
  const re = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)|\$\$([\s\S]*?)\$\$|\$([^$\n]+)\$|\*\*([^*\n]+)\*\*/g;
  let last=0;
  let result="";
  for(const m of input.matchAll(re)) {
    result+=markup(input.slice(last,m.index));
    if(m[5]!==undefined) result+=raw`\textbf{`+mixed(m[5])+"}";
    else {
      const mText=mathNormalize(m[1]??m[2]??m[3]??m[4]);
      result+=(m[1]!==undefined||m[3]!==undefined) ? "\n\\DisplayMath{"+mText+"}\n" : "\\("+mText+"\\)";
    }
    last=m.index+m[0].length;
  }
  return result+markup(input.slice(last));
}
const url = (path,text) => raw`\href{`+base+path.replace(/#/g,raw`\#`)+ "}{" + safe(text) + "}";
const local = (id,text) => raw`\hyperref[`+id+ "]{" + safe(text) + "}";
const runin = (label,text) => raw`\textbf{`+safe(label)+"} "+mixed(text)+raw`\par`;
function questionPrompt(s) {
  const [setup,...parts] = s.split(/\s+(?=\([a-d]\)\s+[A-Z])/);
  const given = setup.trim().split(/\r?\n/).map(mixed).join(raw`\par `);
  return !parts.length ? given : given + raw`\par\begin{enumerate}[label=\textup{(\alph*)},topsep=2pt,itemsep=1pt]`
    + "\n" + parts.map(part=>raw`\item `+mixed(part.slice(3).trim())).join("\n") + "\n"+raw`\end{enumerate}`;
}
const key = id => id.replaceAll(".","-");
const tags = item => (item.tags ?? []).join(" / ");
const beginSection = (title, id) => emit(raw`\clearpage\section{`+safe(title)+"}"+(id?raw`\label{`+id+"}":""));
const sub = (title,id) => emit(raw`\subsection{`+safe(title)+"}"+(id?raw`\label{`+id+"}":""));
const subsub = title => emit(raw`\subsubsection*{`+safe(title)+"}");
function itemize(items) {
  emit(raw`\begin{itemize}`);
  for (const item of items) emit(raw`\item `+mixed(item));
  emit(raw`\end{itemize}`);
}
function steps(items) {
  emit(raw`\begin{enumerate}[label=\textcolor{accent}{\arabic*.}]`);
  for (const step of items) emit(raw`\item \textbf{`+safe(step.label)+".} "+mixed(step.text)+(step.math?"\n"+mixed(step.math):""));
  emit(raw`\end{enumerate}`);
}
function lessonBody(body) {
  for (const chunk of body.split(/(\$\$[\s\S]+?\$\$)/g)) {
    if (chunk.startsWith("$$")) { emit(mixed(chunk)); continue; }
    for (const para of chunk.trim().split(/\n\s*\n/).filter(Boolean)) {
      const lines=para.split("\n");
      if (lines.every(line=>/^\s*\d+\.\s/.test(line))) {
        emit(raw`\begin{enumerate}`);
        for (const line of lines) emit(raw`\item `+mixed(line.replace(/^\s*\d+\.\s+/,"")));
        emit(raw`\end{enumerate}`);
      } else if (lines.every(line=>/^\s*[-*]\s/.test(line))) {
        itemize(lines.map(line=>line.replace(/^\s*[-*]\s+/,"")));
      } else {
        emit(mixed(para),raw`\par`);
      }
    }
  }
}
emit(raw`\documentclass[a4paper,10pt]{article}
\usepackage{fontspec,amsmath,amssymb,xcolor,geometry,graphicx,needspace,enumitem,fancyhdr,titlesec,hyperref,tikz}
\setmainfont{DejaVu Serif}
\setsansfont{DejaVu Sans}
\geometry{top=21mm,bottom=18mm,left=20mm,right=20mm,headheight=18pt,headsep=5mm,footskip=11mm}
\definecolor{ink}{HTML}{172B3B}
\definecolor{accent}{HTML}{115B7A}
\definecolor{muted}{HTML}{4A5965}
\definecolor{pale}{HTML}{EEF5F7}
\definecolor{line}{HTML}{CADCE4}
\hypersetup{unicode=true,colorlinks=true,linkcolor=accent,urlcolor=accent,pdftitle={MCV4U Lines and Planes - Coursebook},pdfauthor={MCV4U teaching team},pdfsubject={Chapters 8 and 9}}
\color{ink}
\setlength{\parindent}{0pt}
\setlength{\parskip}{0.38em plus 0.12em}
\setlength{\emergencystretch}{2em}
\setlength{\abovedisplayskip}{4pt plus 2pt}
\setlength{\belowdisplayskip}{4pt plus 2pt}
\setlist[itemize]{leftmargin=1.35em,itemsep=1pt,topsep=3pt,parsep=1pt,label=\textcolor{accent}{\rule[.35ex]{4pt}{.7pt}}}
\setlist[enumerate]{leftmargin=1.55em,itemsep=2pt,topsep=3pt,parsep=1pt}
\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\sffamily\scriptsize\color{muted} MCV4U \enspace LINES AND PLANES}
\fancyhead[R]{\sffamily\scriptsize\color{muted} COURSEBOOK}
\fancyfoot[L]{\sffamily\scriptsize\color{muted} CHAPTERS 8 AND 9}
\fancyfoot[R]{\sffamily\scriptsize\color{muted} \thepage}
\renewcommand{\headrulewidth}{.35pt}
\renewcommand{\headrule}{\hbox to\headwidth{\color{line}\leaders\hrule height\headrulewidth\hfill}}
\titleformat{\section}{\raggedright\sffamily\bfseries\LARGE\color{ink}}{}{0pt}{}
\titleformat{\subsection}{\raggedright\sffamily\bfseries\Large\color{ink}}{}{0pt}{}
\titleformat{\subsubsection}{\sffamily\bfseries\normalsize\color{accent}}{}{0pt}{}
\titlespacing*{\section}{0pt}{0pt}{10pt}
\titlespacing*{\subsection}{0pt}{11pt plus 2pt}{5pt}
\titlespacing*{\subsubsection}{0pt}{8pt plus 1pt}{3pt}
\setcounter{tocdepth}{2}
\makeatletter
\renewcommand{\@pnumwidth}{2.1em}
\renewcommand{\@tocrmarg}{3.1em}
\renewcommand{\numberline}[1]{}
\renewcommand{\l@section}{\@dottedtocline{1}{0em}{0em}}
\renewcommand{\l@subsection}{\@dottedtocline{2}{1.4em}{0em}}
\makeatother
\setlength{\textfloatsep}{8pt}
\newsavebox{\displaybox}
\newcommand{\DisplayMath}[1]{\par\nobreak\vspace{2pt}\noindent\sbox{\displaybox}{$\displaystyle #1$}\hfill\ifdim\wd\displaybox>\linewidth\resizebox{\linewidth}{!}{\usebox{\displaybox}}\else\usebox{\displaybox}\fi\hfill\mbox{}\par\vspace{2pt}}
\newcommand{\Question}[2]{\Needspace{4\baselineskip}\vspace{3pt}\noindent{\sffamily\bfseries\color{accent}#1}\hfill{\sffamily\small\color{muted}#2}\par\nopagebreak[4]}
\newcommand{\Caption}[1]{\par{\sffamily\small\color{muted}#1}\par}
\newcommand{\Tagline}[1]{{\sffamily\bfseries\small\color{accent}#1}\par}
\newenvironment{Checkpoint}{\par\Needspace{6\baselineskip}\noindent\begin{minipage}{\linewidth}\hrule\vspace{5pt}}{\vspace{5pt}\hrule\end{minipage}\par}
\begin{document}
\thispagestyle{empty}
\vspace*{12mm}
\Tagline{MCV4U \enspace GRADE 12 CALCULUS AND VECTORS}
\vspace{3mm}
{\sffamily\bfseries\fontsize{39}{42}\selectfont Lines and Planes\par}
\vspace{3mm}
{\sffamily\Large\color{muted} Coursebook\par}
\vspace{5mm}
{\color{accent}\rule{\linewidth}{1.4pt}}\par
\vspace{5mm}
Lessons, practice questions, and worked solutions for Chapters 8 and 9.
\subsubsection*{Course sequence}
\begin{enumerate}[label=\textcolor{accent}{\arabic*.}]
\item Sections 8.1 to 8.3: equations of lines in two and three dimensions.
\item Sections 8.4 to 8.6: plane equations and sketches.
\item Sections 9.1 to 9.4: intersections and systems of equations.
\item Sections 9.5 and 9.6: shortest distances, parallel planes and skew lines.
\end{enumerate}
\subsubsection*{Assessment categories}
K: Knowledge and Understanding\par
A: Application\par
T: Thinking and Inquiry\par
C: Communication\par
\subsubsection*{Online tools and recordings}
`);
emit(url("","Open the website")+raw`\enspace `+url("/videos","Video lessons")+raw`\enspace `+url("/visualizer","3D visualizer")+raw`\enspace `+url("/calculator","Vector calculator")+raw`\par`,raw`\url{`+base+"}"+raw`\par`);
emit(raw`\vfill\Caption{The recording links open the website. Interactive tools and video playback require the live site.}
\clearpage
\tableofcontents`);

beginSection("Video lessons", "video-index");
for (const [i,v] of videoLessons.entries()) {
  subsub("Video " +(i+1)+ "  " + v.title);
  emit(raw`\Tagline{` + safe("Sections "+v.sections.join(", ")+"   /   "+v.duration)+"}");
  emit(mixed(v.takeaways.join(" ")));
  emit(url("/videos#"+v.id,"Watch video "+(i+1))+raw`\par`);
}

const diagrams = {
  "8.1": raw`\begin{tikzpicture}[scale=.67,>=latex, every node/.style={font=\small\sffamily}]
\draw[step=1,very thin,line] (-1,-3) grid (7,5);
\draw[->,muted] (-1.15,0)--(7.2,0) node[right]{$x$};
\draw[->,muted] (0,-3.15)--(0,5.25) node[above]{$y$};
\foreach \x in {-1,1,2,3,4,5,6,7}{\node[muted,below] at (\x,0){\scriptsize\x};}
\foreach \y in {-3,-2,-1,1,2,3,4,5}{\node[muted,left] at (0,\y){\scriptsize\y};}
\draw[<->,line width=1.1pt,accent] ({1/3},5)--({17/3},-3);
\draw[->,line width=1.8pt,ink] (1,4)--(3,1);
\fill[accent] (1,4) circle (2.6pt) node[above right,fill=white,inner sep=2pt]{$A(1,4)$};
\fill[accent] (3,1) circle (2.6pt) node[above right,fill=white,inner sep=2pt]{$B(3,1)$};
\fill[accent] (5,-2) circle (2.6pt) node[above right,fill=white,inner sep=2pt]{$P(5,-2)$};
\end{tikzpicture}`,
  "8.6": raw`\begin{tikzpicture}[scale=.78,>=latex, x={(1cm,-.32cm)},y={(-.85cm,-.42cm)},z={(0cm,.91cm)}, every node/.style={font=\small\sffamily}]
\coordinate (A) at (2,0,0);
\coordinate (B) at (0,-4,0);
\coordinate (C) at (0,0,4);
\filldraw[fill=pale,draw=accent,line width=1.0pt] (A)--(B)--(C)--cycle;
\draw[->,muted] (-1,0,0)--(3.35,0,0) node[right]{$x$};
\draw[dashed,muted] (0,-4.65,0)--(0,0,0);
\draw[->,muted] (0,0,0)--(0,2.6,0) node[left]{$y$};
\draw[->,muted] (0,0,-.75)--(0,0,4.8) node[above]{$z$};
\fill[ink] (A) circle (2.5pt) node[below]{$(2,0,0)$};
\fill[ink] (B) circle (2.5pt) node[right]{$(0,-4,0)$};
\fill[ink] (C) circle (2.5pt) node[left]{$(0,0,4)$};
\node[below left] at (0,0,0){$O$};
\end{tikzpicture}`,
  "9.3": raw`\begin{tikzpicture}[scale=.84,>=latex,x={(1.4cm,-.1cm)},y={(0cm,.65cm)},z={(-.4cm,-.1cm)},every node/.style={font=\small\sffamily}]
\filldraw[fill=pale,draw=accent] (4,-1,0)--(0,-1,4)--(0,3,0)--(4,3,-4)--cycle;
\filldraw[fill=white,fill opacity=.68,draw=muted] (4,-1,-4)--(0,-1,0)--(0,3,4)--(4,3,0)--cycle;
\draw[<->,accent,line width=1.3pt] (-.4,1,2.4)--(4.4,1,-2.4) node[right]{$L$};
\fill[ink] (2,1,0) circle (2.5pt) node[above,fill=white,inner sep=2pt]{$(2,1,0)$};
\node[accent] at (1,2.6,-.6){$x+y+z=3$};
\node[muted] at (2.6,-.55,-2.15){$x-y+z=1$};
\end{tikzpicture}`,
  "9.5": raw`\begin{tikzpicture}[scale=.67,>=latex,every node/.style={font=\small\sffamily}]
\draw[step=1,very thin,line] (-7,-1) grid (2,6);
\draw[->,muted] (-7.15,0)--(2.2,0) node[right]{$x$};
\draw[->,muted] (0,-1.15)--(0,6.2) node[above]{$y$};
\foreach \x in {-7,-6,-5,-4,-3,-2,-1,1,2}{\node[muted,below] at (\x,0){\scriptsize\x};}
\foreach \y in {-1,1,2,3,4,5,6}{\node[muted,right] at (0,\y){\scriptsize\y};}
\coordinate (H) at ({-69/34},{55/34});
\coordinate (P) at (-6,4);
\draw[<->,muted,line width=1.1pt] (-3.6,-1)--(.6,6) node[above right]{$L$};
\draw[accent,line width=1.5pt] (H)--(P) node[midway,above right]{$d$};
\draw[accent] ([shift={(.1852,.3087)}]H)--([shift={(-.1235,.4939)}]H)--([shift={(-.3087,.1852)}]H);
\fill[ink] (H) circle (2.5pt) node[below right,fill=white,inner sep=2pt]{$H$};
\fill[accent] (P) circle (2.5pt) node[above,fill=white,inner sep=2pt]{$P(-6,4)$};
\end{tikzpicture}`,
};
const captions = {
  "8.1": raw`On this equal-scale grid, $t=0$ gives $A$, $t=1$ gives $B$, and $t=2$ gives $P$. Each step moves 2 units right and 3 units down.`,
  "8.6": raw`The three intercepts orient the plane $2x-y+z=4$. The dashed axis segment locates the negative $y$ intercept. The triangle is a patch of the plane.`,
  "9.3": raw`The projected patches meet at the line $y=1$, $x+z=2$, which passes through $(2,1,0)$.`,
  "9.5": raw`The segment from $P$ to $H$ is perpendicular to $5x-3y+15=0$. It gives the shortest distance, $27/\sqrt{34}$.`,
};
const diagramAfterBlock = { "8.1":1, "8.6":1, "9.3":1, "9.5":1 };

const O=[0,0,0];
function interceptSketch(x,y,z) {
  const points=[[x,0,0],[0,y,0],[0,0,z]];
  return {vertices:points, labels:points, caption:"The triangle marks three intercepts. The plane itself is infinite."};
}
function projectionSketch(x,y,z) {
  return {construction:[O,[x,0,0],[x,y,0],[x,y,z]],labels:[[x,y,0],[x,y,z]],caption:"The vertical segment connects the point to its projection onto the xy-plane."};
}
const solutionSketches = {
  "hw-8-6-p1": projectionSketch(2,-1,3),
  "hw-8-6-p2": projectionSketch(-1,2,-2),
  "hw-8-6-p3": interceptSketch(3,2,1),
  "hw-8-6-p5": {vertices:[[2,-1,-1],[0,1,-1],[-2,1,1],[0,-1,1]], construction:[[1,-1,0],O,[1,0,-1]], labels:[[1,-1,0],[1,0,-1]], caption:"Two independent trace directions through the origin orient the plane x + y + z = 0."},
  "q-82-w4": interceptSketch(6,4,2),
  "t-82-w4": interceptSketch(12,8,4),
  "fx-20": {vertices:[[3,-1,0],[3,2,0],[0,2,2],[0,-1,2]],construction:[[3,0,0],[0,0,2]],labels:[[3,0,0],[0,0,2]],caption:"The patch extends parallel to the y-axis. There is no y-axis intercept."},
};
function writeSketch(id) {
  const sketch=solutionSketches[id];
  if(!sketch)return;
  const {vertices=[],construction=[],labels=[],caption}=sketch;
  const a=Math.max(3,...[...vertices,...construction,...labels].flat().map(Math.abs))*1.2;
  const project=([x,y,z])=>"("+((1.02*x-.83*y)*2.6/a).toFixed(3)+","+((z-.35*x-.56*y)*1.9/a).toFixed(3)+")";
  const pointString=points=>points.map(project).join("--");
  emit(raw`\Needspace{108pt}\begin{center}\begin{tikzpicture}[>=latex,every node/.style={font=\small\sffamily}]`);
  for(const [i,name] of ["x","y","z"].entries()){
    const start=[0,0,0], end=[0,0,0]; start[i]=-.78*a;end[i]=a;
    emit(raw`\draw[->,muted] `+project(start)+"--"+project(end)+" node["+(i===1?"left":i===2?"above":"right")+"]{$"+name+"$};");
  }
  if(vertices.length)emit(raw`\filldraw[fill=pale,fill opacity=.72,draw=accent] `+pointString(vertices)+"--cycle;");
  if(construction.length)emit(raw`\draw[dashed,accent,line width=.9pt] `+pointString(construction)+";");
  emit(raw`\node[below] at (0,0){$O$};`);
  for(const [i,p] of labels.entries())emit(raw`\fill[ink] `+project(p)+" circle (2pt) node[fill=white,inner sep=1.5pt,"+(i===1?"above left":"above right")+"]{$("+p.join(",")+")$};");
  emit(raw`\end{tikzpicture}\end{center}\Caption{`+safe(caption)+"}");
}

for (const chapter of [8,9]) {
  beginSection(chapter===8 ? "Chapter 8: equations of lines and planes" : "Chapter 9: intersections and distances","chapter-"+chapter);
  for (const lesson of lessons.filter(x=>x.section.startsWith(chapter+"."))) {
    if (lesson.section !== chapter+".1") emit(raw`\clearpage`);
    sub(lesson.section+"  "+lesson.title, "lesson-"+key(lesson.section));
    const guide=studyGuides[lesson.section];
    const recording = videoLessons.find(v => v.sections?.includes(lesson.section));
    const timestamp = recording?.timestamps.find(t => t.label.startsWith(lesson.section+" "));
    const lessonPath = "/lessons/"+ids.get(lesson.section);
    const lessonLinks = [
      ...(timestamp ? [url(lessonPath+"#lesson-video","Watch at "+timestamp.time)] : []),
      url(lessonPath+"#understand","Read online"),
      local("hw-"+key(lesson.section),"Homework"),
    ];
    emit(lessonLinks.join(raw`\quad `)+raw`\par`);
    emit(mixed(guide.hook),raw`\par`);
    let checkpointAfter = lesson.blocks.findIndex(b => /^worked example/i.test(b.title));
    if (checkpointAfter < 0) checkpointAfter = Math.min(1, lesson.blocks.length - 1);
    for (const [i,block] of lesson.blocks.entries()) {
      subsub(block.title);
      lessonBody(block.body);
      if (i === 0) {
        subsub("The method");
        steps(guide.steps.map(step=>({ label:step.title, text:step.body })));
      }
      if (i === diagramAfterBlock[lesson.section]) {
        const diagramHeight=lesson.section==="8.1"||lesson.section==="9.5" ? 188 : 129;
        emit(raw`\Needspace{`+diagramHeight+raw`pt}\begin{center}`, diagrams[lesson.section], raw`\end{center}\Caption{`+mixed(captions[lesson.section])+"}");
      }
      if (i === checkpointAfter) {
        emit(raw`\begin{Checkpoint}\Tagline{Try it yourself}`,mixed(guide.checkpoint.prompt)+raw`\par`,local("check-"+key(lesson.section),"Check your working after you try")+raw`\par\end{Checkpoint}`);
      }
    }
    subsub("What to remember"); itemize(lesson.summary);
    const set = homeworkSets.find(x=>x.number===lesson.section);
    emit(raw`\Needspace{10\baselineskip}`);
    sub("Homework "+set.number, "hw-"+key(set.number));
    emit(mixed(set.focus),url("/practice?section="+set.number,"Open this homework online")+raw`\par`);
    const video = courseUnits.find(unit=>unit.sections.includes(set.number));
    for (const [i,q] of set.problems.entries()) {
      emit(raw`\Question{`+safe((i+1)+". "+q.title)+"}{"+safe(tags(q))+"}",questionPrompt(q.prompt));
      if (q.review && video && recordingUrls[video.videoId]) {
        const [minutes,seconds]=q.review.time.split(":").map(Number);
        const reviewPath=recordingUrls[video.videoId]+"#t="+(minutes*60+seconds);
        emit(raw`\Caption{`+url(reviewPath,"Review at "+q.review.time)+": "+safe(q.review.topic)+"}");
      }
    }
    emit(raw`\Needspace{6\baselineskip}\phantomsection\label{check-`+key(lesson.section)+"}");
    subsub("Try it solution");
    emit(mixed(guide.checkpoint.answer)+raw`\par`);
    subsub("Worked homework solutions");
    for (const [i,q] of set.problems.entries()) {
      emit(raw`\Question{`+safe((i+1)+". "+q.title)+"}{}",runin("Hint:",q.hint));
      steps(q.steps);
      emit(runin("Answer:",q.answer));
      writeSketch(q.id);
    }
  }
}

function writeAssessment(assessment, route, unitIndex) {
  if (unitIndex > 0) emit(raw`\clearpage`);
  const isExam=assessment.kind==="exam";
  const unit = !isExam && courseUnits[unitIndex];
  const short = isExam ? "Final examination" : (assessment.kind==="test" ? "Unit test " : "Quiz ") + (assessment.number || "");
  const title=assessment.title || short;
  sub(title, "assessment-"+assessment.id);
  const qList=assessment.questions;
  const total=qList.reduce((sum,q)=>sum+(q.marks||1),0);
  emit(raw`\Tagline{`+safe(total+" marks")+(unit?safe("   /   Sections "+unit.sections.join(", ")):"")+"}",url(route+(unit?"?unit="+unit.id:""),"Open assessment online")+raw`\par`);
  if(assessment.kind!=="quiz") {
    emit(raw`\vspace{4pt}\noindent\textbf{Name:}\enspace\rule{55mm}{.35pt}\hfill\textbf{Date:}\enspace\rule{35mm}{.35pt}\par`);
  }
  subsub("Instructions");
  itemize([
    "Answer every question. Marks are shown beside each question.",
    "Show your working for written responses and label any sketches.",
    "Give exact values unless the question asks for an approximation.",
  ]);
  let lastSection="";
  for(const [i,q] of qList.entries()){
    if(q.section&&q.section!==lastSection){subsub(q.section);lastSection=q.section;}
    emit(raw`\Question{`+safe("Question "+(i+1))+"}{"+safe((q.marks||1)+" "+((q.marks||1)===1?"mark":"marks")+"   /   "+tags(q))+"}",questionPrompt(q.prompt));
    if(q.kind!=="written"){
      emit(raw`\begin{enumerate}[label=\Alph*.,topsep=1pt,itemsep=0pt]`);
      for(const option of q.options)emit(raw`\item `+mixed(option));
      emit(raw`\end{enumerate}`);
    }
  }
  emit(raw`\clearpage`);
  sub("Worked solutions: "+short,"solution-"+assessment.id);
  for(const [i,q] of qList.entries()){
    emit(raw`\Question{`+safe("Question "+(i+1))+"}{"+safe((q.marks||1)+" "+((q.marks||1)===1?"mark":"marks")+"   /   "+tags(q))+"}");
    if(q.kind!=="written")emit(runin("Correct choice "+String.fromCharCode(65+q.correctIndex)+".",q.options[q.correctIndex]));
    emit(mixed(q.rationale)); steps(q.steps);
    writeSketch(q.id);
    if(q.kind==="written"){
      emit(runin("Model response.",q.sampleAnswer),raw`\textbf{Marking criteria}\par`);
      itemize(q.criteria.map((criterion,j)=>q.criteriaMarks?.[j]&&!/\(\d+\s+marks?\)/i.test(criterion)?criterion+" ("+q.criteriaMarks[j]+(q.criteriaMarks[j]===1?" mark)":" marks)"):criterion));
    }
  }
}
beginSection("Quizzes","quizzes");
quizzes.forEach((assessment,index)=>writeAssessment(assessment,"/assessments",index));
beginSection("Unit tests","tests");
tests.forEach((assessment,index)=>writeAssessment(assessment,"/tests",index));
beginSection("Final examination","exam");
writeAssessment(finalExam,"/exam");

beginSection("Formula reference","formulas");
for(const group of formulaGroups){
  subsub(group.title);
  for(const f of group.formulas)emit(raw`\Needspace{3\baselineskip}`,runin(f.label+".",f.note),mixed(f.math));
}
emit(raw`\Needspace{5\baselineskip}`);
subsub("Classroom references");
itemize(["Chapter 8: Equations of Lines and Planes, Sections 8.1 to 8.6.", "Chapter 9: Relationships Between Points, Lines and Planes, Sections 9.1 to 9.6.", "MCV4U Course Culminating Task Guidelines, July 2026. " + "See the website resources for more."]);
emit(raw`\end{document}`);

const tex=output.join("\n");
const [arg,target]=process.argv.slice(2);
if(arg==="--tex-only"){
  assert.ok(target, "--tex-only requires an output path");
  writeFileSync(resolve(target), tex);
}else{
  const dest=resolve(arg||"public/course/website.pdf");
  const temp=mkdtempSync(join(tmpdir(),"mcv4u-course-"));
  const texfile=join(temp,"coursebook.tex");
  writeFileSync(texfile,tex);
  const cmd=["-no-shell-escape","-interaction=nonstopmode","-halt-on-error","-file-line-error"];
  if(process.env.COURSE_XELATEX_FMT)cmd.push("-fmt",process.env.COURSE_XELATEX_FMT);
  for(let pass=0;pass<3;pass++){
    const done=spawnSync("xelatex",[...cmd,"coursebook.tex"],{cwd:temp,encoding:"utf8",maxBuffer:12*1024*1024});
    if(done.status!==0){
      console.error(done.stdout?.slice(-12000)||done.stderr||done.error, "\nCompilation logs:",temp);
      process.exit(done.status||1);
    }
  }
  mkdirSync(dirname(dest),{recursive:true});
  copyFileSync(join(temp,"coursebook.pdf"),dest);
  if(process.env.COURSE_KEEP_TEX==="1") console.log("Compilation files:",temp);
  else rmSync(temp,{recursive:true,force:true});
  console.log("Exported "+lessons.length+" lessons, "+homeworkSets.reduce((sum,h)=>sum+h.problems.length,0)+" homework problems, and "+[...quizzes,...tests,finalExam].reduce((sum,a)=>sum+a.questions.length,0)+" assessment questions to "+dest);
}

