import type { Assessment, AssessmentQuestion, KATCCategory, SolutionStep } from "./linesAndPlanesData";

const inline = (value: string) => `\\(${value}\\)`;
const display = (value: string) => `\\[${value}\\]`;
const step = (label: string, text: string, math?: string): SolutionStep => ({ label, text, ...(math ? { math: display(math) } : {}) });
const fraction = (a: number, b: number): string => {
  const gcd = (x: number, y: number): number => y ? gcd(y, x % y) : Math.abs(x);
  const g = gcd(a, b); a /= g; b /= g;
  return b === 1 ? String(a) : String.raw`\frac{${a}}{${b}}`;
};

function choice(id: string, prompt: string, answers: string[], explanation: string, working: string, tags: KATCCategory[] = ["K"], rotate = 0): AssessmentQuestion {
  // The first supplied answer is correct. Rotate the displayed choices deterministically.
  const options = [...answers.slice(rotate), ...answers.slice(0, rotate)];
  return { id, kind: "multiple-choice", prompt, options, correctIndex: (4 - rotate) % 4, tags, marks: 1,
    section: "Part A Knowledge and application", rationale: explanation,
    steps: [step("Reasoning", explanation, working)] };
}
function written(id: string, prompt: string, answer: string, reasoning: SolutionStep[], criteria: string[], tags: KATCCategory[], test: boolean): AssessmentQuestion {
  const weights = test ? [2, 2, 1, 1] : [1, 1, 1, 1];
  return { id, kind: "written", prompt, tags, marks: weights.reduce((a,b) => a+b, 0),
    section: "Part B Reasoning and communication", rationale: answer, sampleAnswer: answer, steps: reasoning,
    criteria: criteria.map((text, i) => `${text} (${weights[i]} ${weights[i] === 1 ? "mark" : "marks"}).`) };
}

function lines(p: number, test: boolean): AssessmentQuestion[] {
  const prefix = `${test ? "t" : "q"}-81-`;
  const c = (n: number, prompt: string, options: string[], explanation: string, math: string, tags: KATCCategory[] = ["K"]) => choice(prefix+n, prompt, options, explanation, math, tags, n%4);
  const q: AssessmentQuestion[] = [
    c(1, `For the R² line ${inline(String.raw`\vec r=[${p},-1]+t[2,3]`)}, which vector is parallel to the line?`,
      [inline("[2,3]"),inline("[-3,2]"),inline(`[${p},-1]`),inline("[2,-3]")],
      "The coefficient of the real parameter is the direction vector. The constant vector locates a starting point.", String.raw`\vec r=\vec r_0+t\vec d,\qquad\vec d=[2,3]`),
    c(2, `Find the point on ${inline(String.raw`\vec r=[${p},-1]+t[2,3]`)} when ${inline("t=2")}.`,
      [inline(`(${p+4},5)`),inline(`(${p+2},2)`),inline(`(${p+4},-7)`),inline(`(${p-4},5)`)],
      "Multiply both direction components by two, then add the corresponding starting coordinates.", String.raw`[${p},-1]+2[2,3]=[${p+4},5]`, ["A"]),
    c(3, `Which vector is a normal to the Cartesian line ${inline(`2x-3y=${p+4}`)}?`,
      [inline("[2,-3]"),inline("[3,2]"),inline("[2,3]"),inline("[-3,2]")],
      "The x and y coefficients form a nonzero normal. A direction must be perpendicular to it.", String.raw`\vec n=[2,-3],\qquad[2,-3]\cdot[3,2]=0`),
    c(4, `Which symmetric description represents ${inline(String.raw`\vec r=[${p},-1,2]+t[0,1,-2]`)}?`,
      [inline(String.raw`x=${p},\quad\frac{y+1}{1}=\frac{z-2}{-2}`),inline(String.raw`x=${p},\quad\frac{y-1}{1}=\frac{z+2}{-2}`),inline(String.raw`y=-1,\quad\frac{x-${p}}1=\frac{z-2}{-2}`),inline(String.raw`z=2,\quad x=${p}+t,\ y=-1-2t`)],
      "The zero x-direction component makes x constant. Only the y and z equations can be divided by nonzero direction components.", String.raw`x=${p},\quad y=-1+t,\quad z=2-2t`, ["K","A"]),
    c(5, `Classify ${inline(String.raw`L_1:\vec r=[${p},-1,2]+t[2,-1,3]`)} and ${inline(String.raw`L_2:\vec r=[${p+2},-2,5]+u[-4,2,-6]`)}.`,
      ["Coincident lines","Distinct parallel lines","Perpendicular intersecting lines","Skew lines"],
      "The second direction is negative two times the first. Its starting point is reached on the first line at t=1, so the lines coincide.", String.raw`[-4,2,-6]=-2[2,-1,3],\quad[${p},-1,2]+[2,-1,3]=[${p+2},-2,5]`, ["T"]),
    c(6, `The directions of two R² lines through ${inline(`(${p},0)`)} are ${inline("[1,1]")} and ${inline(test ? "[1,0]" : "[1,-1]")}. What is their smaller angle?`,
      [test ? "45°" : "90°", "0°", test ? "90°" : "45°", "60°"],
      test ? "The absolute dot product is one and the magnitudes are square root two and one, giving cosine one over square root two." : "The dot product is zero and both directions are nonzero, so the lines are perpendicular.",
      test ? String.raw`\cos\theta=\frac{1}{\sqrt2}\Rightarrow\theta=45^\circ` : String.raw`[1,1]\cdot[1,-1]=0\Rightarrow\theta=90^\circ`, ["A"]),
  ];
  if (test) q.push(
    c(7, `What set is described by ${inline(String.raw`\vec r=[${p},2,-1]+t[0,0,0]`)}, ${inline(String.raw`t\in\mathbb R`)}?`,
      ["One point", "An infinite line", "A plane", "All of R³"],
      "The zero direction produces no displacement for any parameter. The equation returns only its constant position.", String.raw`\vec r=[${p},2,-1]\quad\text{for every }t`, ["T"]),
    c(8, `A line in R² has direction ${inline(`[2,${p}]`)}. Which vector is perpendicular to this direction?`,
      [inline(`[${p},-2]`),inline(`[2,${p}]`),inline(`[${p},2]`),inline(`[1,${p}]`)],
      "Swapping components and reversing one sign gives a zero dot product.", String.raw`[2,${p}]\cdot[${p},-2]=${2*p}-${2*p}=0`, ["K","A"])
  );
  q.push(
    written(prefix+"w1", `The line passes through ${inline(`A(${p},2)`)} and ${inline(`B(${p+6},6)`)}. (a) Find a simplified direction. (b) Write vector and parametric equations. (c) Obtain Cartesian form. (d) Verify B using one parameter.`,
      `A direction is ${inline("[3,2]")}. The equations are ${inline(String.raw`\vec r=[${p},2]+t[3,2]`)}, ${inline(`x=${p}+3t,\ y=2+2t`)}, and ${inline(`2x-3y=${2*p-6}`)}. The point B is reached when ${inline("t=2")}.`,
      [step("Direction","Subtract A from B and divide by two.",String.raw`\overrightarrow{AB}=[6,4]=2[3,2]`),step("Represent","Use A as the starting point.",String.raw`\vec r=[${p},2]+t[3,2],\quad x=${p}+3t,\ y=2+2t`),step("Eliminate","Both expressions equal the same parameter.",String.raw`\frac{x-${p}}3=\frac{y-2}2\Rightarrow2x-3y=${2*p-6}`),step("Verify","Use the same parameter in both coordinates.",String.raw`t=2:\quad[${p},2]+2[3,2]=[${p+6},6]`)],
      ["Obtains a nonzero direction parallel to AB","Writes both forms with one shared parameter","Derives the correct Cartesian equation","Checks both coordinates of B"],["A","C"],test),
    written(prefix+"w2", `For ${inline(`A(${p},-1,2)`)} and ${inline(`B(${p},3,-6)`)}, (a) write vector and symmetric equations of AB, (b) explain the fixed coordinate, and (c) determine whether ${inline(`Q(${p},1,-2)`)} lies on the line.`,
      `Use direction ${inline("[0,1,-2]")}. Then ${inline(String.raw`\vec r=[${p},-1,2]+t[0,1,-2]`)} and ${inline(String.raw`x=${p},\ (y+1)/1=(z-2)/(-2)`)}. The x-coordinate stays fixed. Q lies on the line at ${inline("t=2")}; B is reached at ${inline("t=4")}.`,
      [step("Direction","Simplify the displacement without changing its orientation.",String.raw`\overrightarrow{AB}=[0,4,-8]=4[0,1,-2]`),step("Vector form","Use A and a nonzero parallel direction.",String.raw`\vec r=[${p},-1,2]+t[0,1,-2]`),step("Symmetric form","Retain x separately because its direction component is zero.",String.raw`x=${p},\qquad\frac{y+1}{1}=\frac{z-2}{-2}`),step("Membership","Check all coordinates with t=2.",String.raw`[${p},-1,2]+2[0,1,-2]=[${p},1,-2]`)],
      ["Obtains a valid simplified direction","Writes vector and symmetric forms","Explains why division by the zero component is invalid","Checks Q using one shared parameter"],["A","T","C"],test),
    written(prefix+"w3", `Find ${inline("k")} so the R² lines ${inline("kx+2y=1")} and ${inline(`3x+${p}y=2`)} are perpendicular. Show the normal-vector test and justify your conclusion.`,
      `The normals are ${inline("[k,2]")} and ${inline(`[3,${p}]`)}. Their dot product must vanish, so ${inline(`3k+${2*p}=0`)} and ${inline(`k=${fraction(-2*p,3)}`)}. Both normals remain nonzero, and in R² this establishes perpendicular line directions.`,
      [step("Normals","Read the coefficients of x and y.",String.raw`\vec n_1=[k,2],\quad\vec n_2=[3,${p}]`),step("Perpendicularity","For lines in R², perpendicular normals give perpendicular line directions.",String.raw`[k,2]\cdot[3,${p}]=0`),step("Solve","Expand and solve the scalar equation.",String.raw`3k+${2*p}=0\Rightarrow k=${fraction(-2*p,3)}`),step("Check","Substitute the value into the dot product.",String.raw`3\left(${fraction(-2*p,3)}\right)+${2*p}=0`)],
      ["Identifies both normal vectors","Uses the correct zero-dot-product condition","Solves for k exactly","Explains why the test applies to lines in R²"],["K","A","C"],test),
    written(prefix+"w4", `Let ${inline(String.raw`L:\vec r=[${p},0,1]+t[1,2,-1]`)}. Compare it with ${inline(String.raw`M:\vec r=[${p+3},6,-2]+u[-2,-4,2]`)} and ${inline(String.raw`N:\vec r=[${p+3},6,0]+v[-2,-4,2]`)}. Establish whether each pair is coincident or distinct parallel.`,
      `All directions are parallel because ${inline("[-2,-4,2]=-2[1,2,-1]")}. The anchor of M lies on L at ${inline("t=3")}, so M and L coincide. The same x and y force ${inline("t=3")} for the anchor of N, but L gives ${inline("z=-2")} rather than zero. Thus N and L are distinct parallel lines.`,
      [step("Directions","Compare scalar multiples.",String.raw`\vec d_M=\vec d_N=-2\vec d_L`),step("Shared point","Test the starting point of M.",String.raw`t=3:\quad[${p},0,1]+3[1,2,-1]=[${p+3},6,-2]`),step("Failed point","The anchor of N has the wrong z-coordinate.",String.raw`x=${p+3}\Rightarrow t=3,\quad z=1-3=-2\ne0`),step("Classify","Parallel directions require a separate location check.",String.raw`L=M,\qquad L\parallel N,\quad L\ne N`)],
      ["Compares all direction vectors","Verifies a common point for L and M","Shows why the anchor of N fails","States both relationships with complete reasoning"],["T","C"],test)
  );
  return q;
}

function planes(p: number, test: boolean): AssessmentQuestion[] {
  const prefix=`${test?"t":"q"}-82-`,D=p+3;
  const c=(n:number,prompt:string,options:string[],why:string,math:string,tags:KATCCategory[]=["K"])=>choice(prefix+n,prompt,options,why,math,tags,n%4);
  const q:AssessmentQuestion[]=[
    c(1,`A plane is to pass through ${inline(`A(${p},0,1)`)}. Which condition on its proposed spans ${inline(String.raw`\vec a,\vec b`)} ensures they determine a unique plane?`,
      [inline(String.raw`\vec a\times\vec b\ne\vec0`),inline(String.raw`\vec a\times\vec b=\vec0`),inline(String.raw`\vec a=2\vec b`),"Both spans are zero"],
      "Two independent in-plane directions are required. Their cross product must be nonzero.",String.raw`\vec r=\vec r_0+s\vec a+t\vec b,\quad\vec a\times\vec b\ne\vec0`),
    c(2,`The plane ${inline(String.raw`\vec r=[${p},0,1]+s[1,0,1]+t[0,1,1]`)} has which normal?`,
      [inline("[-1,-1,1]"),inline("[1,1,1]"),inline("[1,0,1]"),inline("[0,1,1]")],
      "Crossing the independent spans gives a vector perpendicular to both.",String.raw`[1,0,1]\times[0,1,1]=[-1,-1,1]`,["A"]),
    c(3,`Which equation describes the same plane as ${inline(`x+2y-z=${D}`)}?`,
      [inline(`-2x-4y+2z=${-2*D}`),inline(`-2x-4y+2z=${2*D}`),inline(`x+2y+z=${D}`),inline(`x-2y-z=${D}`)],
      "Multiplying the complete equation by the same nonzero constant preserves every solution.",String.raw`-2(x+2y-z)=-2(${D})`,["T"]),
    c(4,`What is the perpendicular projection of ${inline(`P(${p},-2,3)`)} onto the xy-plane?`,
      [inline(`(${p},-2,0)`),inline(`(0,-2,3)`),inline(`(${p},0,3)`),inline(`(${p},-2,-3)`)],
      "The xy-plane has z=0. The projection preserves x and y and removes only the z displacement.",String.raw`P(${p},-2,3)\mapsto H(${p},-2,0)`,["A"]),
    c(5,`Which equation is the xy-plane trace of ${inline(`x+2y+z=${D}`)}?`,
      [inline(`2y+x=${D},\ z=0`),inline(`x+z=${D},\ y=0`),inline(`2y+z=${D},\ x=0`),inline(`x=0,\ y=0`)],
      "Set z to zero while allowing x and y to vary subject to the remaining linear relation.",String.raw`z=0\Rightarrow x+2y=${D}`,["K","A"]),
    c(6,`Find the x-axis intercept of ${inline(`x+y+z=${D}`)}.`,
      [inline(`(${D},0,0)`),inline(`(0,${D},0)`),inline(`(0,0,${D})`),inline(`(${D},${D},0)`)],
      "Set y=z=0 at an x-axis intercept.",String.raw`y=z=0\Rightarrow x=${D}`,["A"]),
  ];
  if(test)q.push(
    c(7,`For ${inline(`x+z=${D}`)}, which coordinate can change freely while the other two coordinates remain fixed?`,["y","x only","z only","No coordinate can vary"],
      "The missing y term means translating in the y direction leaves the equation unchanged. X and z remain linked.",String.raw`x=${D}-z,\quad y\in\mathbb R`,["T"]),
    c(8,`Which plane is perpendicular to ${inline(`x-y+z=${p}`)}?`,[inline("x+y=2"),inline(`2x-2y+2z=${p}`),inline("x-y+z=0"),inline("x-y=1")],
      "The normals [1,-1,1] and [1,1,0] have zero dot product. The other proposed normals are not perpendicular to the reference normal.",String.raw`[1,-1,1]\cdot[1,1,0]=1-1+0=0`,["K","A"]))
  q.push(
    written(prefix+"w1",`The plane contains ${inline(`A(${p},0,1)`)}, ${inline(`B(${p+1},1,1)`)} and ${inline(`C(${p},1,2)`)}. Find vector, parametric and Cartesian equations. Explain why the plane is unique and check C.`,
      `The spans are ${inline("[1,1,0]")} and ${inline("[0,1,1]")}, with nonzero cross product ${inline("[1,-1,1]")}. Thus ${inline(String.raw`\vec r=[${p},0,1]+s[1,1,0]+t[0,1,1]`)}, ${inline(`x=${p}+s,\ y=s+t,\ z=1+t`)} and ${inline(`x-y+z=${p+1}`)}. C corresponds to ${inline("(s,t)=(0,1)")}.`,
      [step("Spans","Subtract A from B and C.",String.raw`\overrightarrow{AB}=[1,1,0],\quad\overrightarrow{AC}=[0,1,1]`),step("Independence and normal","The cross product is nonzero.",String.raw`[1,1,0]\times[0,1,1]=[1,-1,1]\ne\vec0`),step("Equations","Use the known point, then read components and expand point-normal form.",String.raw`\vec r=[${p},0,1]+s[1,1,0]+t[0,1,1],\quad x-y+z=${p+1}`),step("Check C","Use one parameter pair and substitute into Cartesian form.",String.raw`(s,t)=(0,1),\qquad ${p}-1+2=${p+1}`)],
      ["Obtains two valid spans","Checks independence and obtains a normal","Writes all three requested forms","Verifies C and explains uniqueness"],["A","T","C"],test),
    written(prefix+"w2",`Find vector and Cartesian equations of the plane containing ${inline(String.raw`L:\vec r=[${p},1,0]+s[2,0,1]`)} and ${inline(`Q(${p+1},2,2)`)}. Verify both the whole line and Q.`,
      `A connector from the line anchor to Q is ${inline("[1,1,2]")}. Hence ${inline(String.raw`\vec r=[${p},1,0]+u[2,0,1]+v[1,1,2]`)}. A normal is ${inline("[-1,-3,2]")}, giving ${inline(`x+3y-2z=${p+3}`)}. The line is obtained when ${inline("v=0")}; Q is obtained at ${inline("(u,v)=(0,1)")}.`,
      [step("Connector","Subtract the line anchor from Q.",String.raw`\overrightarrow{AQ}=[1,1,2]`),step("Construct","The connector is independent of the line direction.",String.raw`\vec r=[${p},1,0]+u[2,0,1]+v[1,1,2]`),step("Cartesian form","Cross the spans and use the anchor.",String.raw`[2,0,1]\times[1,1,2]=[-1,-3,2],\quad x+3y-2z=${p+3}`),step("Verify","Substitution reproduces both required objects.",String.raw`v=0\Rightarrow L,\quad(u,v)=(0,1)\Rightarrow Q`)],
      ["Finds the connector and checks independence","Constructs vector form with two parameters","Finds the correct normal and Cartesian equation","Verifies the whole line and external point"],["A","C"],test),
    written(prefix+"w3",`Find the smaller angle between ${inline(`x+y+z=${D}`)} and ${inline(`x+z=${p}`)}. Show exact magnitudes and an exact cosine ratio before rounding to one decimal place.`,
      `The normals are ${inline("[1,1,1]")} and ${inline("[1,0,1]")}. Their dot product is two and their magnitudes are ${inline(String.raw`\sqrt3`)} and ${inline(String.raw`\sqrt2`)}. Thus ${inline(String.raw`\cos\theta=2/\sqrt6`)} and ${inline(String.raw`\theta\approx35.3^\circ`)}.`,
      [step("Normals","Read coefficients, including the missing y term.",String.raw`\vec n_1=[1,1,1],\quad\vec n_2=[1,0,1]`),step("Dot product and magnitudes","Keep the radicals exact.",String.raw`\vec n_1\cdot\vec n_2=2,\quad\|\vec n_1\|=\sqrt3,\quad\|\vec n_2\|=\sqrt2`),step("Smaller angle","Use the absolute dot product.",String.raw`\cos\theta=\frac{|2|}{\sqrt3\sqrt2}=\frac2{\sqrt6}`),step("Approximate","Use inverse cosine in degree mode only at the end.",String.raw`\theta=\cos^{-1}(2/\sqrt6)\approx35.3^\circ`)],
      ["Identifies both normals","Calculates the dot product and exact magnitudes","Obtains the correct exact cosine ratio","Calculates and labels the smaller angle"],["K","A","C"],test),
    written(prefix+"w4",`Sketch ${inline(`2x+3y+6z=${6*(p+1)}`)} using labelled axes. Find all three intercepts and all three coordinate-plane trace equations. Explain why the triangle does not bound the plane.`,
      `The intercepts are ${inline(`(${3*(p+1)},0,0)`)}, ${inline(`(0,${2*(p+1)},0)`)} and ${inline(`(0,0,${p+1})`)}. The traces are ${inline(`2x+3y=${6*(p+1)},\ z=0`)}, ${inline(`2x+6z=${6*(p+1)},\ y=0`)} and ${inline(`3y+6z=${6*(p+1)},\ x=0`)}. Join the intercepts to indicate orientation and show that the plane extends beyond the triangle.`,
      [step("Intercepts","Set two coordinates to zero at each axis.",String.raw`A(${3*(p+1)},0,0),\quad B(0,${2*(p+1)},0),\quad C(0,0,${p+1})`),step("xy trace","Set z to zero.",String.raw`z=0:\quad2x+3y=${6*(p+1)}`),step("Other traces","Set y=0 and x=0 separately.",String.raw`y=0:\ 2x+6z=${6*(p+1)},\qquad x=0:\ 3y+6z=${6*(p+1)}`),step("Sketch and interpretation","Draw labelled axes, points and trace lines. The plane is infinite in every in-plane direction.")],
      ["Finds and labels all intercepts","Obtains all three trace equations","Draws a coherent labelled plane sketch","Explains that the triangle is only a finite patch"],["A","T","C"],test)
  );
  return q;
}

function intersections(p:number,test:boolean):AssessmentQuestion[]{
  const prefix=`${test?"t":"q"}-91-`;
  const c=(n:number,prompt:string,options:string[],why:string,math:string,tags:KATCCategory[]=["K"])=>choice(prefix+n,prompt,options,why,math,tags,n%4);
  const q:AssessmentQuestion[]=[
    c(1,`Find the intersection parameter for ${inline(String.raw`\vec r=[0,0,${p}]+t[1,1,1]`)} with ${inline(`x+y+z=${p+6}`)}.`,
      [inline("t=2"),inline("t=1"),inline("t=3"),"Every real t"],
      "Substitute all three coordinate expressions into the plane before solving for the shared parameter.",String.raw`t+t+(${p}+t)=${p+6}\Rightarrow3t=6\Rightarrow t=2`,["A"]),
    c(2,`Classify ${inline(String.raw`L:\vec r=[${p},0,0]+t[1,-1,0]`)} relative to ${inline(String.raw`\Pi:x+y=${p}`)}.`,
      ["The line is contained in the plane","Exactly one intersection","Parallel and disjoint","The line is perpendicular to the plane"],
      "Substitution is an identity for every real t, so every point on the line belongs to the plane.",String.raw`(${p}+t)-t=${p}`, ["T"]),
    c(3,`Classify ${inline(String.raw`L:\vec r=[${p},0,1]+t[1,-1,0]`)} relative to ${inline(String.raw`\Pi:x+y+z=${p+2}`)}.`,
      ["Parallel and disjoint","Contained in the plane","Exactly one intersection","The line is normal to the plane"],
      "The parameter cancels, leaving a false statement. The direction is parallel to the plane but the line has no common point with it.",String.raw`(${p}+t)-t+1=${p+1}\ne${p+2}`, ["T"]),
    c(4,`Classify ${inline(String.raw`L_1:\vec r=[${p},0,0]+s[1,0,0]`)} and ${inline(String.raw`L_2:\vec r=[0,1,1]+t[0,1,0]`)}.`,
      ["Skew lines","Coincident lines","Distinct parallel lines","Intersecting perpendicular lines"],
      "Their nonparallel directions do not guarantee intersection. The first has z=0 and the second z=1, so they cannot meet.",String.raw`z_{L_1}=0,\quad z_{L_2}=1,\quad[1,0,0]\not\parallel[0,1,0]`, ["K","T"]),
    c(5,`Which vector is parallel to the intersection of ${inline(`x+y+z=${p}`)} and ${inline(`x-y+z=${p}`)}?`,
      [inline("[1,0,-1]"),inline("[1,0,1]"),inline("[0,1,0]"),inline("[1,1,1]")],
      "A line in both planes has direction perpendicular to both plane normals.",String.raw`[1,1,1]\times[1,-1,1]=[2,0,-2]=2[1,0,-1]`,["A"]),
    c(6,`What is the common solution set of ${inline(`x+y=${p}`)}, ${inline(`y+z=${p}`)} and ${inline(`x+z=${p}`)}?`,
      [inline(String.raw`\{(${fraction(p,2)},${fraction(p,2)},${fraction(p,2)})\}`),"An infinite line","A plane","The empty set"],
      "Subtracting pairs gives x=y=z. Substituting into any original equation gives twice each coordinate equal to the constant.",String.raw`x=y=z,\quad2x=${p}\Rightarrow x=y=z=${fraction(p,2)}`, ["A","T"]),
  ];
  if(test)q.push(
    c(7,`The equations ${inline(`x+y+z=${p}`)} and ${inline(`2x+2y+2z=${2*p+1}`)} reduce to ${inline("0=1")}. What does this imply?`,
      ["There is no common solution","One coordinate is free","There is a unique point","The equations describe the same plane"],
      "A contradiction is false for all variable values. The planes have parallel normals but different locations.",String.raw`2(x+y+z)=${2*p}\ne${2*p+1}`, ["T"]),
    c(8,`Consider ${inline(`x+y+z=${p}`)}, ${inline(`x-y+z=${p}`)} and ${inline(`2x+2z=${2*p}`)}. How many independent plane constraints remain?`,
      ["Two, giving an intersection line","Three, giving a unique point","One, giving an entire plane","Zero, giving all of R³"],
      "The third equation is the sum of the first two and contributes no new restriction. The first two normals are not parallel.",String.raw`(x+y+z)+(x-y+z)=2x+2z=${2*p}`, ["T"]))
  q.push(
    written(prefix+"w1",`Find the intersection of ${inline(String.raw`L:\vec r=[1,0,${p}]+t[2,1,-1]`)} with ${inline(String.raw`\Pi:x+y+z=${p+5}`)}. Give the point and verify it in both objects.`,
      `Substitution gives ${inline(`1+${p}+2t=${p+5}`)}, so ${inline("t=2")}. The intersection is ${inline(`P(5,2,${p-2})`)}. Its coordinates come from one shared line parameter and satisfy the plane because ${inline(`5+2+${p-2}=${p+5}`)}.`,
      [step("Substitute","Use all three line coordinates.",String.raw`(1+2t)+t+(${p}-t)=${p+5}`),step("Solve","Collect the parameter terms.",String.raw`2t=4\Rightarrow t=2`),step("Point","Substitute the same value into x,y,z.",String.raw`P=(5,2,${p-2})`),step("Verify","Check the original line and plane.",String.raw`[1,0,${p}]+2[2,1,-1]=[5,2,${p-2}],\quad5+2+(${p-2})=${p+5}`)],
      ["Forms the correct scalar equation","Solves the intersection parameter","Calculates all coordinates consistently","Verifies the point in both objects"],["A","C"],test),
    written(prefix+"w2",`Determine whether ${inline(String.raw`L_1:\vec r=[${p},0,1]+s[1,2,-1]`)} and ${inline(String.raw`L_2:\vec r=[${p+2},4,${test?1:-1}]+u[0,1,1]`)} intersect. Solve using separate parameters and check all coordinates. State the full line relationship.`,
      test ? `The x equation forces ${inline("s=2")}; the y equation then forces ${inline("u=0")}. The z values are negative one and positive one, so the lines do not intersect. Their directions are not parallel, so they are skew.` : `The x equation forces ${inline("s=2")}; the y equation gives ${inline("u=0")}. Both z values are negative one, so the lines intersect at ${inline(`(${p+2},4,-1)`)}. Their directions are not parallel.`,
      [step("x equation","Use separate parameters for the two lines.",String.raw`${p}+s=${p+2}\Rightarrow s=2`),step("y equation","Use the value of s to solve u.",String.raw`2s=4+u\Rightarrow u=0`),step("z check","Check the third equation rather than assuming agreement.",test?String.raw`1-s=-1\ne1+u=1`:String.raw`1-s=-1=-1+u`),step("Classify","The directions are not scalar multiples; use the coordinate check to distinguish an intersection from skew lines.",test?String.raw`L_1\cap L_2=\varnothing`:String.raw`L_1\cap L_2=\{(${p+2},4,-1)\}`)],
      ["Writes corresponding coordinate equations with separate parameters","Solves for the candidate parameter pair","Checks the z-coordinate explicitly","States and justifies the complete relationship"],["A","T","C"],test),
    written(prefix+"w3",`Find a vector equation of the intersection of ${inline(String.raw`\Pi_1:x+y+z=${p+1}`)} and ${inline(String.raw`\Pi_2:x-y+z=${p-1}`)}. Verify its anchor and direction against both planes.`,
      `Subtract the equations to obtain ${inline("y=1")}. Then ${inline(`z=${p}-x`)}. One intersection line is ${inline(String.raw`\vec r=[0,1,${p}]+t[1,0,-1]`)}. The anchor satisfies both equations, and the direction has zero dot product with both normals.`,
      [step("Eliminate","Subtract the second equation from the first.",String.raw`2y=2\Rightarrow y=1`),step("Free variable","Let x=t and solve z.",String.raw`x=t,\quad y=1,\quad z=${p}-t`),step("Vector form","Separate constants from parameter coefficients.",String.raw`\vec r=[0,1,${p}]+t[1,0,-1]`),step("Verify","The anchor lies on both planes and the direction is perpendicular to both normals.",String.raw`0+1+${p}=${p+1},\quad0-1+${p}=${p-1},\quad[1,0,-1]\cdot[1,\pm1,1]=0`)],
      ["Eliminates a variable correctly","Introduces a free parameter and obtains all coordinates","Writes a correct intersection line","Checks both location and direction in both planes"],["A","T","C"],test),
    written(prefix+"w4",`For ${inline(String.raw`\Pi_1:x+y+z=${p}`)}, ${inline(String.raw`\Pi_2:x-y+z=${p}`)} and ${inline(String.raw`\Pi_3:2x+2z=k`)}, find every value of ${inline("k")} for which the system is consistent. Describe the complete common solution set in every case.`,
      `Adding the first two equations gives ${inline(`2x+2z=${2*p}`)}. Thus ${inline(`k=${2*p}`)} makes the third equation redundant and the common set is ${inline(String.raw`\vec r=[0,0,${p}]+t[1,0,-1]`)}. For every other k the system is inconsistent. No value gives exactly one point because the third equation either repeats or contradicts the existing constraint.`,
      [step("Compare equations","Add the first two constraints.",String.raw`(x+y+z)+(x-y+z)=2x+2z=${2*p}`),step("Consistency","The third equation must have the same right side.",String.raw`k=${2*p}`),step("Common line","Subtract the first two equations and parameterize the remaining relation.",String.raw`y=0,\quad z=${p}-x,\quad\vec r=[0,0,${p}]+t[1,0,-1]`),step("Other cases","A different right side produces a contradiction.",String.raw`k\ne${2*p}\Rightarrow\Pi_1\cap\Pi_2\cap\Pi_3=\varnothing`)],
      ["Identifies the dependent combination of equations","Obtains the exact consistency condition","Parameterizes the full common line","Classifies all other values and explains why a unique point is impossible"],["T","C"],test)
  );return q;
}

function distances(p:number,test:boolean):AssessmentQuestion[]{
  const prefix=`${test?"t":"q"}-92-`;
  const c=(n:number,prompt:string,options:string[],why:string,math:string,tags:KATCCategory[]=["K"])=>choice(prefix+n,prompt,options,why,math,tags,n%4);
  const q:AssessmentQuestion[]=[
    c(1,`Find the distance from ${inline(`P(0,${p})`)} to ${inline("3x+4y=0")}.`,
      [inline(fraction(4*p,5)),inline(String(p)),inline(fraction(3*p,5)),inline(String(4*p))],
      "Divide the absolute Cartesian residual by the magnitude of the nonzero normal.",String.raw`d=\frac{|3(0)+4(${p})|}{\sqrt{3^2+4^2}}=${fraction(4*p,5)}`,["A"]),
    c(2,`Find the distance from ${inline(`P(0,0,${p})`)} to ${inline(String.raw`L:\vec r=t[1,0,0]`)}.`,
      [inline(String(p)),"0",inline(String(p+1)),inline(String(2*p+1))],
      "The line is the x-axis. The perpendicular foot is the origin for this particular point.",String.raw`d=\sqrt{0^2+${p}^2}=${p}`,["A"]),
    c(3,`The plane is ${inline(`2x-y+2z=${p}`)}. What is the magnitude of a normal used in the Cartesian point-plane distance formula?`,
      ["3","5","9",inline(String.raw`\sqrt5`)],
      "The normal is [2,-1,2], whose squared magnitude is four plus one plus four.",String.raw`\|[2,-1,2]\|=\sqrt{4+1+4}=3`),
    c(4,`What is the distance from ${inline(`P(${p},0,0)`)} to ${inline(`x=${p}`)}?`,
      ["0","1",inline(String(p+1)),inline(String(p+2))],
      "The point satisfies the plane equation, so it already lies on the plane.",String.raw`|${p}-${p}|=0`,["K"]),
    c(5,`A student multiplies ${inline(`x+2y+2z=${p}`)} by five before calculating the distance from a fixed point. What happens to the distance?`,
      ["It remains unchanged","It becomes five times larger","It becomes one fifth as large","It becomes zero"],
      "Both the absolute residual and the normal magnitude gain the same factor of five.",String.raw`\frac{|5(Ax_0+By_0+Cz_0-D)|}{\|5\vec n\|}=\frac{|Ax_0+By_0+Cz_0-D|}{\|\vec n\|}`,["T"]),
    c(6,`For a point outside ${inline(String.raw`\Pi:x+2y+2z=${p}`)}, which condition must its shortest connector to the plane satisfy?`,
      ["Its direction is parallel to [1,2,2]","Its direction is parallel to the plane","Its endpoint may be outside the plane","Its direction has zero magnitude"],
      "The shortest connector is perpendicular to the plane, so it follows a nonzero normal direction and ends on the plane.",String.raw`\overrightarrow{HP}=\lambda[1,2,2],\qquad H\in\Pi`,["K","T"]),
  ];
  if(test)q.push(
    c(7,`For ${inline(`P(1,${p},3)`)} and ${inline(String.raw`L:\vec r=t[1,0,0]`)}, what is the nearest point H on the line?`,
      [inline("(1,0,0)"),inline("(0,0,0)"),inline(`(1,${p},0)`),inline(`(0,${p},3)`)],
      "A foot on the x-axis has y=z=0. Matching x=1 makes the connector perpendicular to [1,0,0].",String.raw`H=(1,0,0),\quad(P-H)\cdot[1,0,0]=[0,${p},3]\cdot[1,0,0]=0`,["A"]),
    c(8,`Find the separation of the parallel planes ${inline(`x+2y+2z=${p}`)} and ${inline(`2x+4y+4z=${2*p+12}`)}.`,
      ["2","4","6",inline(fraction(p+12,3))],
      "Divide the second equation by two before comparing constants. The constant difference is six and the shared normal magnitude is three.",String.raw`d=\frac{|(${p+6})-${p}|}{3}=2`,["A","T"]))
  const r=3*p+7,hx=fraction(25*p-3*r,25),hy=fraction(50-4*r,25),a=p+6;
  q.push(
    written(prefix+"w1",`For ${inline(`P(${p},2)`)} and ${inline("L:3x+4y=1")}, find the exact distance and nearest point H. Verify that H lies on L and that PH is perpendicular to L.`,
      `The residual is ${inline(String(r))}, so ${inline(`d=${fraction(r,5)}`)}. The foot is ${inline(`H(${hx},${hy})`)}. It satisfies ${inline("3x+4y=1")}; ${inline(String.raw`P-H=\frac{${r}}{25}[3,4]`)} is parallel to the line normal and perpendicular to direction ${inline("[4,-3]")}.`,
      [step("Distance","Use the absolute residual and the normal magnitude.",String.raw`d=\frac{|3(${p})+4(2)-1|}{5}=${fraction(r,5)}`),step("Foot","Remove the normal displacement from P.",String.raw`H=[${p},2]-\frac{${r}}{25}[3,4]=[${hx},${hy}]`),step("Membership","Substitute the exact foot coordinates.",String.raw`3(${hx})+4(${hy})=1`),step("Perpendicularity","The connector is a multiple of the normal.",String.raw`[3,4]\cdot[4,-3]=12-12=0`)],
      ["Calculates the exact distance using a nonzero normal","Finds the exact perpendicular foot","Checks that H lies on the line","Verifies the perpendicular connector"],["A","T","C"],test),
    written(prefix+"w2",`Find the exact distance from ${inline(`P(2,${p},3)`)} to ${inline(String.raw`L:\vec r=[1,${p},0]+t[1,1,0]`)}. Use projection or the cross-product area method, then find and verify the perpendicular foot.`,
      `The displacement from the anchor to P is ${inline("[1,0,3]")}. Projection gives ${inline("t=1/2")}, so ${inline(`H(3/2,${fraction(2*p+1,2)},0)`)}. The residual is ${inline("[1/2,-1/2,3]")}, perpendicular to the line direction. Its magnitude is ${inline(String.raw`\sqrt{38}/2`)}.`,
      [step("Displacement","Subtract the line anchor from P.",String.raw`\vec w=[1,0,3],\quad\vec d=[1,1,0]`),step("Projection parameter","Project w onto the line direction.",String.raw`t=\frac{\vec w\cdot\vec d}{\vec d\cdot\vec d}=\frac12`),step("Foot and check","Use t=1/2 in the line, then check the residual.",String.raw`H=[\tfrac32,${fraction(2*p+1,2)},0],\quad[\tfrac12,-\tfrac12,3]\cdot[1,1,0]=0`),step("Exact length","Compute the magnitude without premature rounding.",String.raw`d=\sqrt{\tfrac14+\tfrac14+9}=\frac{\sqrt{38}}2`)],
      ["Obtains the correct anchor displacement and direction","Uses projection or cross-product distance correctly","Calculates and verifies the perpendicular foot","Reports the exact distance with reasoning"],["A","T","C"],test),
    written(prefix+"w3",`For ${inline(`P(${p},1,4)`)} and ${inline(String.raw`\Pi:x+2y+2z=4`)}, find the exact distance and the nearest point H. Verify both plane membership and the normal direction of PH.`,
      `The normal is ${inline("[1,2,2]")} with magnitude three. The residual is ${inline(String(a))}, giving ${inline(`d=${fraction(a,3)}`)}. The foot is ${inline(`H(${fraction(9*p-a,9)},${fraction(9-2*a,9)},${fraction(36-2*a,9)})`)}. Substitution gives four, and ${inline(String.raw`P-H=\frac{${a}}9[1,2,2]`)}.`,
      [step("Residual and normal","Evaluate the Cartesian expression at P.",String.raw`r=${p}+2+8-4=${a},\quad\|\vec n\|=\sqrt{1+4+4}=3`),step("Distance","Take the absolute scalar residual over normal magnitude.",String.raw`d=\frac{${a}}3=${fraction(a,3)}`),step("Nearest point","Subtract the required normal displacement.",String.raw`H=[${p},1,4]-\frac{${a}}9[1,2,2]`),step("Verify","The point lies on the plane and the connector is normal to it.",String.raw`x_H+2y_H+2z_H=4,\quad P-H=\frac{${a}}9\vec n`)],
      ["Identifies the normal and evaluates the residual","Obtains the exact distance","Computes the perpendicular foot","Verifies membership and perpendicularity"],["A","C"],test),
    written(prefix+"w4",`A student claims that the shortest distance from ${inline(`P(1,${p},3)`)} to the x-axis is its distance to the origin. Assess the claim by finding the correct foot, comparing the two exact lengths and explaining the geometric condition.`,
      `The foot is ${inline("H(1,0,0)")}, giving ${inline(String.raw`PH=\sqrt{${p*p+9}}`)}. The origin is on the line, but ${inline(String.raw`PO=\sqrt{${p*p+10}}`)} is longer. The correct connector has zero dot product with the x-axis direction. A point on the target is not necessarily the nearest point.`,
      [step("Foot","A point on the x-axis has y=z=0; choose the same x-coordinate as P.",String.raw`H=(1,0,0)`),step("Perpendicularity","Check the connector against the line direction.",String.raw`[0,${p},3]\cdot[1,0,0]=0`),step("Compare lengths","Keep both magnitudes exact.",String.raw`PH=\sqrt{${p*p+9}}<\sqrt{${p*p+10}}=PO`),step("Conclusion","Reject the claim. The shortest connector must meet the target at a right angle, which the connector to the origin does not.")],
      ["Finds the correct perpendicular foot","Checks the zero dot product","Compares both exact connector lengths","Explains why target membership alone is insufficient"],["T","C"],test)
  );return q;
}

const instructions = [
  "Use exact fractions and radicals unless an approximation is requested.",
  "For written responses, show the method, state the geometric conclusion and verify it in the original equations.",
  "A labelled sketch is required when requested. It may be completed on paper alongside your typed response.",
  "Award written-response marks using the stated criteria after completing the paper. Model answers are examples of valid reasoning.",
];
const specifications = [
  { number:"8.1", slug:"8-1", title:"Line equations", coverage:"Sections 8.1 to 8.3", make:lines },
  { number:"8.2", slug:"8-2", title:"Plane equations and sketching", coverage:"Sections 8.4 to 8.6", make:planes },
  { number:"9.1", slug:"9-1", title:"Intersections and systems", coverage:"Sections 9.1 to 9.4", make:intersections },
  { number:"9.2", slug:"9-2", title:"Shortest distances", coverage:"Sections 9.5 to 9.6", make:distances },
];
function bank(test:boolean):Assessment[]{
  return specifications.map(({number,slug,title,coverage,make})=>({
    id:`${test?"test":"quiz"}-unit-${slug}`, number, title,
    description:`${coverage}.`,
    mode:test?"exam":"quiz",kind:test?"test":"quiz",timeLimit:test?"60 min":"35 min",instructions,
    questions:make(test?3:1,test),
  }));
}
export const unitQuizzes:Assessment[]=bank(false);
export const unitTests:Assessment[]=bank(true);
