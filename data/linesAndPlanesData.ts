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
  timeLimit: string;
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

export const conceptModules: ConceptModule[] = [
  {
    id: "line-equations",
    index: "H.1",
    title: "Equations of a line",
    kicker: "R² and R³ representation",
    summary:
      "A line is determined by one anchor point and one non-zero direction vector. Each equation form encodes that same geometry differently.",
    instruction: {
      idea: "Think of a line as a starting position plus repeated movement in one fixed direction.",
      steps: [
        "Identify or calculate one point on the line.",
        "Find a non-zero direction vector.",
        "Write vector form first, then read the parametric or symmetric form from it.",
      ],
      commonMistake: "Do not use a different parameter for each coordinate. One parameter controls the entire line.",
    },
    equations: [
      {
        label: "Vector form",
        math: String.raw`\[\vec r=\vec r_0+t\vec d,\quad t\in\mathbb R\]`,
        note: "The point r₀ anchors the line; d controls its orientation.",
      },
      {
        label: "Parametric form in R³",
        math: String.raw`\[x=x_0+at,\qquad y=y_0+bt,\qquad z=z_0+ct\]`,
        note: "Read the anchor and direction component-by-component.",
      },
      {
        label: "Symmetric form",
        math: String.raw`\[\frac{x-x_0}{a}=\frac{y-y_0}{b}=\frac{z-z_0}{c}\]`,
        note: "If a direction component is zero, state that coordinate separately instead of dividing by zero.",
      },
      {
        label: "Cartesian line in R²",
        math: String.raw`\[Ax+By+C=0,\qquad \vec n=(A,B),\quad \vec d=(B,-A)\]`,
        note: "In R³, one scalar equation defines a plane. A Cartesian line requires two independent plane equations.",
      },
    ],
    keyChecks: [
      "A direction vector may be scaled by any non-zero constant without changing the line.",
      "Use one shared parameter across all parametric equations.",
      "A test point lies on the line only if the same parameter satisfies every coordinate.",
    ],
    workedExample: {
      prompt: "Write the line through P(1, 2, -1) and Q(3, -1, 5) in vector and symmetric form.",
      steps: [
        {
          label: "Find a direction",
          text: "Subtract the position vectors in a consistent order.",
          math: String.raw`\[\vec d=\overrightarrow{PQ}=Q-P=(2,-3,6)\]`,
        },
        {
          label: "Build vector form",
          text: "Anchor at P and move in direction d.",
          math: String.raw`\[\vec r=(1,2,-1)+t(2,-3,6)\]`,
        },
        {
          label: "Eliminate the parameter",
          text: "Divide each coordinate displacement by its direction component.",
          math: String.raw`\[\frac{x-1}{2}=\frac{y-2}{-3}=\frac{z+1}{6}\]`,
        },
      ],
      conclusion: "Both equations describe the same infinite set of points.",
    },
  },
  {
    id: "plane-equations",
    index: "H.2",
    title: "Equations of a plane",
    kicker: "Span vectors and normal vectors",
    summary:
      "A plane needs one anchor point and two non-parallel directions, or equivalently one anchor point and one non-zero normal vector.",
    instruction: {
      idea: "A plane extends in two independent directions. A normal vector describes the direction perpendicular to both.",
      steps: [
        "Choose an anchor point on the plane.",
        "Use two independent span vectors or find a normal with a cross product.",
        "Convert to point-normal form, then expand if a Cartesian equation is required.",
      ],
      commonMistake: "Parallel span vectors produce only a line, not a plane.",
    },
    equations: [
      {
        label: "Vector form",
        math: String.raw`\[\vec r=\vec r_0+s\vec a+t\vec b,\quad \vec a\not\parallel\vec b\]`,
        note: "The span vectors a and b generate every displacement inside the plane.",
      },
      {
        label: "Parametric form",
        math: String.raw`\[x=x_0+a_1s+b_1t,\ y=y_0+a_2s+b_2t,\ z=z_0+a_3s+b_3t\]`,
        note: "Two independent parameters are required because a plane is two-dimensional.",
      },
      {
        label: "Point-normal form",
        math: String.raw`\[\vec n\cdot(\vec r-\vec r_0)=0\]`,
        note: "Every in-plane displacement is perpendicular to the normal vector.",
      },
      {
        label: "Cartesian form",
        math: String.raw`\[Ax+By+Cz+D=0,\qquad \vec n=(A,B,C)\]`,
        note: "The coefficients of x, y, z are the normal-vector components.",
      },
    ],
    keyChecks: [
      "The two span vectors must not be parallel.",
      "The normal can be found with a cross product: n = a × b.",
      "Substitute the anchor point into the final scalar equation to verify it.",
    ],
    workedExample: {
      prompt: "Find a Cartesian equation for the plane through P(1, 0, 2) with spans a=(1, 1, 0) and b=(0, 1, 1).",
      steps: [
        {
          label: "Find a normal",
          text: "Take the cross product of the two independent span vectors.",
          math: String.raw`\[\vec n=\vec a\times\vec b=(1,-1,1)\]`,
        },
        {
          label: "Use point-normal form",
          text: "Insert P and the normal into n · (r - r₀)=0.",
          math: String.raw`\[(1,-1,1)\cdot(x-1,y,z-2)=0\]`,
        },
        {
          label: "Expand",
          text: "Collect constants on the right.",
          math: String.raw`\[x-y+z=3\]`,
        },
      ],
      conclusion: "The normal (1, -1, 1) is perpendicular to both original span vectors.",
    },
  },
  {
    id: "sketching-r3",
    index: "H.3",
    title: "Sketching in three-space",
    kicker: "Points, traces, and intercepts",
    summary:
      "A useful 3D sketch records orientation, not artistic perspective. Plot ordered triples along the x, y, and z axes, then use intercepts or traces to establish the plane.",
    instruction: {
      idea: "A 3D sketch should communicate location and orientation clearly, even if it is not drawn to scale.",
      steps: [
        "Draw and label the positive x, y, and z directions.",
        "Plot each ordered triple by tracking all three coordinates.",
        "For a plane, use three intercepts, two traces, or two spanning directions.",
      ],
      commonMistake: "Do not connect three collinear points and call the result a plane.",
    },
    equations: [
      {
        label: "Axis intercepts",
        math: String.raw`\[x=-\frac DA,\qquad y=-\frac DB,\qquad z=-\frac DC\]`,
        note: "Set the other two variables to zero. A zero coefficient means the plane is parallel to that axis.",
      },
      {
        label: "Intercept form",
        math: String.raw`\[\frac xa+\frac yb+\frac zc=1\]`,
        note: "The plane meets the axes at (a,0,0), (0,b,0), and (0,0,c).",
      },
    ],
    keyChecks: [
      "Use a dashed segment for a hidden axis or hidden edge.",
      "Label coordinates and axis directions; do not rely on appearance alone.",
      "A plane through the origin has zero intercept on every axis it crosses, so use traces or spanning vectors instead.",
    ],
    workedExample: {
      prompt: "Sketch 2x + 3y + 6z = 6 using intercepts.",
      steps: [
        { label: "x-intercept", text: "Set y=z=0.", math: String.raw`\[2x=6\Rightarrow (3,0,0)\]` },
        { label: "y-intercept", text: "Set x=z=0.", math: String.raw`\[3y=6\Rightarrow (0,2,0)\]` },
        { label: "z-intercept", text: "Set x=y=0.", math: String.raw`\[6z=6\Rightarrow (0,0,1)\]` },
      ],
      conclusion: "Join the three non-collinear intercepts to establish the plane patch.",
    },
  },
  {
    id: "defining-a-plane",
    index: "H.4",
    title: "Three ways to define a plane",
    kicker: "Conditions for uniqueness",
    summary:
      "The data must produce two independent in-plane directions. If those directions collapse into one, the plane is not uniquely determined.",
    instruction: {
      idea: "Every valid definition of a plane must provide one anchor and two independent directions.",
      steps: [
        "Choose a convenient anchor from the given information.",
        "Build two vectors that lie in the plane.",
        "Check that the vectors are not scalar multiples before writing the plane.",
      ],
      commonMistake: "Three points define a unique plane only when the points are non-collinear.",
    },
    equations: [
      {
        label: "Three non-collinear points",
        math: String.raw`\[\vec a=\overrightarrow{AB},\quad \vec b=\overrightarrow{AC},\quad \vec a\times\vec b\ne\vec0\]`,
        note: "Use A as an anchor and AB, AC as span vectors.",
      },
      {
        label: "Two intersecting lines",
        math: String.raw`\[\vec r=\vec p+s\vec d_1+t\vec d_2,\quad \vec d_1\not\parallel\vec d_2\]`,
        note: "The intersection point is the shared plane anchor.",
      },
      {
        label: "A line and an external point",
        math: String.raw`\[\vec r=\vec r_0+s\vec d+t(\vec P-\vec r_0)\]`,
        note: "The point must not lie on the line; otherwise infinitely many planes contain the line.",
      },
    ],
    keyChecks: [
      "Three collinear points do not determine a unique plane.",
      "Two parallel distinct lines also determine a plane, but this course emphasizes intersecting lines.",
      "Always state why your two spanning directions are independent.",
    ],
    workedExample: {
      prompt: "Does A(0,0,0), B(1,2,3), C(2,4,6) define a unique plane?",
      steps: [
        { label: "Build directions", text: "Form two vectors from A.", math: String.raw`\[\overrightarrow{AB}=(1,2,3),\quad\overrightarrow{AC}=(2,4,6)\]` },
        { label: "Test independence", text: "Compare the vectors.", math: String.raw`\[\overrightarrow{AC}=2\overrightarrow{AB}\Rightarrow \overrightarrow{AB}\times\overrightarrow{AC}=\vec0\]` },
      ],
      conclusion: "No. The points are collinear, so infinitely many planes can contain them.",
    },
  },
  {
    id: "line-plane-intersections",
    index: "H.5",
    title: "Line-plane intersections",
    kicker: "Substitution and classification",
    summary:
      "Substitute the line's parametric coordinates into the plane. The resulting one-variable equation reveals whether there is one intersection, none, or infinitely many.",
    instruction: {
      idea: "At an intersection, the same point must satisfy both the line and the plane.",
      steps: [
        "Write x, y, and z from the line in parametric form.",
        "Substitute all three coordinates into the plane equation.",
        "Interpret the result, then return to the line to find the point when a unique parameter exists.",
      ],
      commonMistake: "Finding the parameter is not the final answer. Substitute it back to obtain the intersection point.",
    },
    equations: [
      {
        label: "Fast denominator test",
        math: String.raw`\[t=\frac{k-\vec n\cdot\vec r_0}{\vec n\cdot\vec d}\quad\text{when }\vec n\cdot\vec d\ne0\]`,
        note: "Here the plane is n · r = k and the line is r = r₀ + td.",
      },
      {
        label: "Parallel test",
        math: String.raw`\[\vec n\cdot\vec d=0\]`,
        note: "If the anchor also satisfies the plane, the whole line lies in it; otherwise there is no intersection.",
      },
    ],
    keyChecks: [
      "Solve for the line parameter before finding the coordinates.",
      "Substitute the final point into both the line and plane equations.",
      "A result 0=0 signals infinitely many intersections; a contradiction signals none.",
    ],
    workedExample: {
      prompt: "Intersect r=(1,0,2)+t(1,2,-1) with x+y+z=5.",
      steps: [
        { label: "Write coordinates", text: "Read each coordinate from the line.", math: String.raw`\[x=1+t,\quad y=2t,\quad z=2-t\]` },
        { label: "Substitute", text: "Insert the coordinates into the plane.", math: String.raw`\[(1+t)+2t+(2-t)=5\Rightarrow 3+2t=5\Rightarrow t=1\]` },
        { label: "Return to the line", text: "Evaluate all three coordinates at t=1.", math: String.raw`\[P=(2,2,1)\]` },
      ],
      conclusion: "The line crosses the plane once at (2, 2, 1).",
    },
  },
  {
    id: "two-plane-intersections",
    index: "H.6",
    title: "Intersections of two planes",
    kicker: "A line, a plane, or nothing",
    summary:
      "Non-parallel planes intersect in a line. Parallel normals indicate either coincident planes or distinct parallel planes.",
    instruction: {
      idea: "The common solution set of two non-parallel planes has one free parameter, so it forms a line.",
      steps: [
        "Compare the normal vectors to identify parallel planes quickly.",
        "For non-parallel planes, eliminate one variable and choose a free parameter.",
        "Write the remaining coordinates as a vector equation and verify the direction with a cross product.",
      ],
      commonMistake: "A cross product gives the direction of the intersection line, but you still need one point on both planes.",
    },
    equations: [
      {
        label: "Direction of intersection",
        math: String.raw`\[\vec d=\vec n_1\times\vec n_2\]`,
        note: "The intersection line must be perpendicular to both plane normals.",
      },
      {
        label: "Relationship test",
        math: String.raw`\[\vec n_1\times\vec n_2=\vec0\]`,
        note: "Then compare the complete scalar equations to decide coincident versus distinct parallel.",
      },
    ],
    keyChecks: [
      "Use elimination to find one point on both planes.",
      "A convenient free variable turns the intersection into parametric form.",
      "Verify the final line direction is perpendicular to both normals.",
    ],
    workedExample: {
      prompt: "Find the line where x+y+z=3 and x-y+z=1 intersect.",
      steps: [
        { label: "Eliminate", text: "Subtract the second equation from the first.", math: String.raw`\[2y=2\Rightarrow y=1\]` },
        { label: "Choose a parameter", text: "With y=1, both planes give x+z=2. Let z=t.", math: String.raw`\[x=2-t,\quad y=1,\quad z=t\]` },
        { label: "Write the line", text: "Separate the constant and parameter terms.", math: String.raw`\[\vec r=(2,1,0)+t(-1,0,1)\]` },
      ],
      conclusion: "The cross product of the normals is parallel to (-1, 0, 1), confirming the direction.",
    },
  },
  {
    id: "consistent-systems",
    index: "H.7",
    title: "Consistent and inconsistent systems",
    kicker: "Read the geometry in the algebra",
    summary:
      "A consistent system has at least one common point. It may have a unique solution or infinitely many. An inconsistent system has no common solution.",
    instruction: {
      idea: "Row reduction describes geometry. A pivot gives a restriction, a free variable gives movement, and a contradiction removes every possible solution.",
      steps: [
        "Eliminate variables without changing the solution set.",
        "Look for a unique solution, one or more free variables, or a contradiction.",
        "State both the algebraic result and the matching geometric relationship.",
      ],
      commonMistake: "Infinitely many solutions are consistent because common points still exist.",
    },
    equations: [
      {
        label: "Unique solution",
        math: String.raw`\[\operatorname{rank}(A)=\operatorname{rank}([A\mid b])=n\]`,
        note: "Geometrically, the objects meet at exactly one point.",
      },
      {
        label: "Infinite solutions",
        math: String.raw`\[\operatorname{rank}(A)=\operatorname{rank}([A\mid b])<n\]`,
        note: "A free parameter remains: the common set may be a line or plane.",
      },
      {
        label: "No solution",
        math: String.raw`\[\operatorname{rank}(A)<\operatorname{rank}([A\mid b])\]`,
        note: "Elimination produces a contradiction such as 0=5.",
      },
    ],
    keyChecks: [
      "Do not call every infinite system inconsistent; infinite solutions are consistent.",
      "Translate the reduced equation back into a geometric relationship.",
      "State the number and type of intersections in your conclusion.",
    ],
    workedExample: {
      prompt: "Classify x+2y-z=3 and 2x+4y-2z=7.",
      steps: [
        { label: "Compare left sides", text: "The second left side is twice the first.", math: String.raw`\[2(x+2y-z)=2x+4y-2z\]` },
        { label: "Compare constants", text: "Twice the first constant is 6, not 7.", math: String.raw`\[2(3)=6\ne7\Rightarrow 0=1\]` },
      ],
      conclusion: "The planes are distinct and parallel, so the system is inconsistent.",
    },
  },
  {
    id: "point-line-distance",
    index: "H.8",
    title: "Distance from a point to a line",
    kicker: "Perpendicular displacement",
    summary:
      "Distance means the length of the shortest segment. In R² use the scalar line formula; in R³ use the magnitude of the cross product to isolate the perpendicular component.",
    instruction: {
      idea: "The shortest route from a point to a line is always perpendicular to the line.",
      steps: [
        "Choose an anchor point A on the line and form the displacement from A to P.",
        "Remove the component parallel to the line using a projection or a cross product.",
        "Take the magnitude and keep the exact radical until the final approximation is requested.",
      ],
      commonMistake: "The distance is a scalar length. Do not leave the answer as a displacement vector.",
    },
    equations: [
      {
        label: "Point to line in R²",
        math: String.raw`\[d=\frac{|Ax_P+By_P+C|}{\sqrt{A^2+B^2}}\]`,
        note: "The line must be written as Ax+By+C=0.",
      },
      {
        label: "Point to line in R³",
        math: String.raw`\[d=\frac{\left\|\overrightarrow{AP}\times\vec d\right\|}{\|\vec d\|}\]`,
        note: "A is any point on the line, P is the external point, and d is the line direction.",
      },
      {
        label: "Projection alternative",
        math: String.raw`\[\vec v_\perp=\overrightarrow{AP}-\operatorname{proj}_{\vec d}(\overrightarrow{AP}),\qquad d=\|\vec v_\perp\|\]`,
        note: "This explicitly subtracts the component parallel to the line.",
      },
    ],
    keyChecks: [
      "Distance is non-negative and has units of length.",
      "Scaling the direction vector does not change the distance.",
      "If the cross product is zero, the point lies on the line and the distance is zero.",
    ],
    workedExample: {
      prompt: "Find the distance from P(3,2,0) to r=(1,1,1)+t(2,0,-1).",
      steps: [
        { label: "Build AP", text: "Subtract the line anchor A from P.", math: String.raw`\[\overrightarrow{AP}=(2,1,-1)\]` },
        { label: "Cross product", text: "Cross AP with the line direction.", math: String.raw`\[\overrightarrow{AP}\times\vec d=(-1,0,-2)\]` },
        { label: "Divide magnitudes", text: "Apply the R³ formula.", math: String.raw`\[d=\frac{\sqrt{(-1)^2+0^2+(-2)^2}}{\sqrt{2^2+0^2+(-1)^2}}=\frac{\sqrt5}{\sqrt5}=1\]` },
      ],
      conclusion: "The point is exactly one unit from the line.",
    },
  },
];

export const videoLessons: VideoLesson[] = [
  {
    id: "video-lines",
    number: "01",
    title: "Lines in 3D space",
    description:
      "Connect direction vectors to parametric and symmetric equations, then read geometric information directly from each form.",
    youtubeId: "KgJn-zihiEc",
    sourceUrl: "https://www.youtube.com/watch?v=KgJn-zihiEc",
    creator: "JK Math",
    duration: "On average, 8 mins",
    timestamps: [
      { time: "00:00", seconds: 0, label: "What defines a line" },
      { time: "02:10", seconds: 130, label: "Parametric equations" },
      { time: "05:05", seconds: 305, label: "Symmetric form" },
      { time: "08:00", seconds: 480, label: "Worked connections" },
    ],
    takeaways: [
      "A line requires an anchor point and a non-zero direction vector.",
      "Parametric equations keep one shared parameter across all coordinates.",
      "Symmetric form comes from solving each parametric equation for that parameter.",
    ],
  },
  {
    id: "video-planes",
    number: "02",
    title: "Planes in 3D space",
    description:
      "Use a point and a perpendicular normal vector to build the scalar equation of a plane and interpret its orientation.",
    youtubeId: "C6tMbe-ZmCM",
    sourceUrl: "https://www.youtube.com/watch?v=C6tMbe-ZmCM",
    creator: "JK Math",
    duration: "On average, 8 mins",
    timestamps: [
      { time: "00:00", seconds: 0, label: "Plane geometry" },
      { time: "02:25", seconds: 145, label: "Normal vectors" },
      { time: "05:20", seconds: 320, label: "Point-normal form" },
      { time: "08:10", seconds: 490, label: "Scalar equation" },
    ],
    takeaways: [
      "A plane's normal vector is perpendicular to every direction inside the plane.",
      "The coefficients in Ax+By+Cz+D=0 form a normal vector.",
      "A cross product of two in-plane directions produces a normal.",
    ],
  },
];

export const homeworkSets: HomeworkSet[] = [
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
      options: [String.raw`\((2,-1,4)\)`, String.raw`\((3,-2,5)\)`, String.raw`\((5,-3,9)\)`, String.raw`\((-3,2,-5)\) only`],
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
      sampleAnswer: "From x, 7=1+2t gives t=3. The y-coordinate would then be 1-3=-2, which agrees, but the z-coordinate would be 2+3=5, which also agrees. The same value t=3 satisfies all coordinates, so S lies on the line.",
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

export const quizzes: Assessment[] = [quizOne, quizTwo, quizThree];

export const finalExam: Assessment = {
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
        String.raw`\(x=2-3t,\ y=-1+2t,\ z=4-t\) only`,
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
      { label: "Consistency", math: String.raw`\(0=0\Rightarrow\text{free variable},\qquad 0=c\ne0\Rightarrow\text{no solution}\)`, note: "interpret the reduced system geometrically" },
    ],
  },
];

export const katcLabels: Record<KATCCategory, string> = {
  K: "Knowledge & Understanding",
  A: "Application",
  T: "Thinking / Inquiry",
  C: "Communication",
};
