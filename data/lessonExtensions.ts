import type { SolutionStep } from "./linesAndPlanesData";

export type LessonExtension = {
  derivation?: SolutionStep[];
  extraExamples?: Array<{
    title: string;
    prompt: string;
    steps: SolutionStep[];
    conclusion: string;
  }>;
};

const step = (label: string, text: string, math?: string): SolutionStep => ({
  label,
  text,
  ...(math ? { math: `\\[${math}\\]` } : {}),
});

// Additional class methods are kept separate so lessons can reveal them when needed.
export const lessonExtensions: Record<string, LessonExtension> = {
  "8.1": {
    derivation: [
      step("Start with a line and a known point", "Let P₀ be a known point on L, and let m be a nonzero vector parallel to L. Choose any other point P on L.", String.raw`\vec r_0=\overrightarrow{OP_0},\qquad\vec r=\overrightarrow{OP},\qquad\vec m\parallel L,\quad\vec m\ne\vec0`),
      step("Follow the position-vector triangle", "Going directly from O to P is the same displacement as going from O to P₀, then from P₀ to P.", String.raw`\overrightarrow{OP}=\overrightarrow{OP_0}+\overrightarrow{P_0P}\quad\Rightarrow\quad\vec r=\vec r_0+\overrightarrow{P_0P}`),
      step("Write the movement along the line", "The displacement P₀P is parallel to m, so it is a scalar multiple of m. The multiplier may be positive, zero or negative.", String.raw`\overrightarrow{P_0P}=t\vec m`),
      step("Substitute and read the coordinates", "Let t range over all real numbers to reach the whole line. One t produces both coordinates.", String.raw`\vec r=\vec r_0+t\vec m=[x_0,y_0]+t[a,b],\quad x=x_0+at,\quad y=y_0+bt,\quad t\in\mathbb R`),
    ],
    extraExamples: [
      {
        title: "Infinitely many equations for one line",
        prompt: "Use A(1,4) and B(3,1) to write several vector equations of the same line.",
        steps: [
          step("Find a direction", "Subtract the starting point from the ending point.", String.raw`\overrightarrow{AB}=[3-1,1-4]=[2,-3]`),
          step("Start at either known point", "A and B both lie on the line. Either can supply the starting position.", String.raw`\vec r=[1,4]+t[2,-3]\qquad\text{or}\qquad\vec r=[3,1]+u[2,-3]`),
          step("Reverse or scale the direction", "A line extends in both directions. Any nonzero scalar multiple preserves its direction, though the parameter reaching a point may change.", String.raw`\vec r=[1,4]+v[-2,3]\qquad\text{or}\qquad\vec r=[1,4]+w[4,-6]`),
          step("State the general rule", "Choose any starting point on the line and any nonzero multiple of its direction. These choices produce infinitely many representations of one geometric line.", String.raw`\vec r=\bigl([1,4]+a[2,-3]\bigr)+s\bigl(k[2,-3]\bigr),\quad a,s\in\mathbb R,\quad k\ne0`),
        ],
        conclusion: "Equivalent line equations must have parallel directions and a shared point. Different parameter values or starting points do not automatically mean different lines.",
      },
      {
        title: "A point that fails the shared-parameter check",
        prompt: "Determine whether Q(2,3) lies on r=[1,4]+t[2,-3].",
        steps: [
          step("Read the coordinates", "The same t must give the required x and y together.", String.raw`x=1+2t,\qquad y=4-3t`),
          step("Use x", "Set x equal to 2 and solve.", String.raw`2=1+2t\quad\Rightarrow\quad t=\frac12`),
          step("Check y", "The required y gives a different value of t.", String.raw`3=4-3t\quad\Rightarrow\quad t=\frac13\ne\frac12`),
        ],
        conclusion: "Q is not on the line. Matching each coordinate at a different parameter value does not establish point membership.",
      },
    ],
  },
  "8.2": {
    derivation: [
      step("Choose a normal and a known point", "Let n=[A,B] be a nonzero normal, and let P₀(x₀,y₀) lie on the line. A displacement along the line is perpendicular to n.", String.raw`\overrightarrow{P_0P}=[x-x_0,y-y_0],\qquad\vec n\cdot\overrightarrow{P_0P}=0`),
      step("Expand the dot product", "Each normal component multiplies its corresponding coordinate displacement.", String.raw`A(x-x_0)+B(y-y_0)=0`),
      step("Collect the constants", "Define C from the known point. A and B cannot both be zero.", String.raw`Ax+By+C=0,\qquad C=-Ax_0-By_0,\qquad[A,B]\ne[0,0]`),
    ],
    extraExamples: [
      {
        title: "Vector to parametric, symmetric and Cartesian forms",
        prompt: "Convert r=[2,-1]+t[3,2] into the other line forms in R².",
        steps: [
          step("Read the components", "Use the same real parameter in both coordinate equations.", String.raw`x=2+3t,\qquad y=-1+2t`),
          step("Make t the subject", "Both direction components are nonzero, so both divisions are defined.", String.raw`t=\frac{x-2}{3}=\frac{y+1}{2}`),
          step("Eliminate the parameter", "Cross-multiply the symmetric equation, then expand and collect terms.", String.raw`2(x-2)=3(y+1)\quad\Rightarrow\quad2x-3y-7=0`),
          step("Check direction and location", "The Cartesian coefficients give a normal perpendicular to the original direction, and the starting point satisfies the equation.", String.raw`[2,-3]\cdot[3,2]=0,\qquad2(2)-3(-1)-7=0`),
        ],
        conclusion: "All four forms describe the same set of points. To reverse a symmetric conversion, set the common fraction equal to one parameter and rearrange each coordinate equation.",
      },
      {
        title: "Coincident or distinct parallel lines",
        prompt: "Compare L₁: 3x-4y-6=0 with L₂: 6x-8y+12=0.",
        steps: [
          step("Compare the normals", "The second normal is twice the first, so the lines have parallel directions.", String.raw`\vec n_2=[6,-8]=2[3,-4]=2\vec n_1`),
          step("Test a point", "Set y=0 in L₁ to obtain P(2,0), then substitute into L₂.", String.raw`3x-6=0\Rightarrow x=2,\qquad6(2)-8(0)+12=24\ne0`),
          step("Compare the complete equations", "Doubling L₁ would give a constant of -12, not +12.", String.raw`2L_1:\quad6x-8y-12=0`),
        ],
        conclusion: "The lines are distinct and parallel. In this comparison, distinct means different lines. Parallel directions alone do not prove that the lines coincide.",
      },
      {
        title: "Exact magnitudes before the angle approximation",
        prompt: "Find the smaller angle between lines with directions [-1,3] and [3,4].",
        steps: [
          step("Calculate the dot product and magnitudes", "Keep the radical exact rather than substituting a rounded magnitude.", String.raw`[-1,3]\cdot[3,4]=9,\quad\|[-1,3]\|=\sqrt{10},\quad\|[3,4]\|=5`),
          step("Use the smaller-angle formula", "The absolute dot product selects the angle from 0° to 90°.", String.raw`\theta=\cos^{-1}\!\left(\frac9{5\sqrt{10}}\right)\approx55.3^\circ`),
        ],
        conclusion: "The smaller angle is approximately 55.3°. Use degree mode for the final inverse-cosine calculation.",
      },
    ],
  },
  "8.3": {
    derivation: [
      step("Extend the point and direction rule", "Adding a z-coordinate adds one component, but a line still has only one independent direction.", String.raw`\vec r=[x_0,y_0,z_0]+t[a,b,c],\qquad[a,b,c]\ne[0,0,0]`),
      step("Read the three coordinate equations", "One parameter produces one point in space.", String.raw`x=x_0+at,\qquad y=y_0+bt,\qquad z=z_0+ct`),
      step("Equate expressions for t", "Use only nonzero direction components as denominators. Retain any fixed coordinates as separate equations.", String.raw`\frac{x-x_0}{a}=\frac{y-y_0}{b}=\frac{z-z_0}{c}\qquad(abc\ne0)`),
    ],
    extraExamples: [
      {
        title: "A fixed coordinate in symmetric form",
        prompt: "Write vector, parametric and symmetric equations through P(-2,3,5) and Q(-2,4,-1).",
        steps: [
          step("Find a direction", "The identical x-coordinates give a zero x-component.", String.raw`\overrightarrow{PQ}=[0,1,-6]`),
          step("Write vector and parametric forms", "Start at P and use a single parameter.", String.raw`\vec r=[-2,3,5]+t[0,1,-6],\quad x=-2,\quad y=3+t,\quad z=5-6t`),
          step("Keep the fixed coordinate", "Only y and z can be solved for t by division.", String.raw`x=-2,\qquad\frac{y-3}{1}=\frac{z-5}{-6}`),
          step("Verify Q", "At t=1 all three coordinates agree with Q.", String.raw`[-2,3,5]+[0,1,-6]=[-2,4,-1]`),
        ],
        conclusion: "A zero direction component fixes that coordinate. If two components are zero, keep two fixed-coordinate equations and let the remaining coordinate vary.",
      },
      {
        title: "Converting symmetric form back to vector form",
        prompt: "Convert (x-1)/2=(y-3)/(-5)=(z-6)/4 into parametric and vector forms.",
        steps: [
          step("Name the common value", "Set every fraction equal to the same parameter t.", String.raw`\frac{x-1}{2}=t,\qquad\frac{y-3}{-5}=t,\qquad\frac{z-6}{4}=t`),
          step("Rearrange each equation", "Multiply by each direction component and add the starting coordinate.", String.raw`x=1+2t,\qquad y=3-5t,\qquad z=6+4t`),
          step("Group constants and parameter coefficients", "Read a starting position and a direction from the coordinate equations.", String.raw`\vec r=[1,3,6]+t[2,-5,4]`),
        ],
        conclusion: "All three representations describe the same line. A single nondegenerate linear Cartesian equation in R³ would describe a plane, so a Cartesian description of a line requires two independent plane conditions together.",
      },
    ],
  },
  "8.4": {
    derivation: [
      step("Locate a known point", "Let A lie on the plane and let a and b be two nonparallel directions within it. A general point P is reached from A by two independent movements.", String.raw`\overrightarrow{OP}=\overrightarrow{OA}+\overrightarrow{AP}`),
      step("Describe both movements", "The real parameters s and t vary independently. Parallel directions would provide only one independent movement.", String.raw`\overrightarrow{AP}=s\vec a+t\vec b,\qquad\vec a\times\vec b\ne\vec0`),
      step("Substitute and read components", "The starting position fixes the plane's location. Two independent directions cover its surface.", String.raw`\vec r=\vec r_0+s\vec a+t\vec b,\quad x=x_0+sa_1+tb_1,\quad y=y_0+sa_2+tb_2,\quad z=z_0+sa_3+tb_3`),
    ],
    extraExamples: [
      {
        title: "Two intersecting lines",
        prompt: "Find a plane containing r=[2,-1,1]+s[1,2,0] and r=[2,-1,1]+t[0,1,3].",
        steps: [
          step("Identify their common point", "Both lines pass through A(2,-1,1) when their parameters equal zero."),
          step("Use the two directions", "The line directions are not parallel, so they are independent spans.", String.raw`[1,2,0]\times[0,1,3]=[6,-3,1]\ne\vec0`),
          step("Write vector and parametric forms", "Use new independent parameters u and v for the plane.", String.raw`\vec r=[2,-1,1]+u[1,2,0]+v[0,1,3],\quad x=2+u,\ y=-1+2u+v,\ z=1+3v`),
        ],
        conclusion: "Setting v=0 recovers the first line. Setting u=0 recovers the second line, so the entire pair lies in this plane.",
      },
      {
        title: "Two distinct parallel lines",
        prompt: "Find a plane containing r=[1,0,2]+u[1,1,0] and r=[1,1,3]+v[1,1,0].",
        steps: [
          step("Keep the common direction", "Both lines have direction [1,1,0]. A second copy of it would add no new movement."),
          step("Join points on different lines", "Use the connector from A(1,0,2) to C(1,1,3), which is not parallel to the line direction.", String.raw`\overrightarrow{AC}=[0,1,1]\not\parallel[1,1,0]`),
          step("Write the plane", "The common direction and connector provide two independent spans.", String.raw`\vec r=[1,0,2]+s[1,1,0]+t[0,1,1]`),
          step("Check both lines", "At t=0 the plane equation gives the first line. At t=1 it gives the second line, with s as its free line parameter."),
        ],
        conclusion: "Distinct parallel lines determine one plane. Coincident lines would supply only one independent direction and would not determine a unique plane.",
      },
      {
        title: "A line and an external point",
        prompt: "Find a plane containing r=[1,2,0]+s[2,0,1] and Q(0,3,2).",
        steps: [
          step("Find a connector", "Use A(1,2,0) on the line. Q has y=3 while every line point has y=2, so Q is outside the line.", String.raw`\overrightarrow{AQ}=[-1,1,2]`),
          step("Write the plane", "Use the line direction and the connector as independent spans.", String.raw`\vec r=[1,2,0]+u[2,0,1]+v[-1,1,2]`),
          step("Read and verify the coordinates", "The pair (0,1) reaches Q. Setting v=0 recovers the whole original line.", String.raw`x=1+2u-v,\qquad y=2+v,\qquad z=u+2v`),
        ],
        conclusion: "The external-point condition supplies the second independent direction. A point already on the line would not determine a unique plane with it.",
      },
    ],
  },
  "8.5": {
    derivation: [
      step("Use perpendicularity", "Let n=[A,B,C] be a nonzero normal and let P₀(x₀,y₀,z₀) lie on the plane. Every displacement from P₀ to a point P on the plane is perpendicular to n.", String.raw`\vec n\cdot(\vec r-\vec r_0)=0`),
      step("Expand the components", "Multiply matching normal and displacement components.", String.raw`A(x-x_0)+B(y-y_0)+C(z-z_0)=0`),
      step("Collect constants", "The coefficients record the normal and D fixes the plane's position.", String.raw`Ax+By+Cz+D=0,\qquad D=-Ax_0-By_0-Cz_0`),
    ],
    extraExamples: [
      {
        title: "Directly from a point and a normal",
        prompt: "Find a Cartesian equation through A(2,-1,3) with normal [1,2,-1].",
        steps: [
          step("Use point-normal form", "Subtract the known point from the general point, keeping the signs in brackets.", String.raw`[1,2,-1]\cdot[x-2,y+1,z-3]=0`),
          step("Expand and simplify", "Collect the variable terms and constants.", String.raw`(x-2)+2(y+1)-(z-3)=0\quad\Rightarrow\quad x+2y-z+3=0`),
          step("Verify the point", "Substitute the original coordinates.", String.raw`2+2(-1)-3+3=0`),
        ],
        conclusion: "The equation has the required normal and contains A. No cross product is needed when the normal is already supplied.",
      },
      {
        title: "Eliminating both plane parameters",
        prompt: "Convert x=1+s, y=s+t, z=2+t directly into Cartesian form.",
        steps: [
          step("Isolate both parameters", "The x- and z-equations give separate expressions for s and t.", String.raw`s=x-1,\qquad t=z-2`),
          step("Substitute into the remaining coordinate", "Replace both parameters in the y-equation.", String.raw`y=(x-1)+(z-2)`),
          step("Rearrange", "The remaining coordinate relationship is Cartesian form.", String.raw`x-y+z=3`),
        ],
        conclusion: "Elimination and the cross-product method produce the same plane equation. Two independent parameters are removed together.",
      },
      {
        title: "Normals, constants and the smaller angle",
        prompt: "Compare Π₁: x+2y-z=4 and Π₂: -2x-4y+2z=-8. Then find the smaller angle between x+y+z=2 and x+z=1.",
        steps: [
          step("Compare complete equations", "Every coefficient and the right side of Π₁ is multiplied by -2, so Π₂ is the same plane.", String.raw`[-2,-4,2]=-2[1,2,-1],\qquad-8=-2(4)`),
          step("Distinguish a parallel plane", "With the same left side but right side +8 instead, the planes would be distinct and parallel."),
          step("Read the angle normals", "The missing y term gives a zero y-component in the second normal.", String.raw`\vec n_1=[1,1,1],\qquad\vec n_2=[1,0,1]`),
          step("Keep the exact ratio", "Use the absolute dot product and exact magnitudes before the inverse-cosine approximation.", String.raw`\theta=\cos^{-1}\!\left(\frac2{\sqrt3\sqrt2}\right)=\cos^{-1}\!\left(\frac2{\sqrt6}\right)\approx35.3^\circ`),
        ],
        conclusion: "Parallel normals need a constant check for coincidence. Perpendicular normals have dot product zero. The smaller plane angle equals the smaller angle between the normals.",
      },
    ],
  },
  "8.6": {
    derivation: [
      step("Draw labelled coordinate axes", "Choose and label the positive x-, y- and z-directions. The slanted axes in a sketch represent three-dimensional space."),
      step("Locate a point in coordinate order", "Move along x, then parallel to y, then parallel to z. Retain light construction lines to show the coordinate displacements.", String.raw`(0,0,0)\longrightarrow(x,0,0)\longrightarrow(x,y,0)\longrightarrow(x,y,z)`),
      step("Choose a plane-sketch method", "Use three non-collinear intercepts when available. Otherwise find coordinate-plane traces or two independent spans. Label key points and show that the plane continues beyond the drawn patch."),
    ],
    extraExamples: [
      {
        title: "Plotting positive and negative coordinates",
        prompt: "Plot P(2,-1,3), then identify the projection of R(-1,2,-2) onto the xy-plane.",
        steps: [
          step("Move along x and y", "For P, move 2 along positive x, then 1 parallel to negative y.", String.raw`O(0,0,0)\longrightarrow(2,0,0)\longrightarrow(2,-1,0)`),
          step("Move vertically", "Move 3 along positive z to reach P.", String.raw`(2,-1,0)\longrightarrow P(2,-1,3)`),
          step("Project R", "A projection onto the xy-plane retains x and y and sets z to zero.", String.raw`R(-1,2,-2)\longrightarrow H(-1,2,0)`),
        ],
        conclusion: "P lies above the xy-plane because z=3. R lies below it because z=-2. The projection H lies in z=0.",
      },
      {
        title: "The three coordinate-plane traces",
        prompt: "Find the traces of 2x+3y+6z=6 and use them to support a sketch.",
        steps: [
          step("Trace in the xy-plane", "Set only z to zero. The resulting line joins the x- and y-intercepts.", String.raw`z=0:\quad2x+3y=6`),
          step("Trace in the xz-plane", "Set only y to zero.", String.raw`y=0:\quad2x+6z=6`),
          step("Trace in the yz-plane", "Set only x to zero.", String.raw`x=0:\quad3y+6z=6`),
        ],
        conclusion: "An axis intercept sets two coordinates to zero. A coordinate-plane trace sets one coordinate to zero and gives an entire line.",
      },
      {
        title: "A missed axis and a contained axis",
        prompt: "Explain the different relationships between the z-axis and the planes x+y=2 and x+y=0.",
        steps: [
          step("Test the z-axis in the first plane", "Every point of the z-axis has x=y=0. Substitution gives a contradiction.", String.raw`x+y=2:\quad0=2`),
          step("Test the z-axis in the second plane", "The same substitution now gives an identity for every z.", String.raw`x+y=0:\quad0=0`),
          step("Describe the sketches", "Sketch each trace in the xy-plane and extend it parallel to z. The first misses the z-axis; the second contains it."),
        ],
        conclusion: "A missing coefficient makes that coordinate free. Whether the corresponding axis lies in the plane depends on the remaining constant equation.",
      },
      {
        title: "A plane through the origin",
        prompt: "Sketch x+y+z=0 when all axis intercepts meet at O.",
        steps: [
          step("Find independent traces", "The xy-trace is y=-x. The xz-trace is z=-x.", String.raw`z=0:\ y=-x,\qquad y=0:\ z=-x`),
          step("Choose trace directions", "Both directions satisfy the equation and are not scalar multiples.", String.raw`\vec a=[1,-1,0],\qquad\vec b=[1,0,-1]`),
          step("Draw the patch through O", "Use the directions to show orientation and retain all axis labels.", String.raw`\vec r=s[1,-1,0]+t[1,0,-1]`),
        ],
        conclusion: "One collapsed intercept point cannot show the plane's orientation. Two independent trace directions provide the missing geometric information.",
      },
    ],
  },
};
