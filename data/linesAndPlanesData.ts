import { classroomLessons } from "./classroomLessons";
import { recordingUrls } from "./videoRecordings";

export type KATCCategory = "K" | "A" | "T" | "C";

export type LearningObjective = {
  code: string;
  title: string;
  description: string;
};

export type EquationForm = {
  label: string;
  math: string;
  note: string;
};

export type SolutionStep = {
  label: string;
  text: string;
  math?: string;
};

export type ConceptModule = {
  id: string;
  index: string;
  section?: string;
  chapter?: 8 | 9;
  sourcePages?: number[];
  sourceNote?: string;
  homeworkReference?: string;
  videoGroup?: "video-lines" | "video-planes" | "video-intersections" | "video-distances";
  title: string;
  kicker: string;
  summary: string;
  instruction: {
    idea: string;
    steps: string[];
    commonMistake: string;
  };
  equations: EquationForm[];
  keyChecks: string[];
  workedExample: {
    prompt: string;
    steps: SolutionStep[];
    conclusion: string;
  };
};

export type VideoTimestamp = {
  time: string;
  seconds: number;
  label: string;
};

export type VideoLesson = {
  id: string;
  number: string;
  title: string;
  description: string;
  youtubeId: string;
  sourceUrl: string;
  creator: string;
  duration: string;
  sections?: string[];
  videoUrl?: string;
  status?: "planned" | "ready";
  timestamps: VideoTimestamp[];
  takeaways: string[];
};

export type HomeworkProblem = {
  id: string;
  title: string;
  prompt: string;
  tags: KATCCategory[];
  hint: string;
  steps: SolutionStep[];
  answer: string;
};

export type HomeworkSet = {
  id: string;
  number: string;
  title: string;
  focus: string;
  estimatedMinutes: number;
  problems: HomeworkProblem[];
};

type AssessmentQuestionBase = {
  id: string;
  prompt: string;
  tags: KATCCategory[];
  marks?: number;
  section?: string;
  rationale: string;
  steps: SolutionStep[];
};

export type AssessmentQuestion = AssessmentQuestionBase & (
  | {
      kind?: "multiple-choice";
      options: string[];
      correctIndex: number;
    }
  | {
      kind: "written";
      criteria: string[];
      sampleAnswer: string;
    }
);

export type Assessment = {
  id: string;
  number: string;
  title: string;
  description: string;
  mode: "quiz" | "exam";
  kind?: "quiz" | "test" | "exam";
  timeLimit: string;
  instructions?: string[];
  questions: AssessmentQuestion[];
};

export type FormulaGroup = {
  title: string;
  formulas: Array<{ label: string; math: string; note: string }>;
};

export const courseMeta = {
  courseCode: "MCV4U",
  title: "Lines and Planes",
  eyebrow: "Grade 12 Calculus & Vectors",
  summary:
    "Build geometric intuition, translate among equation forms, and solve spatial systems with confidence.",
} as const;

export const learningObjectives: LearningObjective[] = [
  {
    code: "H.01",
    title: "Represent",
    description: "Move fluently among vector, parametric, scalar, and symmetric forms.",
  },
  {
    code: "H.02",
    title: "Visualize",
    description: "Sketch lines, planes, points, direction vectors, and normal vectors in three-space.",
  },
  {
    code: "H.03",
    title: "Resolve",
    description: "Classify and calculate intersections, distances, and system consistency.",
  },
  {
    code: "H.04",
    title: "Communicate",
    description: "Justify every geometric conclusion with complete vector reasoning.",
  },
];

export const conceptModules: ConceptModule[] = classroomLessons;

export const videoLessons: VideoLesson[] = [
  {
    id: "video-lines",
    number: "01",
    title: "Line equations in two and three dimensions",
    description: "Sections 8.1, 8.2, 8.3",
    youtubeId: "",
    videoUrl: recordingUrls["video-lines"],
    sourceUrl: recordingUrls["video-lines"],
    creator: "The teaching team",
    status: recordingUrls["video-lines"] ? "ready" : "planned",
    duration: "12 mins planned",
    sections: ["8.1","8.2","8.3"],
    timestamps: [{"time":"00:00","seconds":0,"label":"A point and a direction"},{"time":"00:45","seconds":45,"label":"Build a direction from two points"},{"time":"02:15","seconds":135,"label":"Vector and parametric forms"},{"time":"03:45","seconds":225,"label":"Convert to Cartesian form"},{"time":"05:45","seconds":345,"label":"Equivalent lines and perpendicularity"},{"time":"07:00","seconds":420,"label":"Lines in three dimensions"},{"time":"09:30","seconds":570,"label":"Symmetric form and point membership"},{"time":"11:15","seconds":675,"label":"Review and practice"}],
    takeaways: ["Use one anchor and a nonzero direction to describe a line.","Convert between vector, parametric, Cartesian and symmetric forms where applicable.","Handle zero direction components and verify points with one shared parameter."],
  },
  {
    id: "video-planes",
    number: "02",
    title: "Plane equations and sketches",
    description: "Sections 8.4, 8.5, 8.6",
    youtubeId: "",
    videoUrl: recordingUrls["video-planes"],
    sourceUrl: recordingUrls["video-planes"],
    creator: "The teaching team",
    status: recordingUrls["video-planes"] ? "ready" : "planned",
    duration: "12 mins planned",
    sections: ["8.4","8.5","8.6"],
    timestamps: [{"time":"00:00","seconds":0,"label":"A plane and two independent directions"},{"time":"01:00","seconds":60,"label":"Construct two span vectors"},{"time":"03:00","seconds":180,"label":"Vector and parametric forms"},{"time":"04:30","seconds":270,"label":"Normal and Cartesian equation"},{"time":"06:30","seconds":390,"label":"Plane definitions and angles"},{"time":"08:00","seconds":480,"label":"Sketch using intercepts"},{"time":"10:00","seconds":600,"label":"Missing intercepts and free coordinates"},{"time":"11:15","seconds":675,"label":"Review and practice"}],
    takeaways: ["Construct a plane from valid geometric information.","Connect independent spans and a perpendicular normal to the equation forms.","Sketch intercepts and interpret a missing variable without inventing an intercept."],
  },
  {
    id: "video-intersections",
    number: "03",
    title: "Intersections and systems",
    description: "Sections 9.1, 9.2, 9.3, 9.4",
    youtubeId: "",
    videoUrl: recordingUrls["video-intersections"],
    sourceUrl: recordingUrls["video-intersections"],
    creator: "The teaching team",
    status: recordingUrls["video-intersections"] ? "ready" : "planned",
    duration: "15 mins planned",
    sections: ["9.1","9.2","9.3","9.4"],
    timestamps: [{"time":"00:00","seconds":0,"label":"Intersection as a shared solution"},{"time":"00:45","seconds":45,"label":"Line and plane intersection"},{"time":"03:00","seconds":180,"label":"Parallel and contained line cases"},{"time":"04:15","seconds":255,"label":"Two lines and skew relationships"},{"time":"06:00","seconds":360,"label":"Elimination and consistent systems"},{"time":"08:15","seconds":495,"label":"Intersection of two planes"},{"time":"10:30","seconds":630,"label":"Intersection of three planes"},{"time":"13:15","seconds":795,"label":"Check a redundant equation"},{"time":"14:15","seconds":855,"label":"Review and practice"}],
    takeaways: ["Classify line and plane relationships by solving and checking all coordinates.","Use elimination to distinguish unique, infinite and inconsistent solution sets.","Interpret the common solution of two or three plane equations geometrically."],
  },
  {
    id: "video-distances",
    number: "04",
    title: "Shortest distance to lines and planes",
    description: "Sections 9.5, 9.6",
    youtubeId: "",
    videoUrl: recordingUrls["video-distances"],
    sourceUrl: recordingUrls["video-distances"],
    creator: "The teaching team",
    status: recordingUrls["video-distances"] ? "ready" : "planned",
    duration: "10 mins planned",
    sections: ["9.5","9.6"],
    timestamps: [{"time":"00:00","seconds":0,"label":"Why the shortest path is perpendicular"},{"time":"01:00","seconds":60,"label":"Point to a line in two dimensions"},{"time":"03:00","seconds":180,"label":"Verify the perpendicular foot"},{"time":"04:00","seconds":240,"label":"Point to a line in three dimensions"},{"time":"06:15","seconds":375,"label":"Point to a plane"},{"time":"08:15","seconds":495,"label":"Zero distance and equivalent equations"},{"time":"09:15","seconds":555,"label":"Choose the method and practise"}],
    takeaways: ["Choose the distance method for the object and dimension.","Keep radical results exact before giving a decimal approximation.","Verify that a perpendicular foot lies on the target line or plane."],
  },
];

const originalHomeworkSets: HomeworkSet[] = [
  {
    id: "homework-lines",
    number: "01",
    title: "Line representations",
    focus: "Vector, parametric, symmetric, and scalar forms",
    estimatedMinutes: 25,
    problems: [
      {
        id: "hw1-p1",
        title: "Through two points",
        prompt: "Write the line through P(2,-1,3) and Q(-1,5,1) in vector, parametric, and symmetric form.",
        tags: ["K", "A"],
        hint: "Start with Q-P to create a direction vector.",
        steps: [
          { label: "Direction", text: "Subtract the points.", math: String.raw`\[\vec d=Q-P=(-3,6,-2)\]` },
          { label: "Vector form", text: "Anchor the line at P.", math: String.raw`\[\vec r=(2,-1,3)+t(-3,6,-2)\]` },
          { label: "Parametric form", text: "Read the three components.", math: String.raw`\[x=2-3t,\quad y=-1+6t,\quad z=3-2t\]` },
          { label: "Symmetric form", text: "Solve each coordinate for t.", math: String.raw`\[\frac{x-2}{-3}=\frac{y+1}{6}=\frac{z-3}{-2}\]` },
        ],
        answer: String.raw`\(\vec r=(2,-1,3)+t(-3,6,-2)\), with the corresponding forms shown above.`,
      },
      {
        id: "hw1-p2",
        title: "Scalar to vector in R²",
        prompt: "Convert 2x-3y+6=0 into a vector equation and symmetric equation of the line.",
        tags: ["K", "T"],
        hint: "A direction vector is perpendicular to the scalar line's normal (2,-3).",
        steps: [
          { label: "Direction", text: "Rotate the normal by 90°.", math: String.raw`\[\vec n=(2,-3)\Rightarrow \vec d=(3,2),\quad \vec n\cdot\vec d=0\]` },
          { label: "Anchor", text: "Set x=0 and solve for y.", math: String.raw`\[-3y+6=0\Rightarrow y=2\Rightarrow P=(0,2)\]` },
          { label: "Write both forms", text: "Use P and d.", math: String.raw`\[\vec r=(0,2)+t(3,2),\qquad \frac{x}{3}=\frac{y-2}{2}\]` },
        ],
        answer: String.raw`\(\vec r=(0,2)+t(3,2)\) and \(x/3=(y-2)/2\).`,
      },
      {
        id: "hw1-p3",
        title: "Membership test",
        prompt: "Determine whether S(5,-3,6) lies on r=(1,1,2)+t(2,-1,1). Justify using a shared parameter.",
        tags: ["A", "C"],
        hint: "Solve for t using one coordinate, then check the other two.",
        steps: [
          { label: "Use x", text: "Solve the x-coordinate equation.", math: String.raw`\[5=1+2t\Rightarrow t=2\]` },
          { label: "Check y", text: "Evaluate the line's y-coordinate at t=2.", math: String.raw`\[y=1-2=-1\ne-3\]` },
          { label: "Conclude", text: "The same parameter does not reproduce every coordinate.", math: String.raw`\[S\notin L\]` },
        ],
        answer: "No. The parameter forced by x gives y=-1, not y=-3.",
      },
      {
        id: "hw1-p4",
        title: "Cartesian line in R³",
        prompt: "Find a vector equation for the line formed by x+y+z=4 and x-y+z=2.",
        tags: ["A", "T"],
        hint: "Eliminate one variable, choose a free parameter, then separate the constant and parameter parts.",
        steps: [
          { label: "Eliminate", text: "Subtract the second plane from the first.", math: String.raw`\[2y=2\Rightarrow y=1\]` },
          { label: "Choose a parameter", text: "Both equations now give x+z=3. Let z=t.", math: String.raw`\[x=3-t,\quad y=1,\quad z=t\]` },
          { label: "Write vector form", text: "Separate the fixed point and direction.", math: String.raw`\[\vec r=(3,1,0)+t(-1,0,1)\]` },
        ],
        answer: String.raw`\(\vec r=(3,1,0)+t(-1,0,1)\).`,
      },
    ],
  },
  {
    id: "homework-planes",
    number: "02",
    title: "Building planes",
    focus: "Point-normal, three-point, and line-point definitions",
    estimatedMinutes: 30,
    problems: [
      {
        id: "hw2-p1",
        title: "Point and normal",
        prompt: "Find a Cartesian equation of the plane through P(1,2,-1) with normal n=(2,-1,3).",
        tags: ["K", "A"],
        hint: "Use n · (r-P)=0.",
        steps: [
          { label: "Point-normal form", text: "Insert the given point and normal.", math: String.raw`\[2(x-1)-(y-2)+3(z+1)=0\]` },
          { label: "Expand", text: "Distribute and combine constants.", math: String.raw`\[2x-y+3z+3=0\]` },
          { label: "Verify", text: "Substitute P.", math: String.raw`\[2(1)-2+3(-1)+3=0\]` },
        ],
        answer: String.raw`\(2x-y+3z+3=0\).`,
      },
      {
        id: "hw2-p2",
        title: "Three non-collinear points",
        prompt: "Find the plane through A(1,0,0), B(0,1,0), and C(0,0,2).",
        tags: ["A", "T"],
        hint: "Create AB and AC, then take their cross product.",
        steps: [
          { label: "Span vectors", text: "Form two directions from A.", math: String.raw`\[\overrightarrow{AB}=(-1,1,0),\quad \overrightarrow{AC}=(-1,0,2)\]` },
          { label: "Normal", text: "Cross the span vectors.", math: String.raw`\[\overrightarrow{AB}\times\overrightarrow{AC}=(2,2,1)\]` },
          { label: "Scalar equation", text: "Use A in point-normal form.", math: String.raw`\[2(x-1)+2y+z=0\Rightarrow 2x+2y+z=2\]` },
        ],
        answer: String.raw`\(2x+2y+z=2\).`,
      },
      {
        id: "hw2-p3",
        title: "A line and an external point",
        prompt: "Find the plane containing r=(1,0,2)+t(1,1,0) and the point P(0,1,3).",
        tags: ["T", "C"],
        hint: "Use the line direction and the vector from its anchor to P as two spans.",
        steps: [
          { label: "Second span", text: "Connect the line anchor A to P.", math: String.raw`\[\overrightarrow{AP}=(-1,1,1)\]` },
          { label: "Normal", text: "Cross the line direction with AP.", math: String.raw`\[(1,1,0)\times(-1,1,1)=(1,-1,2)\]` },
          { label: "Plane equation", text: "Use A=(1,0,2).", math: String.raw`\[(x-1)-y+2(z-2)=0\Rightarrow x-y+2z=5\]` },
        ],
        answer: String.raw`\(x-y+2z=5\).`,
      },
      {
        id: "hw2-p4",
        title: "Two intersecting lines",
        prompt: "Two lines intersect at P(2,1,0) and have directions d₁=(1,0,1) and d₂=(0,2,-1). Find their plane.",
        tags: ["A", "T", "C"],
        hint: "The two line directions are spanning vectors. Cross them to find a normal.",
        steps: [
          { label: "Find a normal", text: "Cross the two directions.", math: String.raw`\[(1,0,1)\times(0,2,-1)=(-2,1,2)\]` },
          { label: "Use the intersection point", text: "Build point-normal form at P.", math: String.raw`\[-2(x-2)+(y-1)+2z=0\]` },
          { label: "Simplify", text: "Collect the constant terms.", math: String.raw`\[-2x+y+2z=-3\]` },
        ],
        answer: String.raw`\(-2x+y+2z=-3\).`,
      },
    ],
  },
  {
    id: "homework-intersections",
    number: "03",
    title: "Intersection systems",
    focus: "Line-plane and plane-plane relationships",
    estimatedMinutes: 30,
    problems: [
      {
        id: "hw3-p1",
        title: "Line through a plane",
        prompt: "Find the intersection of r=(1,0,2)+t(1,2,-1) and x+y+z=5.",
        tags: ["A"],
        hint: "Substitute the line's three parametric coordinates into the plane.",
        steps: [
          { label: "Coordinates", text: "Write the parametric line.", math: String.raw`\[x=1+t,\quad y=2t,\quad z=2-t\]` },
          { label: "Solve parameter", text: "Substitute into x+y+z=5.", math: String.raw`\[3+2t=5\Rightarrow t=1\]` },
          { label: "Intersection", text: "Evaluate the line at t=1.", math: String.raw`\[P=(2,2,1)\]` },
        ],
        answer: "One intersection at (2,2,1).",
      },
      {
        id: "hw3-p2",
        title: "Two planes",
        prompt: "Find a vector equation for the intersection of x+y+z=3 and x-y+z=1.",
        tags: ["A", "T"],
        hint: "Subtract the equations, then let one remaining variable be a parameter.",
        steps: [
          { label: "Eliminate", text: "Subtract the second plane from the first.", math: String.raw`\[2y=2\Rightarrow y=1\]` },
          { label: "Free variable", text: "Both equations now give x+z=2. Let z=t.", math: String.raw`\[x=2-t,\quad y=1,\quad z=t\]` },
          { label: "Vector form", text: "Separate constants and parameter coefficients.", math: String.raw`\[\vec r=(2,1,0)+t(-1,0,1)\]` },
        ],
        answer: String.raw`\(\vec r=(2,1,0)+t(-1,0,1)\).`,
      },
      {
        id: "hw3-p3",
        title: "Infinite intersections",
        prompt: "Classify the relationship between r=(0,1,2)+t(1,-1,2) and the plane x+y=1.",
        tags: ["T", "C"],
        hint: "Check n · d and whether the line anchor lies in the plane.",
        steps: [
          { label: "Parallel test", text: "The plane normal is n=(1,1,0).", math: String.raw`\[\vec n\cdot\vec d=(1,1,0)\cdot(1,-1,2)=0\]` },
          { label: "Anchor test", text: "Substitute the anchor (0,1,2).", math: String.raw`\[0+1=1\]` },
          { label: "Classify", text: "A parallel line with one point in the plane is entirely contained in it.", math: String.raw`\[L\subset\Pi\]` },
        ],
        answer: "The line lies in the plane, so there are infinitely many intersection points.",
      },
      {
        id: "hw3-p4",
        title: "Parallel or contained",
        prompt: "Classify r=(0,0,1)+t(2,-2,0) relative to the plane x+y+z=3. Show both required tests.",
        tags: ["K", "T", "C"],
        hint: "First test n dot d. Then substitute the anchor into the plane.",
        steps: [
          { label: "Direction test", text: "The plane normal is n=(1,1,1).", math: String.raw`\[\vec n\cdot\vec d=(1,1,1)\cdot(2,-2,0)=0\]` },
          { label: "Anchor test", text: "Evaluate the plane at (0,0,1).", math: String.raw`\[0+0+1\ne3\]` },
          { label: "Classify", text: "The line direction is parallel to the plane, but the anchor is outside.", math: String.raw`\[L\parallel\Pi,\qquad L\cap\Pi=\varnothing\]` },
        ],
        answer: "The line is parallel to and disjoint from the plane, so there is no intersection.",
      },
    ],
  },
  {
    id: "homework-distance",
    number: "04",
    title: "Distance and consistency",
    focus: "Shortest distance and geometric system classification",
    estimatedMinutes: 30,
    problems: [
      {
        id: "hw4-p1",
        title: "Point-to-line distance in R²",
        prompt: "Find the distance from P(4,1) to 3x-4y+2=0.",
        tags: ["K", "A"],
        hint: "Use the scalar point-to-line distance formula.",
        steps: [
          { label: "Substitute", text: "Insert P into the numerator.", math: String.raw`\[|3(4)-4(1)+2|=|10|=10\]` },
          { label: "Normalize", text: "Find the normal magnitude.", math: String.raw`\[\sqrt{3^2+(-4)^2}=5\]` },
          { label: "Distance", text: "Divide.", math: String.raw`\[d=\frac{10}{5}=2\]` },
        ],
        answer: "2 units.",
      },
      {
        id: "hw4-p2",
        title: "Point-to-line distance in R³",
        prompt: "Find the distance from P(3,2,0) to r=(1,1,1)+t(2,0,-1).",
        tags: ["A", "T"],
        hint: "Use ||AP × d|| / ||d||.",
        steps: [
          { label: "Displacement", text: "Take A=(1,1,1) from the line.", math: String.raw`\[\overrightarrow{AP}=(2,1,-1)\]` },
          { label: "Cross product", text: "Cross AP with d.", math: String.raw`\[\overrightarrow{AP}\times\vec d=(-1,0,-2)\]` },
          { label: "Distance", text: "Divide magnitudes.", math: String.raw`\[d=\frac{\sqrt5}{\sqrt5}=1\]` },
        ],
        answer: "1 unit.",
      },
      {
        id: "hw4-p3",
        title: "Coincident versus parallel",
        prompt: "Compare the systems formed by P₁: x+2y-z=3 with (a) P₂: 2x+4y-2z=6 and (b) P₃: 2x+4y-2z=7.",
        tags: ["T", "C"],
        hint: "Compare the scale factor for both coefficients and constants.",
        steps: [
          { label: "System (a)", text: "Every term of P₂ is twice P₁.", math: String.raw`\[P_2=2P_1\Rightarrow \text{same plane}\]` },
          { label: "System (b)", text: "The left side scales by 2 but the constant does not.", math: String.raw`\[2(3)=6\ne7\Rightarrow \text{distinct parallel planes}\]` },
          { label: "Classify", text: "Coincident planes share infinitely many points; distinct parallel planes share none.", math: String.raw`\[(a)\ \text{consistent, infinite};\qquad (b)\ \text{inconsistent}\]` },
        ],
        answer: "(a) coincident and consistent with infinitely many solutions; (b) parallel and inconsistent.",
      },
      {
        id: "hw4-p4",
        title: "Closest point on a line",
        prompt: "For P(4,2,1) and r=(1,0,1)+t(1,1,0), find the closest point on the line and the exact distance.",
        tags: ["A", "T", "C"],
        hint: "Project AP onto the line direction to find the parameter of the perpendicular foot.",
        steps: [
          { label: "Build the displacement", text: "Use the line anchor A=(1,0,1).", math: String.raw`\[\overrightarrow{AP}=(3,2,0)\]` },
          { label: "Find the foot parameter", text: "Project AP onto d=(1,1,0).", math: String.raw`\[t=\frac{\overrightarrow{AP}\cdot\vec d}{\vec d\cdot\vec d}=\frac{5}{2}\]` },
          { label: "Find the foot", text: "Evaluate the line at t=5/2.", math: String.raw`\[H=\left(\frac72,\frac52,1\right)\]` },
          { label: "Measure the distance", text: "Take the magnitude of PH.", math: String.raw`\[d=\left\|\left(\frac12,-\frac12,0\right)\right\|=\sqrt{\frac12}=\frac{\sqrt2}{2}\]` },
        ],
        answer: String.raw`The closest point is \(H=(7/2,5/2,1)\), and the distance is \(\sqrt2/2\).`,
      },
    ],
  },
];

const homeworkExtensions: Record<string, HomeworkProblem[]> = {
  "homework-lines": [
    {
      id: "hw1-p5", title: "Angle between Cartesian lines in R²",
      prompt: String.raw`Find the acute angle between \(L_1:2x-y=1\) and \(L_2:x+3y=6\). Give an exact inverse-trigonometric expression and an answer to the nearest tenth of a degree.`,
      tags: ["K", "A", "C"],
      hint: "Choose a direction perpendicular to each coefficient normal. Use the absolute dot product for the acute angle.",
      steps: [
        { label: "Directions", text: "Choose directions perpendicular to the Cartesian normals.", math: String.raw`\[\vec d_1=(1,2),\qquad\vec d_2=(3,-1)\]` },
        { label: "Dot product and magnitudes", text: "Use the absolute dot product because the acute angle is requested.", math: String.raw`\[|\vec d_1\cdot\vec d_2|=1,\qquad\|\vec d_1\|=\sqrt5,\quad\|\vec d_2\|=\sqrt{10}\]` },
        { label: "Angle", text: "Apply inverse cosine and state the requested precision.", math: String.raw`\[\theta=\cos^{-1}\!\left(\frac1{\sqrt{50}}\right)\approx81.9^\circ\]` },
      ],
      answer: String.raw`\(\theta=\cos^{-1}(1/\sqrt{50})\approx81.9^\circ\).`,
    },
    {
      id: "hw1-p6", title: "Symmetric form with a fixed coordinate",
      prompt: String.raw`Write parametric and symmetric equations for \(\vec r=(3,-2,1)+t(0,2,-3)\). Determine whether \(P(3,2,-5)\) lies on the line.`,
      tags: ["A", "T", "C"],
      hint: "The zero x-component of the direction means x stays fixed. Do not divide by zero.",
      steps: [
        { label: "Parametric form", text: "Use the same parameter in every coordinate.", math: String.raw`\[x=3,\qquad y=-2+2t,\qquad z=1-3t\]` },
        { label: "Symmetric form", text: "Write the fixed coordinate separately.", math: String.raw`\[x=3,\qquad\frac{y+2}{2}=\frac{z-1}{-3}\]` },
        { label: "Point membership", text: "The y-coordinate gives t=2. Check both other coordinates.", math: String.raw`\[t=2\Rightarrow(3,-2+4,1-6)=(3,2,-5)\]` },
      ],
      answer: String.raw`\(x=3\), \(y=-2+2t\), \(z=1-3t\); equivalently \(x=3\), \((y+2)/2=(z-1)/(-3)\). The point \(P\) lies on the line.`,
    },
  ],
  "homework-planes": [
    {
      id: "hw2-p5", title: "Sketching a plane with a missing intercept",
      prompt: String.raw`Describe a sketch of \(2x-3z=6\). Give the x- and z-intercepts, explain the missing y-intercept, and state how to extend the sketch to represent a plane.`,
      tags: ["K", "A", "C"],
      hint: "Set the other two coordinates to zero for each intercept. A missing variable supplies a free direction.",
      steps: [
        { label: "Find intercepts", text: "Set z=0 for the x-intercept and x=0 for the z-intercept.", math: String.raw`\[X=(3,0,0),\qquad Z=(0,0,-2)\]` },
        { label: "Test the y-axis", text: "Every y-axis point has x=z=0, which cannot satisfy the equation.", math: String.raw`\[x=z=0\Rightarrow0=6\]` },
        { label: "Extend in the free direction", text: "Extend the intercept segment in both y-directions. The points (3,1,0) and (0,1,-2) form a second parallel segment.", math: String.raw`\[\vec r=(3,0,0)+s(-3,0,-2)+t(0,1,0)\]` },
      ],
      answer: String.raw`The intercepts are \((3,0,0)\) and \((0,0,-2)\). There is no y-intercept; the plane extends parallel to the y-axis.`,
    },
    {
      id: "hw2-p6", title: "Cartesian to vector and parametric plane equations",
      prompt: String.raw`Convert \(x-2y+z=4\) into vector and parametric form. Verify the anchor and both spanning vectors.`,
      tags: ["A", "T", "C"],
      hint: "Set y=s and z=t, solve for x, then separate the fixed and parameter parts.",
      steps: [
        { label: "Choose free parameters", text: "Two independent parameters describe the plane.", math: String.raw`\[y=s,\qquad z=t,\qquad x=4+2s-t\]` },
        { label: "Vector form", text: "Separate the anchor and parameter directions.", math: String.raw`\[\vec r=(4,0,0)+s(2,1,0)+t(-1,0,1)\]` },
        { label: "Verify", text: "The anchor satisfies the plane. Both non-parallel spans are perpendicular to the normal.", math: String.raw`\[4-0+0=4,\quad(1,-2,1)\cdot(2,1,0)=0,\quad(1,-2,1)\cdot(-1,0,1)=0\]` },
      ],
      answer: String.raw`\(\vec r=(4,0,0)+s(2,1,0)+t(-1,0,1)\), with \(x=4+2s-t\), \(y=s\), \(z=t\), where \(s,t\in\mathbb R\).`,
    },
  ],
  "homework-intersections": [
    {
      id: "hw3-p5", title: "Solving a three-variable system by elimination",
      prompt: String.raw`Solve \(x+y+z=4\), \(2x-y+z=8\), and \(x+2y-z=-3\) by elimination. Verify your solution and interpret the intersection of the three planes.`,
      tags: ["A", "T", "C"],
      hint: "Use the first equation to eliminate x from each other equation.",
      steps: [
        { label: "Eliminate x", text: "Subtract twice equation 1 from equation 2, and subtract equation 1 from equation 3.", math: String.raw`\[E_2-2E_1:\ -3y-z=0,\qquad E_3-E_1:\ y-2z=-7\]` },
        { label: "Solve the reduced equations", text: "The first reduced equation gives z=-3y.", math: String.raw`\[y-2(-3y)=-7\Rightarrow y=-1,\qquad z=3,\qquad x=2\]` },
        { label: "Verify", text: "All original equations hold, so the three planes have one common point.", math: String.raw`\[2-1+3=4,\qquad4+1+3=8,\qquad2-2-3=-3\]` },
      ],
      answer: String.raw`The three planes meet at the unique point \((2,-1,3)\).`,
    },
    {
      id: "hw3-p6", title: "Three planes with a common line or no common point",
      prompt: String.raw`Compare the system \(x+y+z=2\), \(x-y+z=0\), \(2x+2z=2\) with the system formed when the third equation becomes \(2x+2z=3\). Give the complete solution set in the consistent case.`,
      tags: ["K", "T", "C"],
      hint: "Add the first two equations and compare the result with the third equation in each system.",
      steps: [
        { label: "First two equations", text: "Subtract to find y, then substitute into either equation.", math: String.raw`\[2y=2\Rightarrow y=1,\qquad x+z=1\]` },
        { label: "Consistent third plane", text: "The third equation equals the sum of the first two and adds no new restriction.", math: String.raw`\[\vec r=(1,1,0)+t(-1,0,1),\qquad t\in\mathbb R\]` },
        { label: "Inconsistent third plane", text: "The altered third equation contradicts the sum of the first two.", math: String.raw`\[2x+2z=2\quad\text{and}\quad2x+2z=3\Rightarrow0=1\]` },
      ],
      answer: String.raw`With third constant 2, the common set is the line \(\vec r=(1,1,0)+t(-1,0,1)\). With third constant 3, the system is inconsistent and has no common points.`,
    },
  ],
  "homework-distance": [
    {
      id: "hw4-p5", title: "Point to a vector line in R²",
      prompt: String.raw`Find the exact distance from \(P(5,1)\) to \(L:\vec r=(1,-2)+t(3,4)\). Explain why the length of the connector from the anchor to P is not the required distance.`,
      tags: ["A", "T", "C"],
      hint: "Use the normal (4,-3) to obtain a Cartesian equation, then calculate perpendicular distance.",
      steps: [
        { label: "Convert the line", text: "The normal (4,-3) is perpendicular to (3,4). Use the anchor (1,-2).", math: String.raw`\[4(x-1)-3(y+2)=0\Rightarrow4x-3y-10=0\]` },
        { label: "Calculate perpendicular distance", text: "Divide the absolute residual by the normal magnitude.", math: String.raw`\[d=\frac{|4(5)-3(1)-10|}{\sqrt{4^2+(-3)^2}}=\frac75\]` },
        { label: "Interpret", text: "The anchor connector is not perpendicular and is longer than the shortest separation.", math: String.raw`\[\overrightarrow{AP}=(4,3),\quad\overrightarrow{AP}\cdot(3,4)=24\ne0,\quad\|\overrightarrow{AP}\|=5>\frac75\]` },
      ],
      answer: String.raw`The shortest distance is \(7/5\) units. The anchor-to-P connector is not perpendicular and is not the shortest connector.`,
    },
    {
      id: "hw4-p6", title: "Point to a plane and the perpendicular foot",
      prompt: String.raw`Find the exact distance from \(P(3,1,4)\) to \(x+2y+2z=4\). Find the perpendicular foot H and verify that the connector is normal to the plane.`,
      tags: ["K", "A", "T", "C"],
      hint: "The normal is (1,2,2). Remove the normal displacement from P to locate the foot.",
      steps: [
        { label: "Residual and distance", text: "Use the absolute scalar residual and normal magnitude.", math: String.raw`\[d=\frac{|3+2(1)+2(4)-4|}{\sqrt{1+4+4}}=\frac93=3\]` },
        { label: "Perpendicular foot", text: "Subtract the required normal displacement from P.", math: String.raw`\[H=P-\frac99(1,2,2)=(2,-1,2)\]` },
        { label: "Verify", text: "H lies on the plane and HP is a normal vector.", math: String.raw`\[2+2(-1)+2(2)=4,\qquad P-H=(1,2,2)=\vec n\]` },
      ],
      answer: String.raw`The distance is \(3\) units and the perpendicular foot is \(H=(2,-1,2)\).`,
    },
  ],
};

export const homeworkSets: HomeworkSet[] = originalHomeworkSets.map((set) => ({
  ...set,
  estimatedMinutes: set.id === "homework-lines" ? 40 : 45,
  problems: [...set.problems, ...(homeworkExtensions[set.id] ?? [])],
}));

const quizOne: Assessment = {
  id: "quiz-lines",
  number: "01",
  title: "Line equation fluency",
  description: "Read, convert, and communicate line equations in R² and R³.",
  mode: "quiz",
  timeLimit: "15 min",
  questions: [
    {
      id: "q1-1",
      prompt: String.raw`For \(\vec r=(2,-1,4)+t(3,-2,5)\), which vector controls the line's orientation?`,
      tags: ["K"],
      options: [String.raw`\((2,-1,4)\)`, String.raw`\((3,-2,5)\)`, String.raw`\((5,-3,9)\)`, String.raw`\((3,2,-5)\)`],
      correctIndex: 1,
      rationale: "The coefficient of the parameter is the direction vector. Any non-zero scalar multiple would also be valid.",
      steps: [
        { label: "Match the template", text: "Compare with r=r₀+td.", math: String.raw`\[\vec r_0=(2,-1,4),\qquad \vec d=(3,-2,5)\]` },
      ],
    },
    {
      id: "q1-2",
      prompt: "Which scalar equation describes the R² line through (2,-1) with direction d=(4,3)?",
      tags: ["A"],
      options: [String.raw`\(4x+3y-5=0\)`, String.raw`\(3x-4y-10=0\)`, String.raw`\(3x+4y-2=0\)`, String.raw`\(4x-3y-11=0\)`],
      correctIndex: 1,
      rationale: "A normal perpendicular to (4,3) is (3,-4). Using the point gives 3(x-2)-4(y+1)=0.",
      steps: [
        { label: "Normal", text: "Choose n=(3,-4), perpendicular to d.", math: String.raw`\[(3,-4)\cdot(4,3)=12-12=0\]` },
        { label: "Point-normal form", text: "Use the given point.", math: String.raw`\[3(x-2)-4(y+1)=0\Rightarrow 3x-4y-10=0\]` },
      ],
    },
    {
      id: "q1-3",
      prompt: String.raw`How should \(\vec r=(1,3,4)+t(2,0,-1)\) be written in symmetric form?`,
      tags: ["C"],
      options: [
        String.raw`\(\frac{x-1}{2}=\frac{y-3}{0}=\frac{z-4}{-1}\)`,
        String.raw`\(\frac{x-1}{2}=\frac{z-4}{-1},\ y=3\)`,
        String.raw`\(\frac{x+1}{2}=\frac{z+4}{-1},\ y=0\)`,
        String.raw`\(x=1,\ \frac{y-3}{2}=\frac{z-4}{-1}\)`,
      ],
      correctIndex: 1,
      rationale: "A zero y-direction means y never changes. State y=3 separately; never divide by zero.",
      steps: [
        { label: "Read coordinates", text: "The parametric system is x=1+2t, y=3, z=4-t.", math: String.raw`\[t=\frac{x-1}{2}=\frac{z-4}{-1},\qquad y=3\]` },
      ],
    },
    {
      id: "q1-4",
      prompt: String.raw`The lines \(\vec r=(1,0,2)+t(2,-1,3)\) and \(\vec r=(5,-2,8)+s(4,-2,6)\) have what relationship?`,
      tags: ["T"],
      options: ["Parallel and distinct", "The same line", "Perpendicular", "Skew"],
      correctIndex: 1,
      rationale: "The second direction is twice the first, and its anchor is the point obtained from the first line when t=2.",
      steps: [
        { label: "Compare directions", text: "The direction vectors are parallel.", math: String.raw`\[(4,-2,6)=2(2,-1,3)\]` },
        { label: "Test the second anchor", text: "Use t=2 on the first line.", math: String.raw`\[(1,0,2)+2(2,-1,3)=(5,-2,8)\]` },
      ],
    },
    {
      id: "q1-5",
      prompt: "Why does one Cartesian equation in R³ not define a line?",
      tags: ["K", "C"],
      options: [
        "One linear equation in R³ defines a plane.",
        "A line cannot be described with equations.",
        "Every Cartesian equation defines a point.",
        "A line needs three independent parameters.",
      ],
      correctIndex: 0,
      rationale: "One independent linear constraint reduces three-dimensional space to a two-dimensional plane. A Cartesian line needs two independent plane equations.",
      steps: [
        { label: "Count dimensions", text: "One independent constraint removes one degree of freedom.", math: String.raw`\[3-1=2\quad\text{dimensions}\]` },
      ],
    },
    {
      id: "q1-6",
      kind: "written",
      prompt: String.raw`Explain how you would test whether \(S(7,-2,5)\) lies on \(\vec r=(1,1,2)+t(2,-1,1)\). State the conclusion.`,
      tags: ["T", "C"],
      criteria: [
        "Solves for a parameter using at least one coordinate.",
        "Checks the same parameter in the remaining coordinates.",
        "States a clear geometric conclusion.",
      ],
      sampleAnswer: String.raw`From \(x\), \(7=1+2t\) gives \(t=3\). Then \(y=1-3=-2\) and \(z=2+3=5\). The same value \(t=3\) satisfies every coordinate, so \(S\) lies on the line.`,
      rationale: "A point lies on a parametric line only when one shared parameter reproduces every coordinate.",
      steps: [
        { label: "Use x", text: "Solve for the shared parameter.", math: String.raw`\[7=1+2t\Rightarrow t=3\]` },
        { label: "Check y and z", text: "Use the same value of t.", math: String.raw`\[1-3=-2,\qquad 2+3=5\]` },
        { label: "Conclude", text: "All coordinates agree.", math: String.raw`\[S\in L\]` },
      ],
    },
  ],
};

const quizTwo: Assessment = {
  id: "quiz-planes",
  number: "02",
  title: "Plane construction",
  description: "Work with normals, span vectors, and conditions for a unique plane.",
  mode: "quiz",
  timeLimit: "15 min",
  questions: [
    {
      id: "q2-1",
      prompt: String.raw`What is a normal vector to \(2x-y+3z=7\)?`,
      tags: ["K"],
      options: [String.raw`\((2,-1,3)\)`, String.raw`\((2,1,3)\)`, String.raw`\((7,0,0)\)`, String.raw`\((-1,3,7)\)`],
      correctIndex: 0,
      rationale: "The coefficients of x, y, and z form a normal vector.",
      steps: [{ label: "Read coefficients", text: "Use A, B, C from Ax+By+Cz=D.", math: String.raw`\[\vec n=(A,B,C)=(2,-1,3)\]` }],
    },
    {
      id: "q2-2",
      prompt: "A plane passes through P(1,0,2) and has spans a=(1,1,0), b=(0,1,1). Which scalar equation is correct?",
      tags: ["A"],
      options: [String.raw`\(x+y+z=3\)`, String.raw`\(x-y+z=3\)`, String.raw`\(x-y-z=-1\)`, String.raw`\(x+z=3\)`],
      correctIndex: 1,
      rationale: "a×b=(1,-1,1), and the point-normal equation expands to x-y+z=3.",
      steps: [
        { label: "Normal", text: "Cross the two spans.", math: String.raw`\[(1,1,0)\times(0,1,1)=(1,-1,1)\]` },
        { label: "Equation", text: "Use P.", math: String.raw`\[(x-1)-y+(z-2)=0\Rightarrow x-y+z=3\]` },
      ],
    },
    {
      id: "q2-3",
      prompt: "Why do three collinear points fail to determine a unique plane?",
      tags: ["T", "C"],
      options: [
        "Their two connecting vectors are perpendicular.",
        "Their two connecting vectors are scalar multiples, so no unique normal is produced.",
        "Every three points always determine a unique plane.",
        "A plane cannot contain a line.",
      ],
      correctIndex: 1,
      rationale: "Collinearity makes the two candidate span vectors dependent; their cross product is zero.",
      steps: [{ label: "Independence test", text: "For collinear A, B, C, AC=kAB.", math: String.raw`\[\overrightarrow{AB}\times\overrightarrow{AC}=\vec0\]` }],
    },
    {
      id: "q2-4",
      prompt: String.raw`Which vector equation describes the plane through \(P(1,0,2)\) with spans \((1,1,0)\) and \((0,1,1)\)?`,
      tags: ["K", "A"],
      options: [
        String.raw`\(\vec r=(1,0,2)+s(1,1,0)+t(0,1,1)\)`,
        String.raw`\(\vec r=(1,1,0)+t(0,1,1)\)`,
        String.raw`\(\vec r=(1,0,2)+s(1,1,0)\)`,
        String.raw`\(\vec r=s(1,0,2)+t(1,1,0)\)`,
      ],
      correctIndex: 0,
      rationale: "A plane needs one anchor and two independent spanning directions.",
      steps: [{ label: "Use the plane template", text: "Insert the anchor and both spans.", math: String.raw`\[\vec r=\vec r_0+s\vec a+t\vec b\]` }],
    },
    {
      id: "q2-5",
      prompt: String.raw`What are the axis intercepts of \(2x+3y+6z=6\)?`,
      tags: ["A"],
      options: [
        String.raw`\((3,0,0),(0,2,0),(0,0,1)\)`,
        String.raw`\((2,0,0),(0,3,0),(0,0,6)\)`,
        String.raw`\((6,0,0),(0,6,0),(0,0,6)\)`,
        String.raw`\((1,0,0),(0,2,0),(0,0,3)\)`,
      ],
      correctIndex: 0,
      rationale: "Set the other two coordinates to zero for each intercept.",
      steps: [
        { label: "Calculate each intercept", text: "Solve one variable at a time.", math: String.raw`\[x=3,\qquad y=2,\qquad z=1\]` },
      ],
    },
    {
      id: "q2-6",
      kind: "written",
      prompt: "Explain why two parallel span vectors cannot define a unique plane. Include the geometric meaning of their cross product.",
      tags: ["T", "C"],
      criteria: [
        "States that parallel spans provide only one independent direction.",
        "Identifies the cross product as the zero vector.",
        "Explains why no unique normal or plane is produced.",
      ],
      sampleAnswer: "Parallel span vectors are scalar multiples, so they describe movement in only one independent direction. Their cross product is the zero vector, which cannot serve as a plane normal. Therefore the data determines a line of movement but not one unique plane.",
      rationale: "A plane is two-dimensional and therefore requires two independent directions.",
      steps: [
        { label: "Identify dependence", text: "Parallel vectors are scalar multiples.", math: String.raw`\[\vec b=k\vec a\]` },
        { label: "Use the cross product", text: "Dependent spans produce no non-zero normal.", math: String.raw`\[\vec a\times\vec b=\vec0\]` },
      ],
    },
  ],
};

const quizThree: Assessment = {
  id: "quiz-intersections",
  number: "03",
  title: "Intersections and distance",
  description: "Classify spatial relationships and calculate exact results.",
  mode: "quiz",
  timeLimit: "18 min",
  questions: [
    {
      id: "q3-1",
      prompt: String.raw`Where does \(\vec r=(1,0,2)+t(1,2,-1)\) meet \(x+y+z=5\)?`,
      tags: ["A"],
      options: [String.raw`\((1,0,2)\)`, String.raw`\((2,2,1)\)`, String.raw`\((3,4,0)\)`, "It never meets the plane"],
      correctIndex: 1,
      rationale: "Substitution gives 3+2t=5, so t=1 and the point is (2,2,1).",
      steps: [
        { label: "Substitute", text: "Use x=1+t, y=2t, z=2-t.", math: String.raw`\[1+t+2t+2-t=5\Rightarrow t=1\]` },
        { label: "Evaluate", text: "Return to the line.", math: String.raw`\[\vec r(1)=(2,2,1)\]` },
      ],
    },
    {
      id: "q3-2",
      prompt: String.raw`If \(\vec n\cdot\vec d=0\) for a line and plane, but the line anchor does not satisfy the plane, what is the relationship?`,
      tags: ["T", "C"],
      options: ["One intersection", "The line lies in the plane", "The line is parallel and disjoint", "The line is perpendicular to the plane"],
      correctIndex: 2,
      rationale: "n·d=0 makes the line direction parallel to the plane. Since its anchor is outside, the entire line is disjoint.",
      steps: [{ label: "Classify", text: "The substitution reduces to a contradiction rather than 0=0.", math: String.raw`\[\vec n\cdot\vec d=0,\quad \vec r_0\notin\Pi\Rightarrow L\parallel\Pi\]` }],
    },
    {
      id: "q3-3",
      prompt: String.raw`Find the distance from \(P(1,0,2)\) to \(\vec r=t(1,1,0)\).`,
      tags: ["A", "T"],
      options: [String.raw`\(\sqrt2\)`, String.raw`\(3/\sqrt2\)`, String.raw`\(\sqrt5\)`, String.raw`\(1/\sqrt2\)`],
      correctIndex: 1,
      rationale: "AP×d=(-2,2,1), with magnitude 3; ||d||=√2.",
      steps: [
        { label: "Cross product", text: "The line anchor is the origin, so AP=P.", math: String.raw`\[(1,0,2)\times(1,1,0)=(-2,2,1)\]` },
        { label: "Distance", text: "Divide magnitudes.", math: String.raw`\[d=\frac{\sqrt{4+4+1}}{\sqrt{1+1}}=\frac3{\sqrt2}\]` },
      ],
    },
    {
      id: "q3-4",
      prompt: "Which expression gives the distance from point P to a line through A with direction d in R³?",
      tags: ["K"],
      options: [
        String.raw`\(\frac{\|\overrightarrow{AP}\times\vec d\|}{\|\vec d\|}\)`,
        String.raw`\(\overrightarrow{AP}\cdot\vec d\)`,
        String.raw`\(\|\overrightarrow{AP}+\vec d\|\)`,
        String.raw`\(\frac{\|\vec d\|}{\|\overrightarrow{AP}\times\vec d\|}\)`,
      ],
      correctIndex: 0,
      rationale: "The cross-product magnitude measures the parallelogram area. Dividing by the base length leaves the perpendicular height.",
      steps: [{ label: "Area relation", text: "Area equals base times height.", math: String.raw`\[\|\overrightarrow{AP}\times\vec d\|=\|\vec d\|d\]` }],
    },
    {
      id: "q3-5",
      prompt: String.raw`What direction vector is parallel to the intersection of \(x+y+z=3\) and \(x-y+z=1\)?`,
      tags: ["A", "T"],
      options: [String.raw`\((-1,0,1)\)`, String.raw`\((1,1,1)\)`, String.raw`\((1,-1,1)\)`, String.raw`\((0,1,0)\)`],
      correctIndex: 0,
      rationale: "The intersection direction is perpendicular to both plane normals, so it is parallel to their cross product.",
      steps: [{ label: "Cross the normals", text: "Use n₁=(1,1,1) and n₂=(1,-1,1).", math: String.raw`\[\vec n_1\times\vec n_2=(2,0,-2)\parallel(-1,0,1)\]` }],
    },
    {
      id: "q3-6",
      kind: "written",
      prompt: String.raw`A line has direction \(\vec d=(1,-1,0)\), anchor \(A=(0,0,0)\), and the plane is \(x+y+z=2\). Classify the relationship and justify it without solving a full substitution system.`,
      tags: ["T", "C"],
      criteria: [
        "Uses the plane normal n=(1,1,1).",
        "Computes n dot d=0 and explains that the line direction is parallel to the plane.",
        "Tests the anchor and concludes that the line is parallel and disjoint.",
      ],
      sampleAnswer: "The plane normal is n=(1,1,1). Since n dot d=1-1+0=0, the line direction is parallel to the plane. The anchor does not satisfy the plane because 0+0+0 is not 2. Therefore the line is parallel to the plane and has no intersection.",
      rationale: "The dot product identifies parallel direction, while the anchor test distinguishes a contained line from a disjoint line.",
      steps: [
        { label: "Direction test", text: "Compare the normal and line direction.", math: String.raw`\[(1,1,1)\cdot(1,-1,0)=0\]` },
        { label: "Anchor test", text: "Substitute A into the plane.", math: String.raw`\[0+0+0\ne2\]` },
      ],
    },
  ],
};

const workedStep = (label: string, text: string, math?: string): SolutionStep => ({
  label,
  text,
  math: math ? "\\[" + math + "\\]" : undefined,
});

const choiceQuestion = (
  id: string,
  prompt: string,
  options: string[],
  correctIndex: number,
  tags: KATCCategory[],
  rationale: string,
  solution: string,
): AssessmentQuestion => ({
  id, prompt, options, correctIndex, tags, rationale, marks: 1,
  steps: [workedStep("Reasoning", rationale, solution)],
});

const writtenQuestion = (
  id: string,
  prompt: string,
  tags: KATCCategory[],
  criteria: string[],
  sampleAnswer: string,
  steps: SolutionStep[],
  marks = 4,
): AssessmentQuestion => ({
  id, kind: "written", prompt, tags, criteria, sampleAnswer, steps, marks,
  rationale: "A complete response shows the method, gives an exact result, and explains its geometric meaning.",
});

const assessmentInstructions = [
  "Answer every question. Each question shows its mark allocation.",
  "For written responses, show algebraic steps and justify geometric conclusions using vectors or equations.",
  "Give exact values unless an approximation is requested. Give approximate angles to the nearest tenth of a degree.",
  "Use distinct parameters for different lines. Include a check whenever the question requests verification.",
  "Written responses are self-assessed against the marking criteria. They are not included in the automatic multiple-choice score.",
];

const academicQuestions = (questions: AssessmentQuestion[], writtenMarks = 4): AssessmentQuestion[] => [
  ...questions.filter((question) => question.kind !== "written").map((question) => ({
    ...question,
    marks: question.marks ?? 1,
    section: "Section A: Multiple choice",
  })),
  ...questions.filter((question) => question.kind === "written" && question.tags.includes("A")).map((question) => ({
    ...question,
    marks: question.marks ?? writtenMarks,
    section: "Section B: Application",
  })),
  ...questions.filter((question) => question.kind === "written" && !question.tags.includes("A")).map((question) => ({
    ...question,
    marks: question.marks ?? writtenMarks,
    section: "Section C: Thinking and Communication",
  })),
];

const quizOneAdditional: AssessmentQuestion[] = [
  choiceQuestion("q1-7", "Find the exact magnitude of the direction vector \\(\\vec d=(2,-3,6)\\).",
    ["\\(5\\)", "\\(7\\)", "\\(\\sqrt{11}\\)", "\\(11\\)"], 1, ["K", "A"],
    "Square all three components before adding; the magnitude is non-negative.", "\\|\\vec d\\|=\\sqrt{2^2+(-3)^2+6^2}=\\sqrt{49}=7"),
  choiceQuestion("q1-8", "Which direction vector can be used for the line through \\(A(-2,1,4)\\) and \\(B(4,3,0)\\)?",
    ["\\((3,1,-2)\\)", "\\((2,4,4)\\)", "\\((6,2,4)\\)", "\\((-2,1,4)\\)"], 0, ["A"],
    "Subtract the points, then simplify by a non-zero common factor.", "\\overrightarrow{AB}=(6,2,-4)=2(3,1,-2)"),
  choiceQuestion("q1-9", "Which statement correctly describes skew lines in \\(\\mathbb R^3\\)?",
    ["They are parallel and distinct.", "They intersect at a right angle.", "They are non-parallel and do not intersect.", "They lie in the same plane."], 2, ["K", "C"],
    "Skew lines are non-coplanar. Both non-parallelism and failure to intersect must be established.", "\\vec d_1\\times\\vec d_2\\ne\\vec0,\\qquad L_1\\cap L_2=\\varnothing"),
  writtenQuestion("q1-10", "The line \\(L\\) passes through \\(A(-1,2,0)\\) and \\(B(3,0,6)\\). (a) Find a simplified direction vector. (b) Write vector and symmetric equations. (c) Verify that \\(B\\) satisfies your vector equation.",
    ["A", "C"],
    ["Finds the displacement and simplifies it correctly (1 mark).", "Writes a vector equation with one shared parameter (1 mark).", "Writes a valid symmetric equation (1 mark).", "Verifies B with the same parameter in every coordinate (1 mark)."],
    "A suitable direction is \\((2,-1,3)\\). Thus \\(\\vec r=(-1,2,0)+t(2,-1,3)\\), \\(t\\in\\mathbb R\\), and \\(\\frac{x+1}{2}=\\frac{y-2}{-1}=\\frac z3\\). At \\(t=2\\), the vector equation gives \\((3,0,6)=B\\).",
    [workedStep("Direction", "Subtract A from B and divide by 2.", "\\overrightarrow{AB}=(4,-2,6)=2(2,-1,3)"),
      workedStep("Represent", "Use A as the anchor.", "\\vec r=(-1,2,0)+t(2,-1,3),\\qquad \\frac{x+1}{2}=\\frac{y-2}{-1}=\\frac z3"),
      workedStep("Verify", "Use one parameter value for all coordinates.", "\\vec r(2)=(-1,2,0)+2(2,-1,3)=(3,0,6)")]),
  writtenQuestion("q1-11", "Determine whether \\(L_1:\\vec r=(1,0,1)+t(1,2,-1)\\) and \\(L_2:\\vec r=(3,5,-2)+s(0,1,-1)\\) intersect. Find the intersection if it exists and verify all three coordinates.",
    ["A", "T"],
    ["Equates corresponding coordinates using distinct parameters (1 mark).", "Finds t=2 and s=-1 (1 mark).", "Checks the remaining coordinate (1 mark).", "States the intersection point clearly (1 mark)."],
    "From the x-coordinate, \\(1+t=3\\), so \\(t=2\\). From y, \\(2t=5+s\\), so \\(s=-1\\). The z-coordinates agree: \\(1-2=-2-(-1)=-1\\). Therefore the lines intersect at \\((3,4,-1)\\).",
    [workedStep("Solve", "Equate x and y.", "1+t=3\\Rightarrow t=2,\\qquad 2t=5+s\\Rightarrow s=-1"),
      workedStep("Check z", "The third equation must also hold.", "1-t=-1=-2-s"),
      workedStep("Conclude", "Evaluate either line.", "L_1\\cap L_2=\\{(3,4,-1)\\}")]),
  writtenQuestion("q1-12", "A student claims: \"If two line directions have dot product zero, the lines must intersect at a right angle.\" Use \\(L_1:\\vec r=t(1,0,0)\\) and \\(L_2:\\vec r=(0,1,1)+s(0,1,0)\\) to assess this claim.",
    ["T", "C"],
    ["Computes the direction dot product as zero (1 mark).", "Observes that the first line has z=0 and the second has z=1 (1 mark).", "Classifies the lines as skew (1 mark).", "Explains that orthogonal directions alone do not establish intersection (1 mark)."],
    "The directions are orthogonal because \\((1,0,0)\\cdot(0,1,0)=0\\). However, \\(L_1\\) has \\(z=0\\) and \\(L_2\\) has \\(z=1\\), so they cannot meet. They are non-parallel and disjoint, hence skew. To conclude that two lines meet at a right angle, an intersection must also be shown.",
    [workedStep("Direction test", "A zero dot product concerns directions, not position.", "(1,0,0)\\cdot(0,1,0)=0"),
      workedStep("Position test", "The z-coordinate equations are incompatible.", "z_{L_1}=0,\\quad z_{L_2}=1\\Rightarrow L_1\\cap L_2=\\varnothing")]),
];

const quizTwoAdditional: AssessmentQuestion[] = [
  choiceQuestion("q2-7", "Which point lies on \\(\\vec r=(1,0,2)+s(1,1,0)+t(0,1,1)\\)?",
    ["\\((3,3,3)\\)", "\\((3,2,3)\\)", "\\((0,0,0)\\)", "\\((1,1,2)\\)"], 0, ["A"],
    "The coordinates require x=1+s, y=s+t, and z=2+t. With s=2 and t=1, all three coordinates give the first point.", "(1,0,2)+2(1,1,0)+(0,1,1)=(3,3,3)"),
  choiceQuestion("q2-8", "A plane has spans \\(\\vec a=(1,0,2)\\) and \\(\\vec b=(0,1,-1)\\). Which vector is normal to the plane?",
    ["\\((1,1,1)\\)", "\\((-2,1,1)\\)", "\\((2,1,1)\\)", "\\((1,0,2)\\)"], 1, ["A"],
    "The cross product is perpendicular to both independent spans.", "(1,0,2)\\times(0,1,-1)=(-2,1,1)"),
  choiceQuestion("q2-9", "Which plane is parallel to, but distinct from, \\(2x-y+z=3\\)?",
    ["\\(4x-2y+2z=6\\)", "\\(4x-2y+2z=5\\)", "\\(x+y+z=3\\)", "\\(2x+y-z=3\\)"], 1, ["K", "T"],
    "The normal scales by 2 while the constant does not. A constant of 6 would give the same plane.", "2(2x-y+z)=4x-2y+2z,\\qquad 2(3)=6\\ne5"),
  writtenQuestion("q2-10", "Find a Cartesian equation of the plane through \\(A(1,1,0)\\), \\(B(2,0,1)\\), and \\(C(0,2,1)\\). Show that the points are not collinear and verify your equation.",
    ["A", "T"],
    ["Finds two correct connecting vectors (1 mark).", "Finds a non-zero cross product and explains non-collinearity (1 mark).", "Obtains x+y=2 (1 mark).", "Checks all three points (1 mark)."],
    "The spans are \\(\\overrightarrow{AB}=(1,-1,1)\\) and \\(\\overrightarrow{AC}=(-1,1,1)\\). Their cross product is \\((-2,-2,0)\\ne\\vec0\\), so the points are not collinear. Use the normal \\((1,1,0)\\) and A to obtain \\(x+y=2\\). Each given point has coordinate sum \\(x+y=2\\).",
    [workedStep("Find spans", "Use a common anchor.", "\\overrightarrow{AB}=(1,-1,1),\\qquad \\overrightarrow{AC}=(-1,1,1)"),
      workedStep("Find normal", "A non-zero cross product also confirms independence.", "\\overrightarrow{AB}\\times\\overrightarrow{AC}=(-2,-2,0)"),
      workedStep("Equation and check", "Scale the normal and use A.", "(x-1)+(y-1)=0\\Rightarrow x+y=2")]),
  writtenQuestion("q2-11", "For the plane \\(2x+y-z=4\\), (a) find an anchor point and two independent span vectors, and (b) write and verify a vector equation.",
    ["A", "C"],
    ["Finds an anchor satisfying the scalar equation (1 mark).", "Finds two in-plane directions perpendicular to the normal (1 mark).", "Establishes that the directions are independent (1 mark).", "Writes and verifies a valid vector equation (1 mark)."],
    "Choose \\(A=(2,0,0)\\), \\(\\vec a=(1,-2,0)\\), and \\(\\vec b=(0,1,1)\\). Both spans are perpendicular to \\((2,1,-1)\\) and they are not scalar multiples. A vector equation is \\(\\vec r=(2,0,0)+s(1,-2,0)+t(0,1,1)\\). Substituting \\(x=2+s\\), \\(y=-2s+t\\), \\(z=t\\) gives 4 for all parameters.",
    [workedStep("Anchor", "Set y=z=0.", "2x=4\\Rightarrow A=(2,0,0)"),
      workedStep("Directions", "Choose two independent solutions of 2a+b-c=0.", "(2,1,-1)\\cdot(1,-2,0)=0,\\quad(2,1,-1)\\cdot(0,1,1)=0"),
      workedStep("Verify", "Substitute the full parametric representation.", "2(2+s)+(-2s+t)-t=4")]),
  writtenQuestion("q2-12", "A proposed plane is \\(\\vec r=(1,0,0)+s(1,2,-1)+t(k,4,-2)\\). Find the value of \\(k\\) for which this expression fails to describe a plane. Explain what set the expression describes in that case.",
    ["T", "C"],
    ["Uses scalar dependence of the two spans (1 mark).", "Finds the common scale factor 2 (1 mark).", "Obtains k=2 (1 mark).", "Explains that only a line is generated (1 mark)."],
    "For dependence, \\((k,4,-2)=\\lambda(1,2,-1)\\). The y- and z-components give \\(\\lambda=2\\), so \\(k=2\\). Then \\(\\vec r=(1,0,0)+(s+2t)(1,2,-1)\\), which generates a line, not a plane. For every other k, the spans are independent.",
    [workedStep("Compare spans", "Use the non-zero components to determine the scale factor.", "4=2\\lambda,\\quad-2=-\\lambda\\Rightarrow\\lambda=2"),
      workedStep("Interpret", "At k=2 the two parameters combine into one effective parameter.", "\\vec r=(1,0,0)+(s+2t)(1,2,-1)")]),
];

const quizThreeAdditional: AssessmentQuestion[] = [
  choiceQuestion("q3-7", "Find the distance from the origin to \\(2x-y+2z=6\\).",
    ["\\(2\\)", "\\(3\\)", "\\(6\\)", "\\(\\sqrt6\\)"], 0, ["A"],
    "Divide the absolute substitution residual by the normal magnitude.", "d=\\frac{|0-6|}{\\sqrt{2^2+(-1)^2+2^2}}=\\frac63=2"),
  choiceQuestion("q3-8", "A line has direction \\((1,0,1)\\). What is its acute angle with the plane \\(z=0\\)?",
    ["\\(0^\\circ\\)", "\\(30^\\circ\\)", "\\(45^\\circ\\)", "\\(90^\\circ\\)"], 2, ["K", "A"],
    "Use the sine of the line-plane angle with normal (0,0,1).", "\\sin\\theta=\\frac{|(1,0,1)\\cdot(0,0,1)|}{\\sqrt2}=\\frac1{\\sqrt2}\\Rightarrow\\theta=45^\\circ"),
  choiceQuestion("q3-9", "A system includes \\(x+y+z=1\\) and \\(2x+2y+2z=3\\). What can be concluded before examining a third plane equation?",
    ["There is exactly one solution.", "There are infinitely many solutions.", "There is no common solution.", "The common solution is the origin."], 2, ["T"],
    "The first two equations already contradict one another; a third equation cannot restore consistency.", "(2x+2y+2z)-2(x+y+z)=3-2\\Rightarrow0=1"),
  writtenQuestion("q3-10", "Find a vector equation for the intersection of \\(x+y+z=4\\) and \\(x-y+z=2\\). Verify both an anchor and the direction vector.",
    ["A", "C"],
    ["Eliminates a variable correctly (1 mark).", "Finds an anchor on both planes (1 mark).", "Finds a direction and vector equation (1 mark).", "Verifies the anchor and direction against both planes (1 mark)."],
    "Subtracting gives \\(2y=2\\), so \\(y=1\\). Then \\(x+z=3\\). Set \\(z=t\\) to obtain \\(\\vec r=(3,1,0)+t(-1,0,1)\\). The anchor satisfies both equations, and \\((-1,0,1)\\) has zero dot product with both normals.",
    [workedStep("Eliminate", "Subtract the second plane from the first.", "2y=2\\Rightarrow y=1,\\qquad x+z=3"),
      workedStep("Parameterize", "Choose z as the free parameter.", "\\vec r=(3,1,0)+t(-1,0,1)"),
      workedStep("Verify", "The direction is perpendicular to each normal.", "(1,1,1)\\cdot(-1,0,1)=0,\\quad(1,-1,1)\\cdot(-1,0,1)=0")]),
  writtenQuestion("q3-11", "For \\(P(2,1,3)\\) and the plane \\(x+2y+2z=1\\), (a) calculate the exact perpendicular distance and (b) find and verify the foot of the perpendicular.",
    ["A", "T"],
    ["Uses the point-plane formula correctly (1 mark).", "Obtains distance 3 (1 mark).", "Finds the perpendicular foot (1,-1,1) (1 mark).", "Verifies plane membership and perpendicular displacement (1 mark)."],
    "The normal is \\(\\vec n=(1,2,2)\\), with magnitude 3. The distance is \\(|2+2+6-1|/3=3\\). The foot is \\(Q=P-\\frac{9}{9}\\vec n=(1,-1,1)\\). It satisfies \\(1-2+2=1\\), and \\(P-Q=(1,2,2)\\) is normal to the plane.",
    [workedStep("Distance", "Use the residual and normal magnitude.", "d=\\frac{|2+2(1)+2(3)-1|}{\\sqrt{1+4+4}}=3"),
      workedStep("Foot", "Remove the normal component of the displacement.", "Q=P-\\frac{\\vec n\\cdot P-1}{\\|\\vec n\\|^2}\\vec n=(2,1,3)-(1,2,2)=(1,-1,1)"),
      workedStep("Verify", "Check membership and perpendicular direction.", "1+2(-1)+2(1)=1,\\qquad P-Q=\\vec n")]),
  writtenQuestion("q3-12", "Consider \\(L:\\vec r=(1,2,0)+t(1,1,-1)\\) and \\(\\Pi_k:2x-y+z=k\\). Determine all values of \\(k\\) for which the line (a) lies in the plane or (b) is parallel and disjoint. Can there be exactly one intersection?",
    ["T", "C"],
    ["Calculates the normal-direction dot product as zero (1 mark).", "Obtains the constant substitution value 0 (1 mark).", "Distinguishes k=0 from k not equal to 0 (1 mark).", "Explains why exactly one intersection is impossible (1 mark)."],
    "Since \\((2,-1,1)\\cdot(1,1,-1)=0\\), the line direction is parallel to every plane in the family. Substitution gives \\(2(1+t)-(2+t)-t=0\\). Thus the line lies in \\(\\Pi_0\\), is parallel and disjoint when \\(k\\ne0\\), and never has exactly one intersection.",
    [workedStep("Direction", "Use the same normal for the plane family.", "(2,-1,1)\\cdot(1,1,-1)=2-1-1=0"),
      workedStep("Substitute", "The parameter cancels.", "2(1+t)-(2+t)-t=0"),
      workedStep("Classify", "Compare the constant expression with k.", "k=0\\Rightarrow L\\subset\\Pi_k,\\qquad k\\ne0\\Rightarrow L\\cap\\Pi_k=\\varnothing")]),
];

export const quizzes: Assessment[] = [
  { ...quizOne, kind: "quiz", description: "Line equations, point membership, line relationships, and mathematical justification.", timeLimit: "30 min", instructions: assessmentInstructions, questions: academicQuestions([...quizOne.questions, ...quizOneAdditional], 3) },
  { ...quizTwo, kind: "quiz", description: "Plane equations, independent spans, normal vectors, and verification.", timeLimit: "30 min", instructions: assessmentInstructions, questions: academicQuestions([...quizTwo.questions, ...quizTwoAdditional], 3) },
  { ...quizThree, kind: "quiz", description: "Intersections, exact distances, angles, and parameter-dependent relationships.", timeLimit: "35 min", instructions: assessmentInstructions, questions: academicQuestions([...quizThree.questions, ...quizThreeAdditional], 3) },
];

const originalFinalExam: Assessment = {
  id: "final-exam-assessment",
  number: "FINAL",
  title: "Lines and Planes comprehensive exam",
  description: "Twelve questions spanning representation, plane construction, systems, intersections, distance, and communication.",
  mode: "exam",
  timeLimit: "50 min",
  questions: [
    {
      id: "fx-1",
      prompt: "Which statement about a Cartesian line in R³ is correct?",
      tags: ["K"],
      options: [
        "One equation Ax+By+Cz+D=0 always defines a line.",
        "It can be represented as the intersection of two non-parallel planes.",
        "It requires three independent parameters.",
        "It has no direction vector.",
      ],
      correctIndex: 1,
      rationale: "One scalar linear equation in R³ defines a plane; two independent plane equations can intersect in a line.",
      steps: [{ label: "Dimension check", text: "Each independent scalar constraint reduces dimension by one.", math: String.raw`\[\mathbb R^3\xrightarrow{\text{one constraint}}\text{plane}\xrightarrow{\text{second constraint}}\text{line}\]` }],
    },
    {
      id: "fx-2",
      prompt: String.raw`Convert \(\frac{x-2}{3}=\frac{y+1}{-2}=z-4\) to parametric form.`,
      tags: ["K", "C"],
      options: [
        String.raw`\(x=2+3t,\ y=-1-2t,\ z=4+t\)`,
        String.raw`\(x=3+2t,\ y=-2-t,\ z=1+4t\)`,
        String.raw`\(x=2-3t,\ y=-1+2t,\ z=4+t\)`,
        String.raw`\(x=2+3t,\ y=1-2t,\ z=4\)`,
      ],
      correctIndex: 0,
      rationale: "Set every symmetric expression equal to the shared parameter t. Since z-4=t, z=4+t.",
      steps: [{ label: "Set equal to t", text: "Solve each relation.", math: String.raw`\[\frac{x-2}{3}=t,\ \frac{y+1}{-2}=t,\ z-4=t\]` }],
    },
    {
      id: "fx-3",
      prompt: "Which plane contains A(1,0,0), B(0,1,0), and C(0,0,1)?",
      tags: ["A"],
      options: [String.raw`\(x+y+z=0\)`, String.raw`\(x+y+z=1\)`, String.raw`\(x-y+z=1\)`, String.raw`\(xyz=1\)`],
      correctIndex: 1,
      rationale: "Each point is a unit intercept, so the intercept equation is x+y+z=1.",
      steps: [
        { label: "Spans", text: "Use AB=(-1,1,0) and AC=(-1,0,1).", math: String.raw`\[\overrightarrow{AB}\times\overrightarrow{AC}=(1,1,1)\]` },
        { label: "Plane", text: "Use A in point-normal form.", math: String.raw`\[(x-1)+y+z=0\Rightarrow x+y+z=1\]` },
      ],
    },
    {
      id: "fx-4",
      prompt: String.raw`Find the intersection of \(\vec r=(0,1,0)+t(2,-1,3)\) and \(x+y-z=0\).`,
      tags: ["A"],
      options: [String.raw`\((0,1,0)\)`, String.raw`\((2,0,3)\)`, String.raw`\((1,1/2,3/2)\)`, "No intersection"],
      correctIndex: 2,
      rationale: "Substitution gives 2t+(1-t)-3t=0, so 1-2t=0 and t=1/2. Evaluating the line gives (1,1/2,3/2).",
      steps: [
        { label: "Substitute", text: "Use x=2t, y=1-t, z=3t.", math: String.raw`\[2t+1-t-3t=0\Rightarrow 1-2t=0\Rightarrow t=\frac12\]` },
        { label: "Evaluate", text: "Return to the line.", math: String.raw`\[P=\left(1,\frac12,\frac32\right)\]` },
      ],
    },
    {
      id: "fx-5",
      prompt: String.raw`Classify \(2x-y+z=4\) and \(4x-2y+2z=11\).`,
      tags: ["T"],
      options: ["Intersect in a line", "Coincident", "Distinct parallel planes", "Perpendicular planes"],
      correctIndex: 2,
      rationale: "The normals scale by 2, but 2(4)=8≠11. The planes are parallel and distinct.",
      steps: [{ label: "Compare scale", text: "Double the first equation's left side and constant.", math: String.raw`\[2(2x-y+z)=4x-2y+2z,\qquad 2(4)=8\ne11\]` }],
    },
    {
      id: "fx-6",
      prompt: String.raw`Which line is the intersection of \(x+y+z=3\) and \(x-y+z=1\)?`,
      tags: ["T", "C"],
      options: [
        String.raw`\(\vec r=(2,1,0)+t(-1,0,1)\)`,
        String.raw`\(\vec r=(0,0,0)+t(1,1,1)\)`,
        String.raw`\(\vec r=(3,1,1)+t(1,0,1)\)`,
        String.raw`\(\vec r=(2,0,1)+t(0,1,0)\)`,
      ],
      correctIndex: 0,
      rationale: "Subtracting gives y=1; then x+z=2. Let z=t to obtain the listed line.",
      steps: [
        { label: "Eliminate", text: "Subtract the equations.", math: String.raw`\[2y=2\Rightarrow y=1\]` },
        { label: "Parameterize", text: "Let z=t in x+z=2.", math: String.raw`\[x=2-t\Rightarrow \vec r=(2,1,0)+t(-1,0,1)\]` },
      ],
    },
    {
      id: "fx-7",
      prompt: String.raw`Find the distance from \(P(3,2,0)\) to \(\vec r=(1,1,1)+t(2,0,-1)\).`,
      tags: ["A", "T"],
      options: [String.raw`\(0\)`, String.raw`\(1\)`, String.raw`\(\sqrt5\)`, String.raw`\(5\)`],
      correctIndex: 1,
      rationale: "AP=(2,1,-1), AP×d=(-1,0,-2), and both the numerator and denominator have magnitude √5.",
      steps: [
        { label: "Apply formula", text: "Use the cross-product distance formula.", math: String.raw`\[d=\frac{\|(2,1,-1)\times(2,0,-1)\|}{\|(2,0,-1)\|}=\frac{\|(-1,0,-2)\|}{\sqrt5}=1\]` },
      ],
    },
    {
      id: "fx-8",
      prompt: "Substituting a line into a plane simplifies to 0=0. Which conclusion communicates the result completely?",
      tags: ["C"],
      options: [
        "The equations are wrong.",
        "The line is parallel to the plane, so there is no intersection.",
        "Every point on the line satisfies the plane; the line lies in the plane and there are infinitely many intersections.",
        "The plane lies on the line.",
      ],
      correctIndex: 2,
      rationale: "An identity means the equation is true for every parameter value, not just one.",
      steps: [{ label: "Interpret the identity", text: "No restriction remains on t.", math: String.raw`\[0=0\ \text{for all }t\in\mathbb R\Rightarrow L\subset\Pi\]` }],
    },
    {
      id: "fx-9",
      prompt: String.raw`Which three points should be plotted first to sketch \(3x+2y+6z=6\) by intercepts?`,
      tags: ["K", "A"],
      options: [
        String.raw`\((2,0,0),(0,3,0),(0,0,1)\)`,
        String.raw`\((3,0,0),(0,2,0),(0,0,6)\)`,
        String.raw`\((6,0,0),(0,6,0),(0,0,6)\)`,
        String.raw`\((1,0,0),(0,1,0),(0,0,1)\)`,
      ],
      correctIndex: 0,
      rationale: "Set the other two variables to zero for each axis intercept.",
      steps: [
        { label: "Find the intercepts", text: "Solve each one-variable equation.", math: String.raw`\[x=2,\qquad y=3,\qquad z=1\]` },
      ],
    },
    {
      id: "fx-10",
      prompt: String.raw`Find the distance from \(P(4,1)\) to \(3x-4y+2=0\).`,
      tags: ["A"],
      options: [String.raw`\(2\)`, String.raw`\(\frac{10}{7}\)`, String.raw`\(\sqrt5\)`, String.raw`\(10\)`],
      correctIndex: 0,
      rationale: "Substitute the point into the numerator and divide by the magnitude of the normal.",
      steps: [
        { label: "Use the R² formula", text: "Evaluate the numerator and denominator.", math: String.raw`\[d=\frac{|3(4)-4(1)+2|}{\sqrt{3^2+(-4)^2}}=\frac{10}{5}=2\]` },
      ],
    },
    {
      id: "fx-11",
      kind: "written",
      prompt: String.raw`Two lines intersect at \(P=(1,0,2)\) and have directions \(\vec d_1=(1,1,0)\) and \(\vec d_2=(0,1,1)\). Construct a Cartesian equation of their plane and verify the result.`,
      tags: ["A", "T", "C"],
      criteria: [
        "Uses the intersection point as the anchor.",
        "Finds a non-zero normal with d₁ cross d₂.",
        "Builds and simplifies the Cartesian equation.",
        "Verifies the anchor and both directions.",
      ],
      sampleAnswer: "The lines provide two in-plane directions. Their cross product is (1,1,0) cross (0,1,1)=(1,-1,1), so a normal is n=(1,-1,1). Using P gives (x-1)-y+(z-2)=0, or x-y+z=3. The point P satisfies the equation, and the normal has dot product 0 with each line direction, so the plane is verified.",
      rationale: "Two intersecting lines determine a plane when their direction vectors are not parallel.",
      steps: [
        { label: "Find the normal", text: "Cross the line directions.", math: String.raw`\[(1,1,0)\times(0,1,1)=(1,-1,1)\]` },
        { label: "Use the intersection point", text: "Build point-normal form.", math: String.raw`\[(x-1)-y+(z-2)=0\Rightarrow x-y+z=3\]` },
        { label: "Verify", text: "Check the anchor and perpendicularity.", math: String.raw`\[(1,-1,1)\cdot(1,1,0)=0,\quad(1,-1,1)\cdot(0,1,1)=0\]` },
      ],
    },
    {
      id: "fx-12",
      kind: "written",
      prompt: String.raw`A line \(\vec r=(0,0,0)+t(1,-1,0)\) is compared with the plane \(x+y+z=2\). Explain the relationship using both a vector test and a geometric conclusion.`,
      tags: ["K", "T", "C"],
      criteria: [
        "Identifies the plane normal.",
        "Uses the dot product to establish parallel direction.",
        "Checks whether the line anchor lies in the plane.",
        "States that the line and plane have no intersection.",
      ],
      sampleAnswer: "The plane normal is n=(1,1,1). The dot product n dot d is 1-1+0=0, so the line direction is parallel to the plane. The anchor (0,0,0) does not satisfy x+y+z=2. Therefore the entire line is outside the plane, the line is parallel to it, and there are no intersection points.",
      rationale: "A zero normal-direction dot product gives parallel direction. The anchor test then separates a contained line from a disjoint one.",
      steps: [
        { label: "Vector test", text: "Use the plane normal and line direction.", math: String.raw`\[(1,1,1)\cdot(1,-1,0)=0\]` },
        { label: "Anchor test", text: "Evaluate the plane at the origin.", math: String.raw`\[0+0+0\ne2\]` },
        { label: "Conclusion", text: "The line is parallel and disjoint.", math: String.raw`\[L\parallel\Pi,\qquad L\cap\Pi=\varnothing\]` },
      ],
    },
  ],
};

const testOneQuestions: AssessmentQuestion[] = [
  choiceQuestion("t1-1", "Read a direction vector from \\(x=3-2t,\\ y=4,\\ z=1+5t\\).",
    ["\\((3,4,1)\\)", "\\((-2,0,5)\\)", "\\((-2,4,5)\\)", "\\((2,0,5)\\)"], 1, ["K"],
    "The coefficients of the shared parameter are the direction components. The constant y-coordinate has direction component zero.", "\\vec d=(-2,0,5)"),
  choiceQuestion("t1-2", "Which vector is normal to the line \\(5x+2y-7=0\\) in \\(\\mathbb R^2\\)?",
    ["\\((2,-5)\\)", "\\((5,-2)\\)", "\\((5,2)\\)", "\\((7,0)\\)"], 2, ["K"],
    "For Ax+By+C=0, the coefficient vector (A,B) is a normal.", "\\vec n=(5,2)"),
  choiceQuestion("t1-3", "Which point does NOT lie on \\(\\vec r=(0,1,2)+t(1,-1,2)\\)?",
    ["\\((1,0,4)\\)", "\\((2,-1,6)\\)", "\\((-1,2,0)\\)", "\\((1,0,3)\\)"], 3, ["A"],
    "For the final point, x=1 requires t=1, which gives z=4 rather than z=3.", "t=1\\Rightarrow\\vec r=(1,0,4)\\ne(1,0,3)"),
  choiceQuestion("t1-4", "Which plane passes through the origin and has normal \\((2,-1,3)\\)?",
    ["\\(2x-y+3z=0\\)", "\\(x+2y+3z=0\\)", "\\(2x-y+3z=1\\)", "\\(2x+y-3z=0\\)"], 0, ["K", "A"],
    "Use the normal as the coefficient vector. The constant must be zero because the origin lies on the plane.", "(2,-1,3)\\cdot(x,y,z)=0"),
  choiceQuestion("t1-5", "Which pair can serve as independent span vectors for \\(x+2y+z=0\\)?",
    ["\\((2,-1,0),(1,0,-1)\\)", "\\((1,2,1),(2,4,2)\\)", "\\((1,0,0),(0,1,0)\\)", "\\((2,-1,0),(4,-2,0)\\)"], 0, ["A", "T"],
    "Both listed spans must be perpendicular to the normal and must not be parallel to one another.", "(1,2,1)\\cdot(2,-1,0)=0,\\quad(1,2,1)\\cdot(1,0,-1)=0"),
  choiceQuestion("t1-6", "What is the relationship between \\(x+2y+2z=1\\) and \\(2x+y-2z=3\\)?",
    ["Coincident", "Parallel and distinct", "Perpendicular", "They meet at exactly one point"], 2, ["K", "A"],
    "Their non-zero normals have dot product zero, so the planes are perpendicular.", "(1,2,2)\\cdot(2,1,-2)=2+2-4=0"),
  choiceQuestion("t1-7", "Find the vector projection of \\(\\vec u=(2,1,2)\\) onto \\(\\vec d=(1,0,1)\\).",
    ["\\((1,0,1)\\)", "\\((2,0,2)\\)", "\\((0,1,0)\\)", "\\((4,0,4)\\)"], 1, ["A"],
    "Multiply the target direction by the dot product divided by its squared magnitude.", "\\operatorname{proj}_{\\vec d}\\vec u=\\frac{4}{2}(1,0,1)=(2,0,2)"),
  choiceQuestion("t1-8", "How many planes contain all three points \\((1,2,3)\\), \\((2,4,6)\\), and \\((3,6,9)\\)?",
    ["None", "Exactly one", "Exactly two", "Infinitely many"], 3, ["K", "T"],
    "The points are collinear. Infinitely many planes contain their common line.", "\\overrightarrow{AB}=(1,2,3),\\quad\\overrightarrow{AC}=2(1,2,3)"),
  writtenQuestion("t1-9", "A line passes through \\(A(2,-1,3)\\) and \\(B(-2,5,1)\\). (a) Find a simplified direction and its exact magnitude. (b) Write vector and symmetric equations.",
    ["A", "C"],
    ["Finds a simplified direction (-2,3,-1) (1 mark).", "Gives exact magnitude square root of 14 (1 mark).", "Writes a valid vector equation (1 mark).", "Writes a valid symmetric equation (1 mark)."],
    "Since \\(B-A=(-4,6,-2)=2(-2,3,-1)\\), choose \\(\\vec d=(-2,3,-1)\\), with \\(\\|\\vec d\\|=\\sqrt{14}\\). Then \\(\\vec r=(2,-1,3)+t(-2,3,-1)\\) and \\(\\frac{x-2}{-2}=\\frac{y+1}{3}=\\frac{z-3}{-1}\\).",
    [workedStep("Direction and magnitude", "Simplify the displacement before calculating its magnitude.", "\\vec d=(-2,3,-1),\\qquad\\|\\vec d\\|=\\sqrt{4+9+1}=\\sqrt{14}"),
      workedStep("Represent", "Use A as the anchor.", "\\vec r=(2,-1,3)+t(-2,3,-1),\\qquad\\frac{x-2}{-2}=\\frac{y+1}{3}=\\frac{z-3}{-1}")]),
  writtenQuestion("t1-10", "In \\(\\mathbb R^2\\), a line passes through \\(A(-2,3)\\) with direction \\((3,-4)\\). (a) Find a scalar equation. (b) Decide whether \\(P(1,-1)\\) lies on it, showing a check.",
    ["A", "C"],
    ["Finds a perpendicular normal (4,3) (1 mark).", "Uses the given point correctly (1 mark).", "Obtains 4x+3y-1=0 (1 mark).", "Verifies that P lies on the line (1 mark)."],
    "A normal is \\((4,3)\\), since \\(4(3)+3(-4)=0\\). Point-normal form gives \\(4(x+2)+3(y-3)=0\\), so \\(4x+3y-1=0\\). For P, \\(4(1)+3(-1)-1=0\\); hence \\(P\\) lies on the line.",
    [workedStep("Normal", "Choose a perpendicular vector.", "(4,3)\\cdot(3,-4)=0"),
      workedStep("Equation", "Insert A into point-normal form.", "4(x+2)+3(y-3)=0\\Rightarrow4x+3y-1=0"),
      workedStep("Membership", "Substitute both coordinates of P.", "4(1)+3(-1)-1=0")]),
  writtenQuestion("t1-11", "Find a Cartesian equation of the plane through \\(A(1,0,0)\\), \\(B(0,2,0)\\), and \\(C(0,0,3)\\). Verify all three points and explain why the equation is unique up to a non-zero scalar multiple.",
    ["A", "T", "C"],
    ["Finds two connecting vectors and a non-zero normal (1 mark).", "Obtains 6x+3y+2z=6 (1 mark).", "Checks all three points (1 mark).", "Uses non-collinearity to justify a unique plane (1 mark)."],
    "The connecting vectors \\((-1,2,0)\\) and \\((-1,0,3)\\) have cross product \\((6,3,2)\\). Using A gives \\(6x+3y+2z=6\\). Substitution gives 6 at each point. The cross product is non-zero, so the points are not collinear and determine one plane. Multiplying the whole equation by a non-zero number changes only its representation.",
    [workedStep("Normal", "Cross the connecting vectors.", "(-1,2,0)\\times(-1,0,3)=(6,3,2)\\ne\\vec0"),
      workedStep("Equation", "Use A in point-normal form.", "6(x-1)+3y+2z=0"),
      workedStep("Verify", "Each intercept satisfies the equation.", "6(1)=3(2)=2(3)=6")]),
  writtenQuestion("t1-12", "Construct a Cartesian equation of the plane containing \\(L:\\vec r=(1,-1,2)+t(2,1,0)\\) and \\(Q(0,1,3)\\). Verify both the point Q and the entire line.",
    ["A", "T"],
    ["Forms a connector from the line anchor to Q (1 mark).", "Finds a valid non-zero normal (1 mark).", "Obtains x-2y+5z=13 (1 mark).", "Checks Q and the line parametrically (1 mark)."],
    "From the anchor A to Q, \\(\\overrightarrow{AQ}=(-1,2,1)\\). A normal is \\((2,1,0)\\times(-1,2,1)=(1,-2,5)\\). Thus \\(x-2y+5z=13\\). Q gives \\(0-2+15=13\\). For the line, \\((1+2t)-2(-1+t)+5(2)=13\\) for every t.",
    [workedStep("Normal", "Use the line direction and a connector to Q.", "(2,1,0)\\times(-1,2,1)=(1,-2,5)"),
      workedStep("Equation", "Use the line anchor.", "(x-1)-2(y+1)+5(z-2)=0\\Rightarrow x-2y+5z=13"),
      workedStep("Verify", "The parameter cancels when the line is substituted.", "(1+2t)-2(-1+t)+10=13")]),
  writtenQuestion("t1-13", "Classify \\(L_1:\\vec r=(0,1,0)+t(1,0,1)\\) and \\(L_2:\\vec r=(2,1,3)+s(2,0,2)\\). Explain why comparing the direction vectors alone is insufficient.",
    ["T", "C"],
    ["Establishes parallel directions (1 mark).", "Tests whether the second anchor lies on the first line (1 mark).", "Shows that the coordinate conditions conflict (1 mark).", "Concludes that the lines are parallel and distinct, not coincident (1 mark)."],
    "The second direction is twice the first, so the lines are parallel or coincident. The second anchor would require \\(t=2\\) from x and \\(t=3\\) from z on \\(L_1\\), which is impossible. Thus the lines are parallel and distinct. An anchor test is needed to distinguish this from coincidence.",
    [workedStep("Compare directions", "A scalar multiple establishes parallelism.", "(2,0,2)=2(1,0,1)"),
      workedStep("Test anchor", "One shared parameter is required.", "(t,1,t)=(2,1,3)\\Rightarrow t=2\\text{ and }t=3"),
      workedStep("Conclusion", "The anchors do not lie on the same line.", "L_1\\parallel L_2,\\qquad L_1\\ne L_2")]),
  writtenQuestion("t1-14", "A student uses \\((3,-2,1)\\) as an anchor for the plane \\(3x-2y+z=6\\) because these are its coefficients. Explain the error, test that proposed anchor, and provide a correct anchor with a point-normal equation.",
    ["T", "C"],
    ["Distinguishes a normal vector from an anchor point (1 mark).", "Shows that the proposed point gives 14, not 6 (1 mark).", "Finds a correct anchor such as (2,0,0) (1 mark).", "Writes correct point-normal form (1 mark)."],
    "The coefficient vector is a normal, not automatically a point on the plane. The proposed point gives \\(3(3)-2(-2)+1=14\\ne6\\). A correct anchor is \\((2,0,0)\\). Point-normal form is \\((3,-2,1)\\cdot((x,y,z)-(2,0,0))=0\\), or \\(3(x-2)-2y+z=0\\).",
    [workedStep("Test", "Coordinates of an anchor must satisfy the scalar equation.", "3(3)-2(-2)+1=14\\ne6"),
      workedStep("Correct", "Set y=z=0 and solve for x.", "A=(2,0,0),\\qquad3(x-2)-2y+z=0")]),
  writtenQuestion("t1-15", "For which real values of \\(k\\) does \\(\\vec r=s(1,2,3)+t(2,4,k)\\) describe a plane? Show a vector test and describe the exceptional case.",
    ["T", "C"],
    ["Computes or correctly analyzes the cross product (1 mark).", "Finds the exceptional value k=6 (1 mark).", "States that all k not equal to 6 produce a plane (1 mark).", "Explains that k=6 produces a line through the origin (1 mark)."],
    "The cross product is \\((1,2,3)\\times(2,4,k)=(2k-12,6-k,0)=(k-6)(2,-1,0)\\). This is non-zero exactly when \\(k\\ne6\\), so those values give a plane. At \\(k=6\\), the second span is twice the first and the expression reduces to \\(\\vec r=(s+2t)(1,2,3)\\), a line through the origin.",
    [workedStep("Independence", "A plane requires a non-zero cross product.", "(1,2,3)\\times(2,4,k)=(k-6)(2,-1,0)"),
      workedStep("Exceptional case", "At k=6 only one independent direction remains.", "\\vec r=(s+2t)(1,2,3)")]),
  writtenQuestion("t1-16", "The lines \\(L_1:\\vec r=(1,0,0)+t(1,1,0)\\) and \\(L_2:\\vec r=(0,0,1)+s(1,1,0)\\) are parallel and distinct. Find the plane containing them. Explain why the common direction alone does not determine this plane.",
    ["T", "C"],
    ["Uses the connector (-1,0,1) as a second direction (1 mark).", "Finds normal (1,-1,1) (1 mark).", "Obtains x-y+z=1 (1 mark).", "Explains the need for two independent in-plane directions (1 mark)."],
    "Use the common direction \\((1,1,0)\\) and the connector \\((-1,0,1)\\). Their cross product is \\((1,-1,1)\\). Using \\((1,0,0)\\) gives \\(x-y+z=1\\). Both anchors satisfy it, and the common direction is perpendicular to its normal. One direction alone leaves infinitely many planes; the connector supplies the second independent direction.",
    [workedStep("Second span", "Connect the two anchors.", "(0,0,1)-(1,0,0)=(-1,0,1)"),
      workedStep("Normal and equation", "Cross the independent spans.", "(1,1,0)\\times(-1,0,1)=(1,-1,1),\\qquad x-y+z=1")]),
];

const testTwoQuestions: AssessmentQuestion[] = [
  choiceQuestion("t2-1", "A line has direction \\((2,-1,2)\\). How is it oriented relative to \\(2x-y+2z=5\\)?",
    ["It is parallel to the plane.", "It is perpendicular to the plane.", "It must lie in the plane.", "It is skew to the plane."], 1, ["K"],
    "The line direction equals the plane normal, so the line is perpendicular to the plane.", "\\vec d=(2,-1,2)=\\vec n"),
  choiceQuestion("t2-2", "Find the distance from \\((0,0,0)\\) to \\(x-2y+2z=9\\).",
    ["\\(1\\)", "\\(3\\)", "\\(9\\)", "\\(\\sqrt{5}\\)"], 1, ["A"],
    "The normal has magnitude 3, while the absolute residual at the origin is 9.", "d=\\frac9{\\sqrt{1+4+4}}=3"),
  choiceQuestion("t2-3", "Two planes have non-zero normals \\(\\vec n_1,\\vec n_2\\) with \\(\\vec n_1\\times\\vec n_2=\\vec0\\). What can be concluded from this test alone?",
    ["They are perpendicular.", "They intersect in exactly one line.", "They are parallel or coincident.", "They have no common points."], 2, ["K", "T"],
    "Parallel normals imply parallel orientations. Constants or a shared-point test are still required to distinguish distinct planes from coincidence.", "\\vec n_2=\\lambda\\vec n_1\\quad(\\lambda\\ne0)"),
  choiceQuestion("t2-4", "Find the acute angle between \\(x=0\\) and \\(x+y=0\\).",
    ["\\(0^\\circ\\)", "\\(30^\\circ\\)", "\\(45^\\circ\\)", "\\(90^\\circ\\)"], 2, ["A"],
    "Use normals (1,0,0) and (1,1,0), with the absolute dot product.", "\\cos\\theta=\\frac1{\\sqrt2}\\Rightarrow\\theta=45^\\circ"),
  choiceQuestion("t2-5", "A consistent three-variable system reduces to \\(x+y=2\\) and \\(y-z=1\\), with no other independent constraint. Its solution set is:",
    ["One point", "A line", "A plane", "All of three-dimensional space"], 1, ["K", "T"],
    "Two independent constraints leave one free parameter.", "z=t,\\quad y=1+t,\\quad x=1-t"),
  choiceQuestion("t2-6", "Find the distance from \\(P(4,6,5)\\) to \\(\\vec r=(1,2,0)+t(0,0,1)\\).",
    ["\\(\\sqrt{50}\\)", "\\(5\\)", "\\(\\sqrt{41}\\)", "\\(9\\)"], 1, ["A"],
    "The line is vertical. The closest point has the same z-coordinate as P, so only the x- and y-displacements contribute.", "d=\\sqrt{(4-1)^2+(6-2)^2}=5"),
  choiceQuestion("t2-7", "Classify \\(\\vec r=(1,2,0)+t(1,0,1)\\) relative to \\(x+y-z=3\\).",
    ["Exactly one intersection", "Contained in the plane", "Parallel and disjoint", "Perpendicular to the plane"], 1, ["A"],
    "Substitution produces an identity for every parameter value.", "(1+t)+2-t=3"),
  choiceQuestion("t2-8", "For two non-parallel lines, let \\(\\vec c\\) connect their anchors. If \\(\\vec c\\cdot(\\vec d_1\\times\\vec d_2)\\ne0\\), the lines are:",
    ["Coincident", "Intersecting", "Parallel", "Skew"], 3, ["T"],
    "A non-zero scalar triple product means the connector and directions are not coplanar. Non-coplanar lines cannot intersect.", "\\vec c\\cdot(\\vec d_1\\times\\vec d_2)\\ne0\\Rightarrow\\text{non-coplanar}"),
  writtenQuestion("t2-9", "Find the intersection of \\(L:\\vec r=(2,-1,1)+t(1,2,-1)\\) and \\(\\Pi:x-y+z=0\\). Verify that the point satisfies both representations.",
    ["A", "C"],
    ["Substitutes all parametric coordinates into the plane (1 mark).", "Finds t=2 (1 mark).", "Obtains (4,3,-1) (1 mark).", "Verifies both line and plane membership (1 mark)."],
    "Substitution gives \\((2+t)-(-1+2t)+(1-t)=0\\), hence \\(4-2t=0\\) and \\(t=2\\). The intersection is \\((4,3,-1)\\). It equals the line evaluated at 2 and satisfies \\(4-3-1=0\\).",
    [workedStep("Substitute", "Keep the negative sign before the y-expression.", "2+t+1-2t+1-t=0\\Rightarrow t=2"),
      workedStep("Evaluate and check", "Return to the line, then test the plane.", "P=(4,3,-1),\\qquad4-3-1=0")]),
  writtenQuestion("t2-10", "Determine the intersection line of \\(2x+y-z=3\\) and \\(x-y+z=0\\). Give vector form and verify your anchor and direction.",
    ["A", "C"],
    ["Eliminates y and z to obtain x=1 (1 mark).", "Finds the relation z=y-1 (1 mark).", "Writes a valid vector equation (1 mark).", "Checks both the anchor and direction (1 mark)."],
    "Adding the equations gives \\(3x=3\\), so \\(x=1\\). The second gives \\(z=y-1\\). Set \\(y=1+t\\) to obtain \\(\\vec r=(1,1,0)+t(0,1,1)\\). The anchor gives 3 and 0 in the respective equations; the direction has dot product zero with both normals.",
    [workedStep("Eliminate", "Add the equations.", "3x=3\\Rightarrow x=1,\\qquad1-y+z=0"),
      workedStep("Parameterize", "Let y=1+t.", "\\vec r=(1,1,0)+t(0,1,1)"),
      workedStep("Verify direction", "Test both normals.", "(2,1,-1)\\cdot(0,1,1)=0,\\quad(1,-1,1)\\cdot(0,1,1)=0")]),
  writtenQuestion("t2-11", "Solve the three-plane system \\(x+y+z=6\\), \\(x-y+z=2\\), and \\(2x+y-z=3\\). State the geometric meaning and verify the result in all equations.",
    ["A", "T"],
    ["Eliminates to obtain y=2 (1 mark).", "Solves the remaining independent equations (1 mark).", "Finds the unique point (5/3,2,7/3) (1 mark).", "Verifies it in all three planes and states uniqueness (1 mark)."],
    "Subtracting the second equation from the first gives \\(y=2\\). Then \\(x+z=4\\) and \\(2x-z=1\\). Adding gives \\(x=5/3\\), and \\(z=7/3\\). The three planes have exactly one common point, \\((5/3,2,7/3)\\). Its substitutions give 6, 2, and 3.",
    [workedStep("Eliminate", "Use the first two equations.", "2y=4\\Rightarrow y=2"),
      workedStep("Solve", "Substitute y into the remaining equations.", "x+z=4,\\quad2x-z=1\\Rightarrow x=\\frac53,\\ z=\\frac73"),
      workedStep("Verify", "Evaluate all left-hand sides.", "\\frac53+2+\\frac73=6,\\quad\\frac53-2+\\frac73=2,\\quad\\frac{10}3+2-\\frac73=3")]),
  writtenQuestion("t2-12", "Find the exact distance from \\(P(4,1,2)\\) to \\(L:\\vec r=(1,-1,0)+t(1,2,2)\\). Show the cross product used and explain why dividing by the direction magnitude is necessary.",
    ["A", "T", "C"],
    ["Forms AP=(3,2,2) (1 mark).", "Computes AP cross d=(0,-4,4) (1 mark).", "Obtains exact distance 4 square root of 2 divided by 3 (1 mark).", "Explains the parallelogram area divided by base length (1 mark)."],
    "The connector is \\(\\overrightarrow{AP}=(3,2,2)\\), and \\(\\overrightarrow{AP}\\times\\vec d=(0,-4,4)\\). Thus \\(d=\\sqrt{32}/3=4\\sqrt2/3\\). The cross-product magnitude is the area of a parallelogram whose base has length \\(\\|\\vec d\\|\\); dividing by that base gives the perpendicular height.",
    [workedStep("Connector and cross product", "Use the line anchor A.", "(3,2,2)\\times(1,2,2)=(0,-4,4)"),
      workedStep("Distance", "Divide area by base length.", "d=\\frac{\\sqrt{0^2+(-4)^2+4^2}}{\\sqrt{1+4+4}}=\\frac{4\\sqrt2}{3}")]),
  writtenQuestion("t2-13", String.raw`For \(P(4,1)\) and \(L:\vec r=(-1,2)+t(2,1)\) in \(\mathbb R^2\), use projection to find the closest point \(H\) on the line and the exact distance \(PH\). Verify why this connector gives the shortest distance.`,
    ["A", "T", "C"],
    ["Finds the foot parameter t=9/5 using projection (1 mark).", "Obtains H=(13/5,19/5) (1 mark).", "Obtains the exact distance 7 square root of 5 divided by 5 (1 mark).", "Shows PH is perpendicular to the line and explains that perpendicular separation is shortest (1 mark)."],
    String.raw`With anchor \(A=(-1,2)\), the connector is \(\overrightarrow{AP}=(5,-1)\). The foot parameter is \(t=\frac{(5,-1)\cdot(2,1)}{(2,1)\cdot(2,1)}=9/5\), giving \(H=(13/5,19/5)\). Thus \(P-H=(7/5,-14/5)\) and \(PH=7\sqrt5/5\). Its dot product with \((2,1)\) is zero, so it is the perpendicular connector and gives the shortest distance.`,
    [workedStep("Project the connector", "The projection coefficient gives the line parameter of the perpendicular foot.", String.raw`t=\frac{(5,-1)\cdot(2,1)}{(2,1)\cdot(2,1)}=\frac95`),
      workedStep("Find the foot and distance", "Evaluate the line at the foot parameter, then measure the connector.", String.raw`H=\left(\frac{13}5,\frac{19}5\right),\qquad PH=\sqrt{\frac{49}{25}+\frac{196}{25}}=\frac{7\sqrt5}{5}`),
      workedStep("Verify perpendicularity", "A zero dot product establishes the right angle.", String.raw`\left(\frac75,-\frac{14}5\right)\cdot(2,1)=0`)]),
  writtenQuestion("t2-14", "Find the acute angle between a line with direction \\((2,1,2)\\) and the plane \\(x+2y+2z=0\\). Give an exact inverse-trigonometric expression and an angle to the nearest tenth of a degree. Explain why sine, rather than cosine, appears.",
    ["T", "C"],
    ["Uses the plane normal (1,2,2) and dot product 8 (1 mark).", "Finds both magnitudes as 3 (1 mark).", "Obtains arcsin(8/9), approximately 62.7 degrees (1 mark).", "Explains that the line-plane angle complements the angle with the normal (1 mark)."],
    "With \\(\\vec n=(1,2,2)\\), \\(\\vec d\\cdot\\vec n=8\\), and both magnitudes equal 3. Thus \\(\\theta=\\sin^{-1}(8/9)\\approx62.7^\\circ\\). The dot-product cosine initially describes the angle with the normal. The line-plane angle is its complement, so its sine equals that cosine ratio.",
    [workedStep("Dot product", "Use the plane normal.", "(2,1,2)\\cdot(1,2,2)=8,\\qquad\\|\\vec d\\|=\\|\\vec n\\|=3"),
      workedStep("Line-plane angle", "Use the complementary angle relation.", "\\sin\\theta=\\frac89\\Rightarrow\\theta=\\sin^{-1}\\!\\left(\\frac89\\right)\\approx62.7^\\circ")]),
  writtenQuestion("t2-15", "Classify the planes \\(x+y+z=1\\) and \\(2x+2y+kz=3\\) for all real values of \\(k\\). For the intersecting case, find a vector equation of the common line.",
    ["T", "C"],
    ["Identifies k=2 as the parallel case (1 mark).", "Shows that k=2 gives distinct planes with no intersection (1 mark).", "Finds z=1/(k-2) when k is not 2 (1 mark).", "Gives a correct intersection line for k not equal to 2 (1 mark)."],
    "If \\(k=2\\), the second left-hand side is twice the first, but \\(3\\ne2\\), so the planes are parallel and distinct. If \\(k\\ne2\\), subtracting twice the first equation gives \\((k-2)z=1\\). Therefore \\(z=1/(k-2)\\) and \\(x+y=(k-3)/(k-2)\\). One line is \\(\\vec r=((k-3)/(k-2),0,1/(k-2))+t(1,-1,0)\\).",
    [workedStep("Eliminate", "Subtract twice the first equation.", "(k-2)z=1"),
      workedStep("Parallel case", "At k=2 the system is contradictory.", "k=2\\Rightarrow0=1"),
      workedStep("Intersecting case", "Let y=-t when k is not 2.", "\\vec r=\\left(\\frac{k-3}{k-2},0,\\frac1{k-2}\\right)+t(1,-1,0)")]),
  writtenQuestion("t2-16", "A student substitutes \\(L:\\vec r=(1,0,1)+t(1,-1,0)\\) into \\(\\Pi:x+y+z=2\\), obtains \\(0=0\\), and concludes \"one intersection at t=0.\" Correct the reasoning and state the complete intersection set.",
    ["T", "C"],
    ["Shows the substitution is an identity (1 mark).", "Explains that no restriction on t remains (1 mark).", "States that every point of the line lies in the plane (1 mark).", "Gives the full intersection set with all real t (1 mark)."],
    "Substitution gives \\((1+t)-t+1=2\\), an identity for every real t. It does not force \\(t=0\\). The line is contained in the plane, so there are infinitely many common points and \\(L\\cap\\Pi=\\{(1+t,-t,1):t\\in\\mathbb R\\}\\).",
    [workedStep("Substitute", "Simplify without assigning a parameter value.", "(1+t)-t+1=2\\Rightarrow2=2"),
      workedStep("Interpret", "An identity is true for every real parameter.", "L\\subset\\Pi,\\qquad L\\cap\\Pi=L")]),
];

export const tests: Assessment[] = [
  { id: "test-representation", number: "01", title: "Lines and plane construction", description: "A 40-mark unit test on line equations, plane construction, vector reasoning, and verification.", kind: "test", mode: "exam", timeLimit: "60 min", instructions: assessmentInstructions, questions: academicQuestions(testOneQuestions) },
  { id: "test-spatial-reasoning", number: "02", title: "Intersections, distances, and angles", description: "A 40-mark unit test on spatial systems, exact measurement, and complete geometric justification.", kind: "test", mode: "exam", timeLimit: "65 min", instructions: assessmentInstructions, questions: academicQuestions(testTwoQuestions) },
];

const finalExamAdditional: AssessmentQuestion[] = [
  choiceQuestion("fx-13", String.raw`In \(\mathbb R^2\), which parametric equations represent \(\vec r=(2,-1)+t(3,2)\)?`,
    [String.raw`\(x=2+3t,\ y=-1+2t\)`, String.raw`\(x=3+2t,\ y=2-t\)`, String.raw`\(x=2+3t,\ y=1+2t\)`, String.raw`\(x=2+3s,\ y=-1+2t\), with independent \(s,t\)`],
    0, ["K", "A"], "Each coordinate uses the same parameter. The starting point supplies the constants and the direction supplies the parameter coefficients.", String.raw`\vec r=(2+3t,-1+2t)`),
  choiceQuestion("fx-14", String.raw`Which statement gives the correct sketching information for the plane \(x+y=0\) in \(\mathbb R^3\)?`,
    ["It is the coordinate plane z=0.", "It is only a line in the xy-plane.", "It contains the z-axis, and three distinct non-zero axis intercepts cannot be used to sketch it.", "It has the three intercepts (1,0,0), (0,1,0), and (0,0,1)."],
    2, ["K", "T"], "The variable z is unrestricted. Every point (0,0,z) satisfies the equation, so the whole z-axis lies in the plane. Both x- and y-axis intersections occur at the origin.", String.raw`x=y=0\Rightarrow 0=0\quad\text{for every }z\in\mathbb R`),
  choiceQuestion("fx-15", String.raw`Elimination in a system of three linear equations produces the equation \(0=4\). What does this establish?`,
    ["The system has one solution.", "The solution set is a line.", "The solution set is a plane.", "The system is inconsistent and has no common solution."],
    3, ["K", "T"], "A contradiction cannot hold for any values of the variables. Since elimination preserves the solution set, the original equations have no simultaneous solution.", String.raw`0=4\quad\text{is false}\Rightarrow\text{no solution}`),
  choiceQuestion("fx-16", String.raw`The planes are \(x+y+z=2\), \(2x-y+z=1\), and \(3x+2z=3\). What is their common solution set?`,
    ["Exactly one point", "A line", "A plane", "No common points"],
    1, ["T"], "The third equation is the sum of the first two. Their normals are not parallel, so the two independent constraints determine a line; the third adds no restriction.", String.raw`(x+y+z)+(2x-y+z)=3x+2z=3`),
  writtenQuestion("fx-17", String.raw`For the line \(3x-4y+5=0\) in \(\mathbb R^2\), (a) find an anchor and a direction vector, (b) write vector and parametric equations, and (c) find its exact distance from the origin.`,
    ["A", "C"],
    ["Chooses a direction perpendicular to (3,-4), such as (4,3) (1 mark).", "Finds an anchor satisfying the equation, such as (1,2) (1 mark).", "Writes correct vector and parametric equations with one shared parameter (1 mark).", "Calculates the exact origin-to-line distance as 1 (1 mark)."],
    String.raw`A normal is \((3,-4)\), so choose \(\vec d=(4,3)\). The point \((1,2)\) lies on the line because \(3-8+5=0\). Thus \(\vec r=(1,2)+t(4,3)\), with \(x=1+4t\), \(y=2+3t\), \(t\in\mathbb R\). The distance from the origin is \(d=|5|/\sqrt{3^2+(-4)^2}=1\).`,
    [workedStep("Anchor and direction", "An anchor satisfies the equation; a direction is perpendicular to its normal.", String.raw`3(1)-4(2)+5=0,\qquad(3,-4)\cdot(4,3)=0`),
      workedStep("Represent the line", "Use one real parameter for both coordinates.", String.raw`\vec r=(1,2)+t(4,3),\qquad x=1+4t,\quad y=2+3t`),
      workedStep("Distance", "Substitute the origin into the scalar distance formula.", String.raw`d=\frac{|3(0)-4(0)+5|}{\sqrt{3^2+(-4)^2}}=1`)]),
  writtenQuestion("fx-18", String.raw`A line passes through \(A(2,-1,3)\) and \(B(2,3,1)\). Write vector and symmetric equations, handling the zero direction component correctly. Then determine whether \(P(2,5,0)\) lies on the line.`,
    ["A", "C"],
    ["Finds a valid direction such as (0,2,-1) (1 mark).", "Writes a correct vector equation (1 mark).", "Writes x=2 separately and equates only the non-zero direction ratios (1 mark).", "Uses the same parameter in all coordinates to verify that P lies on the line (1 mark)."],
    String.raw`The displacement is \(B-A=(0,4,-2)\), so choose \(\vec d=(0,2,-1)\). The vector equation is \(\vec r=(2,-1,3)+t(0,2,-1)\). Symmetric form is \(x=2\), \(\frac{y+1}{2}=\frac{z-3}{-1}\). For \(t=3\), the line gives \((2,5,0)\), so \(P\) lies on it.`,
    [workedStep("Direction", "Simplify the displacement without changing the line.", String.raw`B-A=(0,4,-2)=2(0,2,-1)`),
      workedStep("Equation forms", "A zero direction component gives a fixed coordinate, not division by zero.", String.raw`\vec r=(2,-1,3)+t(0,2,-1),\qquad x=2,\quad\frac{y+1}{2}=\frac{z-3}{-1}`),
      workedStep("Membership", "Substitute one shared parameter.", String.raw`t=3\Rightarrow(2,-1+6,3-3)=(2,5,0)`)]),
  writtenQuestion("fx-19", String.raw`The plane is \(\vec r=(0,1,-1)+s(1,0,2)+t(0,2,-1)\). (a) Write its parametric equations. (b) Find a Cartesian equation. (c) Explain why the two spans define a plane rather than a line.`,
    ["A", "T", "C"],
    ["Writes all three parametric equations correctly (1 mark).", "Finds a non-zero normal (-4,1,2), or a scalar multiple (1 mark).", "Obtains -4x+y+2z=-1, or an equivalent equation (1 mark).", "Uses the non-zero cross product to explain span independence and the plane dimension (1 mark)."],
    String.raw`The parametric equations are \(x=s\), \(y=1+2t\), and \(z=-1+2s-t\). The cross product of the spans is \((-4,1,2)\), so a Cartesian equation is \(-4x+y+2z=-1\). The cross product is non-zero, which proves that the spans are not parallel. They provide two independent directions and therefore define a plane.`,
    [workedStep("Parametric form", "Read each coordinate separately.", String.raw`x=s,\qquad y=1+2t,\qquad z=-1+2s-t`),
      workedStep("Normal", "Cross the two spanning vectors.", String.raw`(1,0,2)\times(0,2,-1)=(-4,1,2)\ne\vec0`),
      workedStep("Cartesian form", "Use the anchor (0,1,-1) in point-normal form.", String.raw`-4x+(y-1)+2(z+1)=0\Rightarrow-4x+y+2z=-1`)]),
  writtenQuestion("fx-20", String.raw`Describe how to sketch \(2x+3z=6\) in \(\mathbb R^3\). Give the x- and z-intercepts, explain why there is no y-intercept, and identify the direction in which the plane extends. Give one additional point that helps show this extension.`,
    ["A", "C"],
    ["Finds the intercepts (3,0,0) and (0,0,2) (1 mark).", "Explains that setting x=z=0 gives a contradiction, so no y-axis point lies on the plane (1 mark).", "States that y is unrestricted and the plane extends in the y-direction (1 mark).", "Gives a valid additional point such as (3,1,0) and describes extending the intercept segment parallel to the y-axis (1 mark)."],
    String.raw`The x-intercept is \((3,0,0)\) and the z-intercept is \((0,0,2)\). A y-axis point has \(x=z=0\), which would require \(0=6\), so there is no y-intercept. Since \(y\) does not appear, draw the segment between the intercepts and extend it in both y-directions to represent the infinite plane. For example, \((3,1,0)\) also lies on the plane.`,
    [workedStep("Intercepts", "Set the other coordinates to zero.", String.raw`z=0\Rightarrow x=3,\qquad x=0\Rightarrow z=2`),
      workedStep("Missing intercept", "Test the entire y-axis.", String.raw`x=z=0\Rightarrow0=6\quad\text{which is impossible}`),
      workedStep("Extend the sketch", "The y-coordinate is free.", String.raw`(3,y,0)\in\Pi\quad\text{for all }y\in\mathbb R`)]),
  writtenQuestion("fx-21", String.raw`Determine the relationship between \(L_1:\vec r=(1,-1,2)+t(2,1,-1)\) and \(L_2:\vec r=(2,4,-3)+s(1,-1,1)\). Find any intersection, verify all coordinates, and state a complete geometric conclusion.`,
    ["A", "T", "C"],
    ["Equates coordinates using distinct parameters (1 mark).", "Finds t=2 and s=3 (1 mark).", "Finds the point (5,1,0) (1 mark).", "Checks the third coordinate as well as the coordinates used to solve (1 mark).", "Uses the non-parallel directions to conclude that the lines intersect at exactly one point (1 mark)."],
    String.raw`The x- and y-equations give \(2t-s=1\) and \(t+s=5\). Their solution is \(t=2\), \(s=3\), giving \((5,1,0)\). The z-coordinates agree because \(2-2=-3+3=0\). The directions are not scalar multiples, so the lines intersect at exactly one point, \((5,1,0)\).`,
    [workedStep("Equate coordinates", "Keep the two parameters independent.", String.raw`1+2t=2+s,\qquad-1+t=4-s,\qquad2-t=-3+s`),
      workedStep("Solve", "Add the first two simplified equations.", String.raw`2t-s=1,\quad t+s=5\Rightarrow3t=6\Rightarrow t=2,\ s=3`),
      workedStep("Verify and classify", "Both lines produce the same three coordinates, and their directions are not parallel.", String.raw`\vec r_1(2)=\vec r_2(3)=(5,1,0)`)], 5),
  writtenQuestion("fx-22", String.raw`Solve the system \(x+y+z=6\), \(2x-y+z=3\), and \(x+2y-z=2\) by elimination. Show your reduced equations, verify the solution in all three original equations, and interpret the result as an intersection of planes.`,
    ["A", "T", "C"],
    ["Eliminates x to obtain 3y+z=9 (1 mark).", "Obtains the independent equation y-2z=-4 (1 mark).", "Solves y=2 and z=3 (1 mark).", "Finds x=1 (1 mark).", "Checks all three original equations and identifies one common point (1 mark)."],
    String.raw`Subtracting twice the first equation from the second gives \(3y+z=9\). Subtracting the first from the third gives \(y-2z=-4\). Solving gives \(y=2\), \(z=3\), then \(x=1\). The left sides of the original equations become \(6\), \(3\), and \(2\). Thus the system is consistent with the unique solution \((1,2,3)\), and the three planes meet at this point.`,
    [workedStep("Eliminate x", "Use equation 1 to eliminate x from equations 2 and 3.", String.raw`E_2-2E_1:\ -3y-z=-9,\qquad E_3-E_1:\ y-2z=-4`),
      workedStep("Solve the reduced system", "Substitute z=9-3y into the second reduced equation.", String.raw`y-2(9-3y)=-4\Rightarrow7y=14\Rightarrow y=2,\ z=3,\ x=1`),
      workedStep("Verify", "Check all three original equations.", String.raw`1+2+3=6,\qquad2(1)-2+3=3,\qquad1+2(2)-3=2`)], 5),
  writtenQuestion("fx-23", String.raw`For all real values of \(k\), classify the system \(x+y+z=3\), \(x-y+z=1\), and \(2x+ky+2z=5\). Give the complete common solution set when one exists, and explain whether a unique solution is possible.`,
    ["T", "C"],
    ["Uses the first two equations to find y=1 (1 mark).", "Obtains x+z=2 (1 mark).", "Derives the compatibility condition k=1 from the third equation (1 mark).", "Gives the intersection line r=(2,1,0)+t(-1,0,1) when k=1 (1 mark).", "Concludes that k not equal to 1 is inconsistent and that no k gives a unique point (1 mark)."],
    String.raw`Subtracting the second equation from the first gives \(y=1\), and then \(x+z=2\). The third equation becomes \(2(x+z)+k=5\), or \(4+k=5\). For \(k=1\), it adds no new restriction, so the solution set is \(\vec r=(2,1,0)+t(-1,0,1)\), \(t\in\mathbb R\). For \(k\ne1\), the third equation contradicts the first two, so the system is inconsistent. No value of \(k\) produces a unique point.`,
    [workedStep("First two planes", "Subtract, then substitute y=1.", String.raw`2y=2\Rightarrow y=1,\qquad x+z=2`),
      workedStep("Third-plane condition", "Its restriction is independent of the free line parameter.", String.raw`2(x+z)+ky=5\Rightarrow4+k=5\Rightarrow k=1`),
      workedStep("Classify", "Let z=t in the consistent case.", String.raw`k=1:\ \vec r=(2,1,0)+t(-1,0,1),\ t\in\mathbb R;\qquad k\ne1:\ \varnothing`)], 5),
  writtenQuestion("fx-24", String.raw`Find the exact distance from \(P(4,1,2)\) to the plane \(2x-y+2z=3\). Also find the perpendicular foot \(H\), then verify that \(H\) lies on the plane and that \(\overrightarrow{HP}\) is normal to it.`,
    ["A", "T", "C"],
    ["Calculates the signed residual as 8 (1 mark).", "Uses the normal (2,-1,2) with magnitude 3 (1 mark).", "Obtains the exact distance 8/3 (1 mark).", "Finds H=(20/9,17/9,2/9) using the normal projection (1 mark).", "Verifies plane membership and that HP is a scalar multiple of the normal (1 mark)."],
    String.raw`The normal is \(\vec n=(2,-1,2)\), with magnitude \(3\). The residual at \(P\) is \(2(4)-1+2(2)-3=8\), so \(d=8/3\). The foot is \(H=P-\frac{8}{9}\vec n=(20/9,17/9,2/9)\). It satisfies \(2(20/9)-17/9+2(2/9)=3\). Also \(\overrightarrow{HP}=P-H=\frac89(2,-1,2)\), so the connector is perpendicular to the plane.`,
    [workedStep("Distance", "Divide the absolute residual by the normal magnitude.", String.raw`d=\frac{|2(4)-1+2(2)-3|}{\sqrt{2^2+(-1)^2+2^2}}=\frac83`),
      workedStep("Perpendicular foot", "Remove the normal component from P.", String.raw`H=(4,1,2)-\frac89(2,-1,2)=\left(\frac{20}9,\frac{17}9,\frac29\right)`),
      workedStep("Verify", "Check both membership and the normal direction of the connector.", String.raw`2\!\left(\frac{20}9\right)-\frac{17}9+2\!\left(\frac29\right)=3,\qquad P-H=\frac89\vec n`)], 5),
];

export const finalExam: Assessment = {
  ...originalFinalExam,
  kind: "exam",
  title: "Lines and Planes final examination",
  description: "A 60-mark examination on Sections 8.1 to 8.6 and 9.1 to 9.6, combining representation, sketching, intersections, systems, exact distances, and mathematical communication.",
  timeLimit: "100 min",
  instructions: assessmentInstructions,
  questions: academicQuestions([
    ...originalFinalExam.questions.map((question) => {
      if (question.id === "fx-11" && question.kind === "written") return {
        ...question, marks: 5,
        criteria: [
          "Uses the intersection point as the plane anchor (1 mark).",
          "Finds a non-zero normal using the cross product (1 mark).",
          "Builds and simplifies the Cartesian equation (1 mark).",
          "Verifies that the anchor satisfies the equation (1 mark).",
          "Verifies that both line directions are perpendicular to the normal (1 mark).",
        ],
      };
      if (question.id === "fx-12" && question.kind === "written") return {
        ...question, marks: 5,
        criteria: [
          "Identifies the plane normal (1 mark).",
          "Calculates the normal-direction dot product as zero (1 mark).",
          "Explains that this establishes a direction parallel to the plane (1 mark).",
          "Checks that the line anchor is outside the plane (1 mark).",
          "Concludes that the line is parallel and disjoint, with no intersection (1 mark).",
        ],
      };
      return question;
    }),
    ...finalExamAdditional,
  ]),
};

export const formulaGroups: FormulaGroup[] = [
  {
    title: "Lines",
    formulas: [
      { label: "Vector", math: String.raw`\(\vec r=\vec r_0+t\vec d\)`, note: "d ≠ 0" },
      { label: "Parametric", math: String.raw`\(x=x_0+at,\ y=y_0+bt,\ z=z_0+ct\)`, note: "one shared parameter" },
      { label: "Symmetric", math: String.raw`\(\frac{x-x_0}{a}=\frac{y-y_0}{b}=\frac{z-z_0}{c}\)`, note: "separate zero-direction coordinates" },
      { label: "R² scalar", math: String.raw`\(Ax+By+C=0\)`, note: "normal (A,B)" },
    ],
  },
  {
    title: "Planes",
    formulas: [
      { label: "Vector", math: String.raw`\(\vec r=\vec r_0+s\vec a+t\vec b\)`, note: "a and b independent" },
      { label: "Point-normal", math: String.raw`\(\vec n\cdot(\vec r-\vec r_0)=0\)`, note: "n perpendicular to plane" },
      { label: "Cartesian", math: String.raw`\(Ax+By+Cz+D=0\)`, note: "normal (A,B,C)" },
      { label: "Normal from spans", math: String.raw`\(\vec n=\vec a\times\vec b\)`, note: "cross product non-zero" },
    ],
  },
  {
    title: "Intersections and distance",
    formulas: [
      { label: "Line-plane parameter", math: String.raw`\(t=\frac{k-\vec n\cdot\vec r_0}{\vec n\cdot\vec d}\)`, note: "when n·d ≠ 0" },
      { label: "Two-plane direction", math: String.raw`\(\vec d=\vec n_1\times\vec n_2\)`, note: "non-parallel normals" },
      { label: "Point-line R²", math: String.raw`\(d=\frac{|Ax_P+By_P+C|}{\sqrt{A^2+B^2}}\)`, note: "scalar line form" },
      { label: "Point-line R³", math: String.raw`\(d=\frac{\|\overrightarrow{AP}\times\vec d\|}{\|\vec d\|}\)`, note: "A lies on line" },
    ],
  },
  {
    title: "Angles and system checks",
    formulas: [
      { label: "Line-plane angle", math: String.raw`\(\sin\theta=\frac{|\vec d\cdot\vec n|}{\|\vec d\|\|\vec n\|}\)`, note: "acute angle from line to plane" },
      { label: "Plane-plane angle", math: String.raw`\(\cos\theta=\frac{|\vec n_1\cdot\vec n_2|}{\|\vec n_1\|\|\vec n_2\|}\)`, note: "acute angle between normals" },
      { label: "Point-plane distance", math: String.raw`\(d=\frac{|Ax_P+By_P+Cz_P+D|}{\sqrt{A^2+B^2+C^2}}\)`, note: "plane in Cartesian form" },
      { label: "Consistency", math: String.raw`\(0=0\Rightarrow\text{redundant equation},\qquad 0=c\ne0\Rightarrow\text{no solution}\)`, note: "a consistent system with a free variable has infinitely many solutions" },
    ],
  },
];

export const katcLabels: Record<KATCCategory, string> = {
  K: "Knowledge & Understanding",
  A: "Application",
  T: "Thinking / Inquiry",
  C: "Communication",
};
