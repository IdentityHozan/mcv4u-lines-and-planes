import type { Assessment, AssessmentQuestion, KATCCategory, SolutionStep } from "./linesAndPlanesData";

const parts = (given: string, ...tasks: string[]) =>
  [given, ...tasks.map((task, index) => "(" + String.fromCharCode(97 + index) + ") " + task)].join("\n");

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
    c(2, `What point does ${inline("t=-2")} give on ${inline(String.raw`\vec r=[${p},-1]+t[2,3]`)}?`,
      [inline(`(${p-4},-7)`),inline(`(${p-2},-4)`),inline(`(${p+4},5)`),inline(`(${p-4},5)`)],
      "A negative parameter moves opposite the direction vector. Use it in both coordinates.", String.raw`[${p},-1]-2[2,3]=[${p-4},-7]`, ["A"]),
    c(3, `Which vector equation describes the Cartesian line ${inline(`2x-3y=${2*p+6}`)}?`,
      [inline(String.raw`\vec r=[${p},-2]+t[3,2]`),inline(String.raw`\vec r=[${p},-2]+t[2,-3]`),inline(String.raw`\vec r=[${p},2]+t[3,2]`),inline(String.raw`\vec r=[${p},-2]+t[3,-2]`)],
      "The coefficients give a normal, so choose a perpendicular direction. Setting y = −2 gives the starting point.", String.raw`2x-3(-2)=${2*p+6}\Rightarrow x=${p},\qquad [2,-3]\cdot[3,2]=0`,["K","A"]),
    c(6, `The directions of two R² lines through ${inline(`(${p},0)`)} are ${inline("[1,1]")} and ${inline(test ? "[1,0]" : "[1,-1]")}. What is their smaller angle?`,
      [test ? "45°" : "90°", "0°", test ? "90°" : "45°", "60°"],
      test ? "The absolute dot product is one and the magnitudes are square root two and one, giving cosine one over square root two." : "The dot product is zero and both directions are nonzero, so the lines are perpendicular.",
      test ? String.raw`\cos\theta=\frac{1}{\sqrt2}\Rightarrow\theta=45^\circ` : String.raw`[1,1]\cdot[1,-1]=0\Rightarrow\theta=90^\circ`, ["A"]),
    ...(test ? [
      c(8, `A line in R² has direction ${inline(`[2,${p}]`)}. Which vector is perpendicular to this direction?`,
        [inline(`[${p},-2]`),inline(`[2,${p}]`),inline(`[${p},2]`),inline(`[1,${p}]`)],
        "Swapping components and reversing one sign gives a zero dot product.", String.raw`[2,${p}]\cdot[${p},-2]=${2*p}-${2*p}=0`, ["K","A"])
    ] : []),
    c(4, `Which symmetric description represents ${inline(String.raw`\vec r=[${p},-1,2]+t[0,1,-2]`)}?`,
      [inline(String.raw`x=${p},\quad\frac{y+1}{1}=\frac{z-2}{-2}`),inline(String.raw`x=${p},\quad\frac{y-1}{1}=\frac{z+2}{-2}`),inline(String.raw`y=-1,\quad\frac{x-${p}}1=\frac{z-2}{-2}`),inline(String.raw`z=2,\quad x=${p}+t,\ y=-1-2t`)],
      "The zero x-direction component makes x constant. Only the y and z equations can be divided by nonzero direction components.", String.raw`x=${p},\quad y=-1+t,\quad z=2-2t`, ["K","A"]),
    c(5, `Classify ${inline(String.raw`L_1:\vec r=[${p},-1,2]+t[2,-1,3]`)} and ${inline(String.raw`L_2:\vec r=[${p+2},-2,5]+u[-4,2,-6]`)}.`,
      ["Coincident lines","Distinct parallel lines","Perpendicular intersecting lines","Skew lines"],
      "The second direction is negative two times the first. Its starting point is reached on the first line at t=1, so the lines coincide.", String.raw`[-4,2,-6]=-2[2,-1,3],\quad[${p},-1,2]+[2,-1,3]=[${p+2},-2,5]`, ["T"]),
    ...(test ? [
      c(7, `What set is described by ${inline(String.raw`\vec r=[${p},2,-1]+t[0,0,0]`)}, ${inline(String.raw`t\in\mathbb R`)}?`,
        ["One point", "An infinite line", "A plane", "All of R³"],
        "The zero direction produces no displacement for any parameter. The equation returns only its constant position.", String.raw`\vec r=[${p},2,-1]\quad\text{for every }t`, ["T"])
    ] : []),
  ];
  q.push(
    written(prefix+"w1", parts(`A line passes through ${inline(`A(${p},2)`)} and ${inline(`B(${p+6},6)`)}.`,
      "Subtract the coordinates to find a simplified direction.",
      "Use A to write vector and parametric equations.",
      "Give a second vector equation using B and a direction that points the other way.",
      "Find the parameter for B in your first equation. Explain why the two equations give the same line."),
      `A direction is ${inline("[3,2]")}. Using A gives ${inline(String.raw`\vec r=[${p},2]+t[3,2]`)}, so ${inline(String.raw`x=${p}+3t,\ y=2+2t`)}. Using B gives ${inline(String.raw`\vec r=[${p+6},6]+u[-3,-2]`)}. The two equations describe the same line: B lies on the first at ${inline("t=2")}, and their directions are parallel.`,
      [step("Find the direction","Subtract the coordinates of A from those of B and divide by two.",String.raw`\overrightarrow{AB}=[6,4]=2[3,2]`),
       step("Write the first equation","Start at A and use one parameter for both coordinates.",String.raw`\vec r=[${p},2]+t[3,2],\qquad x=${p}+3t,\quad y=2+2t`),
       step("Change the starting point and direction","Start at B and reverse the direction.",String.raw`\vec r=[${p+6},6]+u[-3,-2]`),
       step("Check the shared point","The first equation reaches B at t = 2. Parallel directions and a shared point fix the same line.",String.raw`[${p},2]+2[3,2]=[${p+6},6]`)],
      ["Finds a nonzero direction parallel to AB","Writes vector and parametric equations based at A","Writes an equivalent vector equation based at B with a reversed direction","Verifies B and explains why the lines are the same"],["A","C"],test),
    written(prefix+"w3", parts(`The R² lines ${inline("kx+2y=1")} and ${inline(`3x+${p}y=2`)} are perpendicular.`,
      "Write a normal vector for each line.",
      `Use the dot product to find ${inline("k")}.`,
      "Verify your value and explain why the test applies to the two lines."),
      `The normals are ${inline("[k,2]")} and ${inline(`[3,${p}]`)}. Their dot product must vanish, so ${inline(`3k+${2*p}=0`)} and ${inline(`k=${fraction(-2*p,3)}`)}. Both normals remain nonzero, and in R² this establishes perpendicular line directions.`,
      [step("Normals","Read the coefficients of x and y.",String.raw`\vec n_1=[k,2],\quad\vec n_2=[3,${p}]`),step("Perpendicularity","For lines in R², perpendicular normals give perpendicular line directions.",String.raw`[k,2]\cdot[3,${p}]=0`),step("Solve","Expand and solve the scalar equation.",String.raw`3k+${2*p}=0\Rightarrow k=${fraction(-2*p,3)}`),step("Check","Substitute the value into the dot product.",String.raw`3\left(${fraction(-2*p,3)}\right)+${2*p}=0`)],
      ["Identifies both normal vectors","Uses the correct zero-dot-product condition","Solves for k exactly","Explains why the test applies to lines in R²"],["K","A","C"],test),
    written(prefix+"w2", parts(`A line passes through ${inline(`A(${p},-1,2)`)} and ${inline(`B(${p},3,-6)`)}.`,
      "Find a simplified direction.",
      "Write vector and parametric equations.",
      "Write the symmetric description. Explain why one coordinate stays fixed.",
      `Test whether ${inline(`Q(${p},1,-2)`)} lies on the line.`),
      `Use direction ${inline("[0,1,-2]")}. Then ${inline(String.raw`\vec r=[${p},-1,2]+t[0,1,-2]`)}, with ${inline(String.raw`x=${p},\ y=-1+t,\ z=2-2t`)}. In symmetric form, ${inline(String.raw`x=${p},\ \frac{y+1}{1}=\frac{z-2}{-2}`)}. The x direction component is zero. Q lies on the line at ${inline("t=2")}.`,
      [step("Direction","Subtract A from B and divide the components by four.",String.raw`\overrightarrow{AB}=[0,4,-8]=4[0,1,-2]`),
       step("Vector and parametric forms","Start at A, then read each coordinate.",String.raw`\vec r=[${p},-1,2]+t[0,1,-2],\quad x=${p},\ y=-1+t,\ z=2-2t`),
       step("Symmetric form","Keep x separate because its direction component is zero. Solve the y and z equations for t.",String.raw`x=${p},\qquad\frac{y+1}{1}=\frac{z-2}{-2}`),
       step("Membership","The y-coordinate of Q gives t = 2. Check all three coordinates with that value.",String.raw`[${p},-1,2]+2[0,1,-2]=[${p},1,-2]`)],
      ["Finds a valid simplified direction","Writes correct vector and parametric forms","Writes the symmetric description and explains the fixed coordinate","Checks Q using one shared parameter"],["A","T","C"],test),
    written(prefix+"w4", parts(`Compare ${inline(String.raw`L:\vec r=[${p},0,1]+t[1,2,-1]`)} with these two lines:
${inline(String.raw`M:\vec r=[${p+3},6,-2]+u[-2,-4,2]`)}
${inline(String.raw`N:\vec r=[${p+3},6,0]+v[-2,-4,2]`)}`,
      "Compare the direction vectors.",
      "Test whether each starting point lies on L. Check all three coordinates.",
      "State the relationship of L with M and of L with N."),
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
    ...(test ? [
      c(8,`Which plane is perpendicular to ${inline(`x-y+z=${p}`)}?`,[inline("x+y=2"),inline(`2x-2y+2z=${p}`),inline("x-y+z=0"),inline("x-y=1")],
        "The normals [1,-1,1] and [1,1,0] have zero dot product. The other proposed normals are not perpendicular to the reference normal.",String.raw`[1,-1,1]\cdot[1,1,0]=1-1+0=0`,["K","A"])
    ] : []),
    c(4,`What is the perpendicular projection of ${inline(`P(${p},-2,3)`)} onto the xy-plane?`,
      [inline(`(${p},-2,0)`),inline(`(0,-2,3)`),inline(`(${p},0,3)`),inline(`(${p},-2,-3)`)],
      "The xy-plane has z=0. The projection preserves x and y and removes only the z displacement.",String.raw`P(${p},-2,3)\mapsto H(${p},-2,0)`,["A"]),
    c(5,`Which equation is the xy-plane trace of ${inline(`x+2y+z=${D}`)}?`,
      [inline(`2y+x=${D},\ z=0`),inline(`x+z=${D},\ y=0`),inline(`2y+z=${D},\ x=0`),inline(`x=0,\ y=0`)],
      "Set z to zero while allowing x and y to vary subject to the remaining linear relation.",String.raw`z=0\Rightarrow x+2y=${D}`,["K","A"]),
    c(6,`Find the x-axis intercept of ${inline(`x+y+z=${D}`)}.`,
      [inline(`(${D},0,0)`),inline(`(0,${D},0)`),inline(`(0,0,${D})`),inline(`(${D},${D},0)`)],
      "Set y=z=0 at an x-axis intercept.",String.raw`y=z=0\Rightarrow x=${D}`,["A"]),
    ...(test ? [
      c(7,`For ${inline(`x+z=${D}`)}, which coordinate can change freely while the other two coordinates remain fixed?`,["y","x only","z only","No coordinate can vary"],
        "The missing y term means translating in the y direction leaves the equation unchanged. X and z remain linked.",String.raw`x=${D}-z,\quad y\in\mathbb R`,["T"])
    ] : []),
  ];
  q.push(
    written(prefix+"w1",parts(`A plane contains ${inline(`A(${p},0,1)`)}, ${inline(`B(${p+1},1,1)`)} and ${inline(`C(${p},1,2)`)}.`,
      "Find two direction vectors and explain why they determine a unique plane through A.",
      "Write vector and parametric equations for the plane.",
      `Use one pair of parameters to decide whether ${inline(`Q(${p+2},3,2)`)} lies on the plane.`,
      "Find a normal vector and use it to write a Cartesian equation."),
      `The vectors ${inline("[1,1,0]")} and ${inline("[0,1,1]")} are independent. The plane is ${inline(String.raw`\vec r=[${p},0,1]+s[1,1,0]+t[0,1,1]`)}, so ${inline(String.raw`x=${p}+s,\ y=s+t,\ z=1+t`)}. Q is on the plane at ${inline("(s,t)=(2,1)")}. The cross product gives the normal ${inline("[1,-1,1]")} and the Cartesian equation ${inline(`x-y+z=${p+1}`)}.`,
      [step("Find independent directions","Subtract A from B and C. The vectors are not scalar multiples, so the three points determine a unique plane.",String.raw`\overrightarrow{AB}=[1,1,0],\quad\overrightarrow{AC}=[0,1,1]`),
       step("Write both forms","Start at A, then read the components of the vector equation.",String.raw`\vec r=[${p},0,1]+s[1,1,0]+t[0,1,1],\quad x=${p}+s,\ y=s+t,\ z=1+t`),
       step("Test Q","The x- and z-coordinates give s = 2 and t = 1. This pair gives y = 3, so Q belongs to the plane.",String.raw`${p}+s=${p+2},\quad1+t=2,\quad s+t=2+1=3`),
       step("Write Cartesian form","Cross the directions to find a normal and substitute the coordinates of A.",String.raw`[1,1,0]\times[0,1,1]=[1,-1,1],\quad (x-${p})-y+(z-1)=0\Rightarrow x-y+z=${p+1}`)],
      ["Finds two independent directions and explains uniqueness","Writes correct vector and parametric equations","Checks all three coordinates of Q with one parameter pair","Finds a normal and the correct Cartesian equation"],["A","T","C"],test),
    written(prefix+"w2",parts(`A plane contains ${inline(String.raw`L:\vec r=[${p},1,0]+s[2,0,1]`)} and ${inline(`Q(${p+1},2,2)`)}.`,
      "Find a vector from the line's starting point to Q. Explain why the two directions are independent.",
      "Write a vector equation and a Cartesian equation for the plane.",
      "Show that the entire line and Q are on your plane."),
      `A connector from the line anchor to Q is ${inline("[1,1,2]")}. Hence ${inline(String.raw`\vec r=[${p},1,0]+u[2,0,1]+v[1,1,2]`)}. A normal is ${inline("[-1,-3,2]")}, giving ${inline(`x+3y-2z=${p+3}`)}. The line is obtained when ${inline("v=0")}; Q is obtained at ${inline("(u,v)=(0,1)")}.`,
      [step("Connector","Subtract the line anchor from Q.",String.raw`\overrightarrow{AQ}=[1,1,2]`),step("Construct","The connector is independent of the line direction.",String.raw`\vec r=[${p},1,0]+u[2,0,1]+v[1,1,2]`),step("Cartesian form","Cross the spans and use the anchor.",String.raw`[2,0,1]\times[1,1,2]=[-1,-3,2],\quad x+3y-2z=${p+3}`),step("Verify","Substitution reproduces both required objects.",String.raw`v=0\Rightarrow L,\quad(u,v)=(0,1)\Rightarrow Q`)],
      ["Finds the connector and checks independence","Constructs vector form with two parameters","Finds the correct normal and Cartesian equation","Verifies the whole line and external point"],["A","C"],test),
    written(prefix+"w3",parts(`Two planes are given by ${inline(`x+y+z=${D}`)} and ${inline(`x+z=${p}`)}.`,
      "Write a normal vector for each plane.",
      "Find their dot product and both exact magnitudes.",
      "Find the exact cosine of the smaller angle, then give the angle to one decimal place."),
      `The normals are ${inline("[1,1,1]")} and ${inline("[1,0,1]")}. Their dot product is two and their magnitudes are ${inline(String.raw`\sqrt3`)} and ${inline(String.raw`\sqrt2`)}. Thus ${inline(String.raw`\cos\theta=2/\sqrt6`)} and ${inline(String.raw`\theta\approx35.3^\circ`)}.`,
      [step("Normals","Read coefficients, including the missing y term.",String.raw`\vec n_1=[1,1,1],\quad\vec n_2=[1,0,1]`),step("Dot product and magnitudes","Keep the radicals exact.",String.raw`\vec n_1\cdot\vec n_2=2,\quad\|\vec n_1\|=\sqrt3,\quad\|\vec n_2\|=\sqrt2`),step("Smaller angle","Use the absolute dot product.",String.raw`\cos\theta=\frac{|2|}{\sqrt3\sqrt2}=\frac2{\sqrt6}`),step("Approximate","Use inverse cosine in degree mode only at the end.",String.raw`\theta=\cos^{-1}(2/\sqrt6)\approx35.3^\circ`)],
      ["Identifies both normals","Calculates the dot product and exact magnitudes","Obtains the correct exact cosine ratio","Calculates and labels the smaller angle"],["K","A","C"],test),
    written(prefix+"w4",parts(`A plane has equation ${inline(`2x+3y+6z=${6*(p+1)}`)}.`,
      "Find the intercept on each axis.",
      "Find the trace on each coordinate plane.",
      "Sketch the plane on labelled axes. Explain what the intercept triangle shows."),
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
    c(2,`A line has equation ${inline(String.raw`L:\vec r=[${p},0,0]+t[1,-1,0]`)}. How does it meet the two planes ${inline(String.raw`\Pi_1:x+y=${p}`)} and ${inline(String.raw`\Pi_2:x+y=${p+1}`)}?`,
      ["L lies in the first plane and misses the second.","L meets both planes at one point each.","L misses both planes.","L lies in the second plane and misses the first."],
      "Substitution gives an identity in the first equation and a contradiction in the second.",String.raw`(${p}+t)-t=${p},\qquad ${p}\ne${p+1}`, ["T"]),
    c(4,`Classify ${inline(String.raw`L_1:\vec r=[${p},0,0]+s[1,0,0]`)} and ${inline(String.raw`L_2:\vec r=[0,1,1]+t[0,1,0]`)}.`,
      ["Skew lines","Coincident lines","Distinct parallel lines","Intersecting perpendicular lines"],
      "Their nonparallel directions do not guarantee intersection. The first has z=0 and the second z=1, so they cannot meet.",String.raw`z_{L_1}=0,\quad z_{L_2}=1,\quad[1,0,0]\not\parallel[0,1,0]`, ["K","T"]),
    c(3,`A system reduces to ${inline(`x+y=${p}`)}, ${inline("z=1")} and ${inline("0=0")}. Let ${inline("y=t")}. What is the full solution set?`,
      [inline(String.raw`(x,y,z)=(${p}-t,t,1),\quad t\in\mathbb R`),inline(String.raw`(x,y,z)=(${p},0,1)\text{ only}`),inline(String.raw`(x,y,z)=(${p}+t,t,1),\quad t\in\mathbb R`),"No solutions"],
      "The identity adds no constraint. Every real value of y gives a matching x, and z stays fixed.",String.raw`y=t\Rightarrow x=${p}-t,\quad z=1`, ["T","A"]),
    ...(test ? [
      c(7,`The equations ${inline(`x+y+z=${p}`)} and ${inline(`2x+2y+2z=${2*p+1}`)} reduce to ${inline("0=1")}. What does this imply?`,
        ["There is no common solution","One coordinate is free","There is a unique point","The equations describe the same plane"],
        "A contradiction is false for all variable values. The planes have parallel normals but different locations.",String.raw`2(x+y+z)=${2*p}\ne${2*p+1}`, ["T"])
    ] : []),
    c(5,`Which vector is parallel to the intersection of ${inline(`x+y+z=${p}`)} and ${inline(`x-y+z=${p}`)}?`,
      [inline("[1,0,-1]"),inline("[1,0,1]"),inline("[0,1,0]"),inline("[1,1,1]")],
      "A line in both planes has direction perpendicular to both plane normals.",String.raw`[1,1,1]\times[1,-1,1]=[2,0,-2]=2[1,0,-1]`,["A"]),
    c(6,`What is the common solution set of ${inline(`x+y=${p}`)}, ${inline(`y+z=${p}`)} and ${inline(`x+z=${p}`)}?`,
      [inline(String.raw`\{(${fraction(p,2)},${fraction(p,2)},${fraction(p,2)})\}`),"An infinite line","A plane","The empty set"],
      "Subtracting pairs gives x=y=z. Substituting into any original equation gives twice each coordinate equal to the constant.",String.raw`x=y=z,\quad2x=${p}\Rightarrow x=y=z=${fraction(p,2)}`, ["A","T"]),
    ...(test ? [
      c(8,`Consider ${inline(`x+y+z=${p}`)}, ${inline(`x-y+z=${p}`)} and ${inline(`2x+2z=${2*p}`)}. How many independent plane constraints remain?`,
        ["Two, giving an intersection line","Three, giving a unique point","One, giving an entire plane","Zero, giving all of R³"],
        "The third equation is the sum of the first two and contributes no new restriction. The first two normals are not parallel.",String.raw`(x+y+z)+(x-y+z)=2x+2z=${2*p}`, ["T"])
    ] : []),
  ];
  q.push(
    written(prefix+"w1",parts(`Find where this line meets this plane:
${inline(String.raw`L:\vec r=[1,0,${p}]+t[2,1,-1]`)}
${inline(String.raw`\Pi:x+y+z=${p+5}`)}`,
      "Substitute the line's coordinates into the plane equation.",
      "Find the parameter and the intersection point.",
      "Check the point in the line and the plane."),
      `Substitution gives ${inline(`1+${p}+2t=${p+5}`)}, so ${inline("t=2")}. The intersection is ${inline(`P(5,2,${p-2})`)}. Its coordinates come from one shared line parameter and satisfy the plane because ${inline(`5+2+${p-2}=${p+5}`)}.`,
      [step("Substitute","Use all three line coordinates.",String.raw`(1+2t)+t+(${p}-t)=${p+5}`),step("Solve","Collect the parameter terms.",String.raw`2t=4\Rightarrow t=2`),step("Point","Substitute the same value into x,y,z.",String.raw`P=(5,2,${p-2})`),step("Verify","Check the original line and plane.",String.raw`[1,0,${p}]+2[2,1,-1]=[5,2,${p-2}],\quad5+2+(${p-2})=${p+5}`)],
      ["Forms the correct scalar equation","Solves the intersection parameter","Calculates all coordinates consistently","Verifies the point in both objects"],["A","C"],test),
    written(prefix+"w2",parts(`Compare these two lines:
${inline(String.raw`L_1:\vec r=[${p},0,1]+s[1,2,-1]`)}
${inline(String.raw`L_2:\vec r=[${p+2},4,${test?1:-1}]+u[0,1,1]`)}`,
      "Match corresponding coordinates, keeping s and u separate.",
      "Solve two coordinate equations and check the third.",
      "Classify the lines. If they intersect, give the intersection point."),
      test ? `The x equation forces ${inline("s=2")}; the y equation then forces ${inline("u=0")}. The z values are negative one and positive one, so the lines do not intersect. Their directions are not parallel, so they are skew.` : `The x equation forces ${inline("s=2")}; the y equation gives ${inline("u=0")}. Both z values are negative one, so the lines intersect at ${inline(`(${p+2},4,-1)`)}. Their directions are not parallel.`,
      [step("x equation","Use separate parameters for the two lines.",String.raw`${p}+s=${p+2}\Rightarrow s=2`),step("y equation","Use the value of s to solve u.",String.raw`2s=4+u\Rightarrow u=0`),step("z check","Check the third equation rather than assuming agreement.",test?String.raw`1-s=-1\ne1+u=1`:String.raw`1-s=-1=-1+u`),step("Classify","The directions are not scalar multiples; use the coordinate check to distinguish an intersection from skew lines.",test?String.raw`L_1\cap L_2=\varnothing`:String.raw`L_1\cap L_2=\{(${p+2},4,-1)\}`)],
      ["Writes corresponding coordinate equations with separate parameters","Solves for the candidate parameter pair","Checks the z-coordinate explicitly","States and justifies the complete relationship"],["A","T","C"],test),
    written(prefix+"w3",parts(`Find the common set of these two planes:
${inline(String.raw`\Pi_1:x+y+z=${p+1}`)}
${inline(String.raw`\Pi_2:x-y+z=${p-1}`)}`,
      "Use elimination to find a fixed coordinate.",
      "Choose a free parameter and write a vector equation of the intersection.",
      "Check the starting point and direction against both planes."),
      `Subtract the equations to obtain ${inline("y=1")}. Then ${inline(`z=${p}-x`)}. One intersection line is ${inline(String.raw`\vec r=[0,1,${p}]+t[1,0,-1]`)}. The anchor satisfies both equations, and the direction has zero dot product with both normals.`,
      [step("Eliminate","Subtract the second equation from the first.",String.raw`2y=2\Rightarrow y=1`),step("Free variable","Let x=t and solve z.",String.raw`x=t,\quad y=1,\quad z=${p}-t`),step("Vector form","Separate constants from parameter coefficients.",String.raw`\vec r=[0,1,${p}]+t[1,0,-1]`),step("Verify","The anchor lies on both planes and the direction is perpendicular to both normals.",String.raw`0+1+${p}=${p+1},\quad0-1+${p}=${p-1},\quad[1,0,-1]\cdot[1,\pm1,1]=0`)],
      ["Eliminates a variable correctly","Introduces a free parameter and obtains all coordinates","Writes a correct intersection line","Checks both location and direction in both planes"],["A","T","C"],test),
    written(prefix+"w4",parts(`The three planes depend on a real constant ${inline("k")}:
${inline(String.raw`\Pi_1:x+y+z=${p+4}`)}
${inline(String.raw`\Pi_2:x-2y+z=${p+1}`)}
${inline(String.raw`\Pi_3:x+2y+kz=${p+1}k+4`)}`,
      "Use the first two planes to find y and an expression for x in terms of z.",
      "Substitute into the third equation. Identify the value of k that must be considered separately before you divide.",
      "For each case, describe the complete common set and give its equation or coordinates."),
      `The first two planes give ${inline(`y=1,\ x=${p+3}-z`)}. The third reduces to ${inline(`(k-1)z=${p+1}(k-1)`)}. If ${inline(String.raw`k\ne1`)}, the three planes meet at ${inline(`(2,1,${p+1})`)}. If ${inline("k=1")}, the third plane adds no constraint, and all three share ${inline(String.raw`\vec r=[${p+3},1,0]+t[-1,0,1]`)}.`,
      [step("Eliminate y","Subtract the second equation from the first to find y, then substitute into the first.",String.raw`3y=3\Rightarrow y=1,\quad x+z=${p+3}`),
       step("Reduce the third equation","Substitute x and y, then collect the z terms. Do not divide by k−1 until you know it is nonzero.",String.raw`${p+3}-z+2+kz=${p+1}k+4\Rightarrow(k-1)z=${p+1}(k-1)`),
       step("When k is not 1","Divide by the nonzero coefficient and back-substitute. The three equations then fix all coordinates.",String.raw`z=${p+1},\quad x=2,\quad y=1`),
       step("When k is 1","The reduced equation is an identity. Use z as the free parameter in the first two equations.",String.raw`z=t,\quad x=${p+3}-t,\quad\vec r=[${p+3},1,0]+t[-1,0,1]`)],
      ["Eliminates a variable and obtains the constraints from the first two planes","Reduces the third equation and isolates the special value","Obtains the unique point when k is not one","Parameterizes the common line when k equals one"],["A","T","C"],test)
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
    ...(test ? [
      c(7,`For ${inline(`P(1,${p},3)`)} and ${inline(String.raw`L:\vec r=t[1,0,0]`)}, what is the nearest point H on the line?`,
        [inline("(1,0,0)"),inline("(0,0,0)"),inline(`(1,${p},0)`),inline(`(0,${p},3)`)],
        "A foot on the x-axis has y=z=0. Matching x=1 makes the connector perpendicular to [1,0,0].",String.raw`H=(1,0,0),\quad(P-H)\cdot[1,0,0]=[0,${p},3]\cdot[1,0,0]=0`,["A"])
    ] : []),
    c(3,`The plane is ${inline(`2x-y+2z=${p}`)}. What is the magnitude of the normal read directly from these coefficients?`,
      ["3","5","9",inline(String.raw`\sqrt5`)],
      "The normal is [2,-1,2], whose squared magnitude is four plus one plus four.",String.raw`\|[2,-1,2]\|=\sqrt{4+1+4}=3`),
    c(6,`For a point outside ${inline(String.raw`\Pi:x+2y+2z=${p}`)}, which condition must its shortest connector to the plane satisfy?`,
      ["Its direction is parallel to [1,2,2]","Its direction is parallel to the plane","Its endpoint may be outside the plane","Its direction has zero magnitude"],
      "The shortest connector is perpendicular to the plane, so it follows a nonzero normal direction and ends on the plane.",String.raw`\overrightarrow{HP}=\lambda[1,2,2],\qquad H\in\Pi`,["K","T"]),
    c(5,`A student multiplies ${inline(`x+2y+2z=${p}`)} by five before calculating the distance from a fixed point. What happens to the distance?`,
      ["It remains unchanged","It becomes five times larger","It becomes one fifth as large","It becomes zero"],
      "Both the absolute residual and the normal magnitude gain the same factor of five.",String.raw`\frac{|5(Ax_0+By_0+Cz_0-D)|}{\|5\vec n\|}=\frac{|Ax_0+By_0+Cz_0-D|}{\|\vec n\|}`,["T"]),
    c(4,`Find the plane midway between ${inline(`2x-y+2z=${p}`)} and ${inline(`6x-3y+6z=${3*(p+8)}`)}.`,
      [inline(`2x-y+2z=${p+4}`),inline(`2x-y+2z=${p+8}`),inline(`2x-y+2z=${2*p+12}`),inline("2x-y+2z=4")],
      "Divide the entire second equation by three. Only then average the right-hand constants, because the planes now use the same normal.",String.raw`\frac{${p}+${p+8}}2=${p+4}\Rightarrow2x-y+2z=${p+4}`,["K","A"]),
    ...(test ? [
      c(8,`Find the separation of the parallel planes ${inline(`x+2y+2z=${p}`)} and ${inline(`2x+4y+4z=${2*p+12}`)}.`,
        ["2","4","6",inline(fraction(p+12,3))],
        "Divide the second equation by two before comparing constants. The constant difference is six and the shared normal magnitude is three.",String.raw`d=\frac{|(${p+6})-${p}|}{3}=2`,["A","T"])
    ] : []),
  ];
  const r=3*p+7,hx=fraction(25*p-3*r,25),hy=fraction(50-4*r,25),a=p+6;
  q.push(
    written(prefix+"w1",parts(`In R², find the distance from ${inline(`P(${p},2)`)} to ${inline(String.raw`L:\vec r=[3,-2]+t[4,-3]`)}.`,
      "Choose a normal vector and write the line in Cartesian form.",
      "Find the exact distance from P to the line.",
      "Find the perpendicular foot H and verify your result."),
      `A normal is ${inline("[3,4]")}, and the Cartesian equation is ${inline("3x+4y=1")}. The exact distance is ${inline(`d=${fraction(r,5)}`)}. The foot ${inline(`H(${hx},${hy})`)} lies on the line. The connector ${inline(String.raw`P-H=\frac{${r}}{25}[3,4]`)} is parallel to the normal.`,
      [step("Find the Cartesian equation","A perpendicular direction is a normal. Substitute the starting point into the left side to find the constant.",String.raw`[3,4]\cdot[4,-3]=0,\quad 3(3)+4(-2)=1`),
       step("Find the distance","Use the absolute value of the Cartesian expression at P and divide by the normal's magnitude.",String.raw`d=\frac{|3(${p})+4(2)-1|}{\sqrt{3^2+4^2}}=${fraction(r,5)}`),
       step("Find the foot","Travel along the normal from P. Choose its multiplier so that the resulting point lies on the line.",String.raw`H=[${p},2]-\frac{${r}}{25}[3,4]=[${hx},${hy}]`),
       step("Verify the foot","Substitute H. The connector is a multiple of [3,4], so it is perpendicular to the line.",String.raw`3(${hx})+4(${hy})=1`)],
      ["Finds a nonzero normal and the correct Cartesian equation","Calculates the exact distance","Finds the exact perpendicular foot","Checks membership and perpendicularity"],["A","T","C"],test),
    written(prefix+"w2",parts(`In R³, consider ${inline(`P(2,${p},3)`)} and ${inline(String.raw`L:\vec r=[1,${p},0]+t[1,1,0]`)}.`,
      "Find the displacement from the line's starting point to P.",
      "Use the cross product to find the exact distance from P to L.",
      "Use perpendicularity to find the foot H. Verify your foot with a dot product."),
      `The displacement is ${inline("[1,0,3]")}. Its cross product with ${inline("[1,1,0]")} is ${inline("[-3,3,1]")}, so the distance is ${inline(String.raw`\sqrt{19}/\sqrt2=\sqrt{38}/2`)}. The foot is ${inline(String.raw`H(\tfrac32,${fraction(2*p+1,2)},0)`)} at ${inline(String.raw`t=\tfrac12`)}. The connector is perpendicular because ${inline(String.raw`[\tfrac12,-\tfrac12,3]\cdot[1,1,0]=0`)}.`,
      [step("Find the displacement","Subtract the line's starting point from P.",String.raw`\overrightarrow{AP}=[1,0,3],\quad \vec d=[1,1,0]`),
       step("Find the height","The cross product gives the area of the parallelogram. Divide by the base length for the perpendicular distance.",String.raw`\overrightarrow{AP}\times\vec d=[-3,3,1],\quad d=\frac{\sqrt{19}}{\sqrt2}=\frac{\sqrt{38}}{2}`),
       step("Find the foot parameter","The remaining displacement must have zero dot product with the line direction.",String.raw`(\overrightarrow{AP}-t\vec d)\cdot\vec d=1-2t=0\Rightarrow t=\frac12`),
       step("Verify the foot","Substitute t in the line and test the connector's dot product.",String.raw`H=[\tfrac32,${fraction(2*p+1,2)},0],\quad[\tfrac12,-\tfrac12,3]\cdot[1,1,0]=0`)],
      ["Obtains the correct starting-point displacement","Uses the cross-product area method and gives the exact distance","Finds the perpendicular-foot parameter","Gives H and verifies perpendicularity"],["A","T","C"],test),
    written(prefix+"w3",parts(`Consider the point ${inline(`P(${p},1,4)`)} and the plane ${inline(String.raw`\Pi:x+2y+2z=4`)}.`,
      "Identify a normal vector and find the exact distance.",
      "Find the nearest point H on the plane.",
      "Check that H lies on the plane and that the connector follows the normal."),
      `The normal is ${inline("[1,2,2]")} with magnitude three. The residual is ${inline(String(a))}, giving ${inline(`d=${fraction(a,3)}`)}. The foot is ${inline(`H(${fraction(9*p-a,9)},${fraction(9-2*a,9)},${fraction(36-2*a,9)})`)}. Substitution gives four, and ${inline(String.raw`P-H=\frac{${a}}9[1,2,2]`)}.`,
      [step("Residual and normal","Evaluate the Cartesian expression at P.",String.raw`r=${p}+2+8-4=${a},\quad\|\vec n\|=\sqrt{1+4+4}=3`),step("Distance","Take the absolute scalar residual over normal magnitude.",String.raw`d=\frac{${a}}3=${fraction(a,3)}`),step("Nearest point","Subtract the required normal displacement.",String.raw`H=[${p},1,4]-\frac{${a}}9[1,2,2]`),step("Verify","The point lies on the plane and the connector is normal to it.",String.raw`x_H+2y_H+2z_H=4,\quad P-H=\frac{${a}}9\vec n`)],
      ["Identifies the normal and evaluates the residual","Obtains the exact distance","Computes the perpendicular foot","Verifies membership and perpendicularity"],["A","C"],test),
    written(prefix+"w4",parts(`Find the shortest distance between these lines:
${inline(String.raw`L_1:\vec r=[-1,0,1]+s[1,-1,1]`)}
${inline(String.raw`L_2:\vec r=[0,${p+2},1]+t[2,1,1]`)}`,
      "Find a vector perpendicular to both directions.",
      "Write two parallel planes with that normal, one containing each line.",
      "Find the exact separation and explain how it establishes the line relationship."),
      `A common normal is ${inline("[-2,1,3]")}. Using the lines' starting points gives the auxiliary planes ${inline("-2x+y+3z=5")} and ${inline(`-2x+y+3z=${p+5}`)}. Their separation is ${inline(String.raw`\frac{${p}}{\sqrt{14}}`)}, the shortest distance between the lines. The lines are skew because their directions are nonparallel but their planes are distinct and parallel.`,
      [step("Find the common normal","Take the cross product of the two directions.",String.raw`[1,-1,1]\times[2,1,1]=[-2,1,3]`),
       step("Build the parallel planes","Use the same normal coefficients in both equations. Each line's starting point gives its plane's constant.",String.raw`\Pi_1:-2x+y+3z=5,\qquad \Pi_2:-2x+y+3z=${p+5}`),
       step("Find the separation","Along the common normal, the first line projects into the second plane. Its direction is still nonparallel to the second line, so the two lines in that plane meet. This makes the plane separation the shortest distance.",String.raw`d=\frac{|${p+5}-5|}{\sqrt{(-2)^2+1^2+3^2}}=\frac{${p}}{\sqrt{14}}`),
       step("Classify the lines","Their cross product is nonzero, so the lines are not parallel. They lie in distinct parallel planes, so they cannot intersect.")],
      ["Obtains a nonzero common normal","Constructs a correct parallel plane containing each line","Finds the exact shortest distance with justification","Justifies that the lines are skew"],["A","T","C"],test)
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

const testOrder: Record<string, readonly string[]> = {
  "8-1": ["1","7","2","8","4","3","6","5","w1","w2","w3","w4"],
  "8-2": ["1","4","6","7","5","2","3","8","w4","w1","w2","w3"],
  "9-1": ["7","4","1","2","3","5","8","6","w1","w2","w3","w4"],
  "9-2": ["3","6","2","1","7","5","8","4","w3","w1","w2","w4"],
};

// These closing questions ask students to choose and combine methods they
// already practised, with the same mark allocation as the rest of Part B.
const testSynthesis = [
  written("t-81-w4", parts(String.raw`The lines are \(L:\vec r=[3,0,1]+t[1,2,-1]\) and \(M:\vec r=[6,6,h]+u[-2,-4,k]\), where h and k are real.`,
    "Find the value of k for which the directions are parallel.",
    "For this value of k, determine which h makes the lines coincident. State what happens for every other h.",
    "For k other than 2, show whether the lines meet or are skew."),
    String.raw`The directions are parallel only when \(k=2\), since the first two components force a multiplier of \(-2\). The anchor of M can be on L only at \(t=3\), where L gives \((6,6,-2)\). Thus when \(k=2\) the lines coincide if \(h=-2\) and are distinct parallel lines otherwise. For \(k\ne2\), the x and y equations both give \(t=3-2u\); the z equation then gives \((2-k)u=h+2\). This has exactly one solution for every h, so the lines intersect.`,
    [
      step("Compare directions", "Read the multiplier from the x component, then apply it to the other components.", String.raw`-2[1,2,-1]=[-2,-4,2]\Rightarrow k=2`),
      step("Test the anchor", "The x-coordinate of the starting point of M fixes the only possible value of t. Check y as well as z.", String.raw`3+t=6\Rightarrow t=3,\qquad L(3)=(6,6,-2)`),
      step("Classify", "With the same direction, a shared point means the lines coincide. A different anchor height means the parallel lines are distinct."),
      step("Check nonparallel directions", "The x and y equations are equivalent. With the resulting relation between parameters, the z equation determines one value of u when k is not 2.", String.raw`t=3-2u,\qquad 1-(3-2u)=h+ku\Rightarrow u=\frac{h+2}{2-k}`),
    ],
    ["Uses proportional components to obtain k = 2", "Checks the full anchor and obtains h = −2", "Classifies both cases when the directions are parallel", "Uses the coordinate equations to show that there is one intersection for k not equal to 2"], ["T","C"], true),
  written("t-82-w3", parts(String.raw`The planes are \(x+y+z=6\) and \(kx+z=3\). The cosine of the smaller angle between them is \(3/\sqrt{15}\).`,
    "Write a normal vector for each plane.",
    "Find every real value of k. Show the equation used to obtain your solutions.",
    "Check both solutions using the smaller-angle formula."),
    String.raw`Use the normals \([1,1,1]\) and \([k,0,1]\). The angle condition is \(\frac{|k+1|}{\sqrt3\sqrt{k^2+1}}=\frac3{\sqrt{15}}\). Squaring gives \(5(k+1)^2=9(k^2+1)\), or \((2k-1)(k-2)=0\). Thus \(k=\frac12\) or \(k=2\). For these values the second normal can be scaled to \([1,0,2]\) or \([2,0,1]\). Both give dot product 3 and normal magnitude \(\sqrt5\), so both satisfy the original angle condition.`,
    [
      step("Read the normals", "The missing y term contributes a zero. Both normals are nonzero for every k.", String.raw`\vec n_1=[1,1,1],\qquad\vec n_2=[k,0,1]`),
      step("Set up the angle condition", "Use the absolute dot product to find the smaller angle.", String.raw`\frac{|k+1|}{\sqrt3\sqrt{k^2+1}}=\frac3{\sqrt{15}}\Rightarrow 5(k+1)^2=9(k^2+1)`),
      step("Solve for k", "Collect terms and factor.", String.raw`4k^2-10k+4=2(2k-1)(k-2)=0\Rightarrow k=\frac12\ \text{or}\ k=2`),
      step("Check both roots", "For k = 1/2 double the second normal. Both resulting normals give the same dot product and magnitude.", String.raw`[1,1,1]\cdot[1,0,2]=[1,1,1]\cdot[2,0,1]=3,\qquad\|[1,0,2]\|=\|[2,0,1]\|=\sqrt5`),
    ],
    ["Identifies both normals", "Sets up and simplifies the correct smaller-angle equation", "Finds both exact values of k", "Checks both values in the original angle condition"], ["K","A","C"], true),
  written("t-91-w4", parts(String.raw`The planes are \(x+y+z=7\), \(x-2y+z=4\) and \(x+2y+kz=c\), where k and c are real constants.`,
    "Find the line shared by the first two planes.",
    "Determine when the three planes share a point, a line, or no points.",
    "Give the common point or line in each case where it exists."),
    String.raw`The first two planes give \(y=1\) and \(x+z=6\), hence \(\vec r=[6,1,0]+t[-1,0,1]\). On this line the third equation is \((k-1)t=c-8\). For \(k\ne1\) there is one common point, \(\left(6-\frac{c-8}{k-1},1,\frac{c-8}{k-1}\right)\). For \(k=1,\ c=8\) every point on the line satisfies the third plane. For \(k=1,\ c\ne8\) no point satisfies all three equations.`,
    [
      step("Find the intersection line", "Subtract the first two equations and use z as the free variable.", String.raw`3y=3\Rightarrow y=1,\quad x+z=6,\quad\vec r=[6,1,0]+t[-1,0,1]`),
      step("Apply the third equation", "Substitute the coordinates of a general point on the line.", String.raw`6-t+2+kt=c\Rightarrow(k-1)t=c-8`),
      step("Nonzero coefficient", "When k is not 1 there is one parameter value; substitute it into the line to get the point.", String.raw`t=\frac{c-8}{k-1},\qquad (x,y,z)=\left(6-\frac{c-8}{k-1},1,\frac{c-8}{k-1}\right)`),
      step("Zero coefficient", "At k = 1 the third equation is true for the whole line when c = 8. Otherwise it is false for every point on the line.", String.raw`k=1\Rightarrow 0=c-8`),
    ],
    ["Uses the first two equations to obtain and parameterize the line", "Substitutes into the third equation and obtains the unique point when k is not 1", "Identifies the line when k = 1 and c = 8", "Identifies the empty set when k = 1 and c is not 8"], ["A","T","C"], true),
  written("t-92-w4", parts(String.raw`The skew lines are \(L_1:\vec r=[-1,0,1]+s[1,-1,1]\) and \(L_2:\vec r=[-3,-2,5]+t[2,1,1]\).`,
    "Find points P on the first line and Q on the second line such that PQ is perpendicular to both lines.",
    "Find the exact length of PQ.",
    "Construct a pair of parallel planes, one through each line, and use their separation to verify your distance."),
    String.raw`For \(P=L_1(s)\) and \(Q=L_2(t)\), requiring \(Q-P\) to be perpendicular to both directions gives \(4+2t-3s=0\) and \(-2+6t-2s=0\). These yield \(s=2\) and \(t=1\), so \(P=(1,-2,3)\), \(Q=(-1,-1,6)\), and \(Q-P=[-2,1,3]\). This vector has length \(\sqrt{14}\) and is also a common normal. The parallel planes are \(-2x+y+3z=5\) and \(-2x+y+3z=19\), with separation \(14/\sqrt{14}=\sqrt{14}\).`,
    [
      step("Set up the two conditions", "Use one parameter per line and form the connector from P to Q.", String.raw`Q-P=[-2+2t-s,-2+t+s,4+t-s]`),
      step("Find the closest points", "Set its dot products with both directions to zero, then solve the two equations.", String.raw`4+2t-3s=0,\qquad-2+6t-2s=0\Rightarrow s=2,\ t=1`),
      step("Measure the connector", "Substitute the parameters and check that the connector is the cross product of the two directions.", String.raw`P=(1,-2,3),\quad Q=(-1,-1,6),\quad Q-P=[-2,1,3]=[1,-1,1]\times[2,1,1],\quad PQ=\sqrt{14}`),
      step("Verify using planes", "Each line lies in a plane with this common normal. All connectors span at least the distance between those planes, which this normal connector attains.", String.raw`-2x+y+3z=5,\quad-2x+y+3z=19,\qquad d=\frac{|19-5|}{\sqrt{14}}=\sqrt{14}`),
    ],
    ["Forms the connector and both perpendicularity equations", "Finds both parameters and both endpoints", "Obtains the exact length of the connector", "Constructs both auxiliary planes and verifies the shortest distance"], ["A","T","C"], true),
];

const synthesisById = new Map(testSynthesis.map((question) => [question.id, question]));

function orderTest(slug: string, questions: AssessmentQuestion[]): AssessmentQuestion[] {
  const prefix = `t-${slug.replace("-", "")}-`;
  return testOrder[slug].map((suffix) => {
    const id = prefix + suffix;
    const question = synthesisById.get(id) ?? questions.find((item) => item.id === id);
    if (!question) throw new Error(`Missing question ${id}`);
    return question;
  });
}

function bank(test:boolean):Assessment[]{
  return specifications.map(({number,slug,title,coverage,make})=>({
    id:`${test?"test":"quiz"}-unit-${slug}`, number, title,
    description:`${coverage}.`,
    mode:test?"exam":"quiz",kind:test?"test":"quiz",timeLimit:test?"60 min":"35 min",instructions,
    questions:test ? orderTest(slug, make(3, true)) : make(1, false),
  }));
}
export const unitQuizzes:Assessment[]=bank(false);
export const unitTests:Assessment[]=bank(true);
