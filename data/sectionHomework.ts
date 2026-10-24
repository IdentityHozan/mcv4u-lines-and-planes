import type { HomeworkSet } from "./linesAndPlanesData";

// Original practice follows the supplied section sequence and class methods.
export const sectionHomeworkSets: HomeworkSet[] = [
  {
    id: "homework-8-1",
    number: "8.1",
    title: "Vector and parametric lines in R²",
    focus: "Build a line from a point and direction, generate points, and justify membership.",
    estimatedMinutes: 40,
    problems: [
      {
        title: "Build and interpret a vector equation",
        prompt: String.raw`A line passes through \(A(3,-2)\) and is parallel to \(\vec m=[2,5]\). Derive its vector equation, write parametric equations, and find the points for \(t=0,1,-1\).`,
        tags: ["K", "A", "C"],
        hint: "The displacement from A to any point of the line is a scalar multiple of m.",
        steps: [
          {
            label: "Derive the form",
            text: "A position vector reaches A first, then moves along the line.",
            math: String.raw`\[\vec r=\overrightarrow{OA}+\overrightarrow{AP}=[3,-2]+t[2,5],\quad t\in\mathbb R\]`
          },
          {
            label: "Read components",
            text: "Use the same parameter in both coordinates.",
            math: String.raw`\[x=3+2t,\qquad y=-2+5t\]`
          },
          {
            label: "Generate and check",
            text: "Substitute each parameter into both coordinates.",
            math: String.raw`\[t=0:(3,-2),\quad t=1:(5,3),\quad t=-1:(1,-7)\]`
          }
        ],
        answer: String.raw`\(\vec r=[3,-2]+t[2,5]\), with points \((3,-2),(5,3),(1,-7)\).`,
        id: "hw-8-1-p1"
      },
      {
        title: "A line through two points",
        prompt: String.raw`Find vector and parametric equations through \(P(-1,4)\) and \(Q(5,-2)\). Use a simplified integer direction and verify Q.`,
        tags: ["K", "A"],
        hint: "Subtract P from Q, then divide both direction components by a common nonzero factor.",
        steps: [
          {
            label: "Direction",
            text: "Subtract the starting point from the ending point.",
            math: String.raw`\[\overrightarrow{PQ}=[6,-6]=6[1,-1]\]`
          },
          {
            label: "Equations",
            text: "Anchor at P and use the simplified direction.",
            math: String.raw`\[\vec r=[-1,4]+t[1,-1],\quad x=-1+t,\quad y=4-t\]`
          },
          {
            label: "Verify Q",
            text: "The simplified direction needs six parameter steps to reach Q.",
            math: String.raw`\[t=6:\quad[-1,4]+6[1,-1]=[5,-2]\]`
          }
        ],
        answer: String.raw`\(\vec r=[-1,4]+t[1,-1]\), \(x=-1+t,\ y=4-t\). Q occurs at \(t=6\).`,
        id: "hw-8-1-p2"
      },
      {
        title: "Fractional coordinates and equivalent directions",
        prompt: String.raw`The line contains \(A(\tfrac12,-3)\) and \(B(\tfrac34,\tfrac12)\). Find an integer direction and a vector equation. Explain why scaling the direction preserves the line.`,
        tags: ["A", "T", "C"],
        hint: "Clear the denominators in the displacement vector, not in the starting point.",
        steps: [
          {
            label: "Subtract coordinates",
            text: "Keep the fractional differences exact.",
            math: String.raw`\[\overrightarrow{AB}=[\tfrac14,\tfrac72]\]`
          },
          {
            label: "Scale the direction",
            text: "Multiply both components by four.",
            math: String.raw`\[4\overrightarrow{AB}=[1,14],\quad\vec r=[\tfrac12,-3]+t[1,14]\]`
          },
          {
            label: "Check the same line",
            text: "Scaling changes the parameter assigned to B, while preserving the set of points.",
            math: String.raw`\[t=\tfrac14:\quad[\tfrac12,-3]+\tfrac14[1,14]=[\tfrac34,\tfrac12]\]`
          }
        ],
        answer: String.raw`Use \([1,14]\). Every nonzero multiple remains parallel, so the new equation describes the same line.`,
        id: "hw-8-1-p3"
      },
      {
        title: "One parameter for both coordinates",
        prompt: String.raw`For \(L:\vec r=[2,-1]+t[3,2]\), determine whether \(Q(8,3)\) and \(R(5,2)\) lie on L. Justify both decisions.`,
        tags: ["A", "T", "C"],
        hint: "Find t using x and check that value in y.",
        steps: [
          {
            label: "Test Q",
            text: "Its x-coordinate determines the candidate parameter.",
            math: String.raw`\[8=2+3t\Rightarrow t=2,\qquad -1+2(2)=3\]`
          },
          {
            label: "Test R",
            text: "The x-coordinate requires a different candidate.",
            math: String.raw`\[5=2+3t\Rightarrow t=1,\qquad -1+2(1)=1\ne2\]`
          },
          {
            label: "State the conclusion",
            text: "Membership requires one shared parameter, not separate choices for x and y.",
            math: String.raw`\[Q\in L,\qquad R\notin L\]`
          }
        ],
        answer: String.raw`Q lies on L at \(t=2\). R does not lie on L.`,
        id: "hw-8-1-p4"
      },
      {
        title: "Construct a perpendicular line",
        prompt: String.raw`Find a vector equation through \(P(6,5)\) perpendicular to \(L:\vec r=[4,1]+s[-3,2]\). Verify the perpendicularity.`,
        tags: ["A", "T"],
        hint: "In R², swap direction components and change one sign.",
        steps: [
          {
            label: "Choose a new direction",
            text: "A perpendicular direction must have zero dot product with the given direction.",
            math: String.raw`\[[-3,2]\cdot[a,b]=-3a+2b=0\]`
          },
          {
            label: "Select and verify",
            text: "A convenient nonzero solution is [2,3].",
            math: String.raw`\[[-3,2]\cdot[2,3]=-6+6=0\]`
          },
          {
            label: "Use the required point",
            text: "The point fixes the location of the new line.",
            math: String.raw`\[\vec r=[6,5]+t[2,3],\quad t\in\mathbb R\]`
          }
        ],
        answer: String.raw`\(\vec r=[6,5]+t[2,3]\). The directions are perpendicular because their dot product is zero.`,
        id: "hw-8-1-p5"
      }
    ]
  },
  {
    id: "homework-8-2",
    number: "8.2",
    title: "Cartesian equations and conversions in R²",
    focus: "Connect normals, directions, Cartesian equations, slope, and line relationships.",
    estimatedMinutes: 40,
    problems: [
      {
        title: "Cartesian to vector and parametric form",
        prompt: String.raw`Convert \(2x-3y+6=0\) to vector and parametric equations. Verify the result by substitution.`,
        tags: ["K", "A"],
        hint: "Read a normal from the coefficients, then choose a perpendicular direction.",
        steps: [
          {
            label: "Normal and direction",
            text: "The coefficients give a normal, not a line direction.",
            math: String.raw`\[\vec n=[2,-3],\quad\vec d=[3,2],\quad\vec n\cdot\vec d=0\]`
          },
          {
            label: "Anchor and equations",
            text: "Set x=0 to obtain a convenient point.",
            math: String.raw`\[P(0,2),\quad\vec r=[0,2]+t[3,2],\quad x=3t,\quad y=2+2t\]`
          },
          {
            label: "Verify all points",
            text: "The original equation becomes an identity for every real t.",
            math: String.raw`\[2(3t)-3(2+2t)+6=0\]`
          }
        ],
        answer: String.raw`\(\vec r=[0,2]+t[3,2]\), \(x=3t,\ y=2+2t\).`,
        id: "hw-8-2-p1"
      },
      {
        title: "Vector to symmetric and Cartesian form",
        prompt: String.raw`Convert \(\vec r=[2,-1]+t[3,2]\) to symmetric and Cartesian forms. Check the Cartesian normal.`,
        tags: ["A", "C"],
        hint: "First separate the coordinates and solve both for t.",
        steps: [
          {
            label: "Parametric form",
            text: "Read corresponding components.",
            math: String.raw`\[x=2+3t,\qquad y=-1+2t\]`
          },
          {
            label: "Eliminate t",
            text: "Both expressions equal one shared parameter.",
            math: String.raw`\[\frac{x-2}{3}=\frac{y+1}{2}\Rightarrow2(x-2)=3(y+1)\]`
          },
          {
            label: "Cartesian form and check",
            text: "Expand and verify perpendicularity.",
            math: String.raw`\[2x-3y-7=0,\qquad[2,-3]\cdot[3,2]=0\]`
          }
        ],
        answer: String.raw`Symmetric: \(\frac{x-2}{3}=\frac{y+1}{2}\). Cartesian: \(2x-3y-7=0\).`,
        id: "hw-8-2-p2"
      },
      {
        title: "A point and a normal",
        prompt: String.raw`Find the Cartesian equation through \(A(4,-2)\) with normal \([5,3]\). Then state one direction vector.`,
        tags: ["K", "A"],
        hint: "Use the normal as the x and y coefficients and solve for the constant.",
        steps: [
          {
            label: "Set up the equation",
            text: "The unknown constant determines the location.",
            math: String.raw`\[5x+3y+C=0\]`
          },
          {
            label: "Substitute A",
            text: "Use the given point to determine C.",
            math: String.raw`\[5(4)+3(-2)+C=0\Rightarrow C=-14\]`
          },
          {
            label: "Direction and check",
            text: "Choose a vector perpendicular to the normal.",
            math: String.raw`\[5x+3y-14=0,\quad\vec d=[3,-5],\quad[5,3]\cdot[3,-5]=0\]`
          }
        ],
        answer: String.raw`\(5x+3y-14=0\), with direction \([3,-5]\).`,
        id: "hw-8-2-p3"
      },
      {
        title: "Coincident or distinct parallel lines",
        prompt: String.raw`Compare \(L_1:3x-4y-6=0\) with \(L_2:6x-8y+12=0\) and \(L_3:6x-8y-12=0\). Justify both classifications.`,
        tags: ["T", "C"],
        hint: "Scale the complete equation, including the constant.",
        steps: [
          {
            label: "Compare normals",
            text: "Both other normals are twice the first.",
            math: String.raw`\[[6,-8]=2[3,-4]\]`
          },
          {
            label: "Check coincidence",
            text: "Twice the entire first equation agrees with L3.",
            math: String.raw`\[2L_1:\quad6x-8y-12=0\Rightarrow L_1=L_3\]`
          },
          {
            label: "Distinguish L2",
            text: "The variable coefficients match but the constants do not.",
            math: String.raw`\[L_2:\quad6x-8y=-12,\qquad L_1:\quad6x-8y=12\]`
          }
        ],
        answer: "L1 and L3 coincide. L1 and L2 are distinct parallel lines.",
        id: "hw-8-2-p4"
      },
      {
        title: "The acute angle between lines",
        prompt: String.raw`Find the acute angle between lines with directions \(\vec d_1=[-1,3]\) and \(\vec d_2=[3,4]\). Give the exact cosine ratio before approximating.`,
        tags: ["A", "C"],
        hint: "Use the absolute dot product to obtain the smaller line angle.",
        steps: [
          {
            label: "Dot product",
            text: "Multiply corresponding components and add.",
            math: String.raw`\[\vec d_1\cdot\vec d_2=(-1)(3)+3(4)=9\]`
          },
          {
            label: "Magnitudes",
            text: "Retain exact radical values.",
            math: String.raw`\[\|\vec d_1\|=\sqrt{10},\quad\|\vec d_2\|=5,\quad\cos\theta=\frac9{5\sqrt{10}}\]`
          },
          {
            label: "Angle",
            text: "Use inverse cosine in degree mode.",
            math: String.raw`\[\theta=\cos^{-1}\!\left(\frac9{5\sqrt{10}}\right)\approx55.3^\circ\]`
          }
        ],
        answer: String.raw`\(\theta\approx55.3^\circ\), with exact ratio \(\cos\theta=\frac9{5\sqrt{10}}\).`,
        id: "hw-8-2-p5"
      }
    ]
  },
  {
    id: "homework-8-3",
    number: "8.3",
    title: "Vector parametric and symmetric lines in R³",
    focus: "Use one shared parameter in three dimensions, including fixed coordinates and equivalent lines.",
    estimatedMinutes: 40,
    problems: [
      {
        title: "Two points with a fixed coordinate",
        prompt: String.raw`Find vector, parametric, and symmetric equations through \(A(1,2,-1)\) and \(B(5,2,5)\). Verify B using your simplified direction.`,
        tags: ["K", "A"],
        hint: "The equal y-coordinates produce a zero direction component.",
        steps: [
          {
            label: "Direction",
            text: "Subtract A from B and simplify.",
            math: String.raw`\[\overrightarrow{AB}=[4,0,6]=2[2,0,3]\]`
          },
          {
            label: "Vector and parametric forms",
            text: "Retain the fixed y-coordinate.",
            math: String.raw`\[\vec r=[1,2,-1]+t[2,0,3],\quad x=1+2t,\quad y=2,\quad z=-1+3t\]`
          },
          {
            label: "Symmetric form and verification",
            text: "Do not divide by the zero y-component.",
            math: String.raw`\[y=2,\quad\frac{x-1}{2}=\frac{z+1}{3},\qquad t=2\Rightarrow B(5,2,5)\]`
          }
        ],
        answer: String.raw`\(\vec r=[1,2,-1]+t[2,0,3]\), with \(y=2\) and \(\frac{x-1}{2}=\frac{z+1}{3}\).`,
        id: "hw-8-3-p1"
      },
      {
        title: "Reverse a symmetric representation",
        prompt: String.raw`Convert \(\frac{x+2}{3}=\frac{y-1}{-2}=\frac{z-4}{5}\) to vector and parametric forms. Identify its anchor and direction.`,
        tags: ["K", "A"],
        hint: "Give all three fractions the same parameter.",
        steps: [
          {
            label: "Introduce t",
            text: "The common value is the shared parameter.",
            math: String.raw`\[\frac{x+2}{3}=t,\quad\frac{y-1}{-2}=t,\quad\frac{z-4}{5}=t\]`
          },
          {
            label: "Rearrange coordinates",
            text: "Multiply by denominators and isolate each coordinate.",
            math: String.raw`\[x=-2+3t,\quad y=1-2t,\quad z=4+5t\]`
          },
          {
            label: "Group components",
            text: "Separate constant and parameter contributions.",
            math: String.raw`\[\vec r=[-2,1,4]+t[3,-2,5]\]`
          }
        ],
        answer: String.raw`Anchor \((-2,1,4)\), direction \([3,-2,5]\), and \(\vec r=[-2,1,4]+t[3,-2,5]\).`,
        id: "hw-8-3-p2"
      },
      {
        title: "Different equations for one line",
        prompt: String.raw`Show that \(L_1:\vec r=[-1,0,4]+s[-1,2,5]\) and \(L_2:\vec r=[4,-10,-21]+u[-2,4,10]\) describe the same line.`,
        tags: ["A", "T", "C"],
        hint: "Check parallel directions and one shared point separately.",
        steps: [
          {
            label: "Direction check",
            text: "The second direction is a nonzero multiple of the first.",
            math: String.raw`\[[-2,4,10]=2[-1,2,5]\]`
          },
          {
            label: "Point check",
            text: "Use one parameter in all three coordinates of L1.",
            math: String.raw`\[s=-5:\quad[-1,0,4]-5[-1,2,5]=[4,-10,-21]\]`
          },
          {
            label: "Conclusion",
            text: "Parallel directions and the shared anchor establish coincidence.",
            math: String.raw`\[L_1=L_2\]`
          }
        ],
        answer: "The equations describe the same geometric line. Their parameters and starting points differ.",
        id: "hw-8-3-p3"
      },
      {
        title: "Parallel directions are not enough",
        prompt: String.raw`Classify \(L_1:\vec r=[1,6,1]+t[-1,1,2]\) and \(L_2:\vec r=[-3,10,12]+u[\tfrac12,-\tfrac12,-1]\). Show a complete point check.`,
        tags: ["T", "C"],
        hint: "After matching x and y, verify z before deciding coincidence.",
        steps: [
          {
            label: "Compare directions",
            text: "The directions are parallel.",
            math: String.raw`\[[\tfrac12,-\tfrac12,-1]=-\tfrac12[-1,1,2]\]`
          },
          {
            label: "Test the second anchor",
            text: "Its x-coordinate requires t=4 in L1.",
            math: String.raw`\[1-t=-3\Rightarrow t=4,\quad y=6+4=10,\quad z=1+2(4)=9\]`
          },
          {
            label: "Conclude",
            text: "The z-coordinate fails, so the parallel lines share no point.",
            math: String.raw`\[[-3,10,9]\ne[-3,10,12]\Rightarrow\text{distinct parallel lines}\]`
          }
        ],
        answer: "The lines are distinct and parallel, because the second anchor is not on L1.",
        id: "hw-8-3-p4"
      },
      {
        title: "Two zero components and the zero vector",
        prompt: String.raw`Describe \(L:\vec r=[1,2,3]+t[0,0,4]\) without dividing by zero. Does \(P(1,2,-5)\) lie on L? Explain what changes if the direction is \([0,0,0]\).`,
        tags: ["K", "T", "C"],
        hint: "Two coordinates stay fixed, while the nonzero component allows the third to vary.",
        steps: [
          {
            label: "Read coordinates",
            text: "Only z depends on t.",
            math: String.raw`\[x=1,\quad y=2,\quad z=3+4t\]`
          },
          {
            label: "Test P",
            text: "The fixed coordinates agree and one value reaches the required z.",
            math: String.raw`\[-5=3+4t\Rightarrow t=-2\]`
          },
          {
            label: "Interpret the special cases",
            text: "The free z-coordinate describes a line parallel to the z-axis. A zero direction generates only one point.",
            math: String.raw`\[L:\ x=1,\ y=2,\ z\in\mathbb R;\qquad\vec r=[1,2,3]+t\vec0=[1,2,3]\]`
          }
        ],
        answer: String.raw`P lies on L at \(t=-2\). The zero direction would produce only \((1,2,3)\), not a line.`,
        id: "hw-8-3-p5"
      }
    ]
  },
  {
    id: "homework-8-4",
    number: "8.4",
    title: "Vector and parametric equations of a plane",
    focus: "Construct a plane from valid geometric information and verify independent directions.",
    estimatedMinutes: 40,
    problems: [
      {
        title: "A plane through three points",
        prompt: String.raw`Find vector and parametric equations through \(A(1,0,2)\), \(B(2,1,2)\), and \(C(1,1,3)\). Verify all three points.`,
        tags: ["K", "A"],
        hint: "Use AB and AC from the same starting point.",
        steps: [
          {
            label: "Build spans",
            text: "Subtract A from each other point.",
            math: String.raw`\[\vec a=\overrightarrow{AB}=[1,1,0],\quad\vec b=\overrightarrow{AC}=[0,1,1]\]`
          },
          {
            label: "Write equations",
            text: "The spans are not scalar multiples, so use two independent parameters.",
            math: String.raw`\[\vec r=[1,0,2]+s[1,1,0]+t[0,1,1],\quad x=1+s,\ y=s+t,\ z=2+t\]`
          },
          {
            label: "Verify points",
            text: "One parameter pair must work in all three coordinates.",
            math: String.raw`\[(s,t)=(0,0):A,\quad(1,0):B,\quad(0,1):C\]`
          }
        ],
        answer: String.raw`\(\vec r=[1,0,2]+s[1,1,0]+t[0,1,1]\), with \(s,t\in\mathbb R\).`,
        id: "hw-8-4-p1"
      },
      {
        title: "Two intersecting lines",
        prompt: String.raw`Find vector and parametric equations for the plane containing \(L_1:\vec r=[2,-1,1]+s[1,2,0]\) and \(L_2:\vec r=[2,-1,1]+t[0,1,3]\). Verify that each line lies in the plane.`,
        tags: ["A", "C"],
        hint: "The common starting point is the intersection, and the line directions supply the spans.",
        steps: [
          {
            label: "Check the data",
            text: "Both lines contain P and their directions are not parallel.",
            math: String.raw`\[P(2,-1,1),\quad\vec a=[1,2,0],\quad\vec b=[0,1,3]\]`
          },
          {
            label: "Construct the plane",
            text: "Use independent parameters u and v.",
            math: String.raw`\[\vec r=[2,-1,1]+u[1,2,0]+v[0,1,3],\quad x=2+u,\ y=-1+2u+v,\ z=1+3v\]`
          },
          {
            label: "Verify whole lines",
            text: "Fix one plane parameter at zero and vary the other.",
            math: String.raw`\[v=0\Rightarrow L_1,\qquad u=0\Rightarrow L_2\]`
          }
        ],
        answer: String.raw`\(\vec r=[2,-1,1]+u[1,2,0]+v[0,1,3]\).`,
        id: "hw-8-4-p2"
      },
      {
        title: "Two distinct parallel lines",
        prompt: String.raw`Find a plane containing \(L_1:\vec r=[1,0,2]+s[1,1,0]\) and \(L_2:\vec r=[1,1,3]+t[1,1,0]\). Explain where the second independent direction comes from.`,
        tags: ["A", "T", "C"],
        hint: "Use the shared line direction and a connector between the two anchors.",
        steps: [
          {
            label: "Connector",
            text: "Join A on L1 to B on L2.",
            math: String.raw`\[\overrightarrow{AB}=[1,1,3]-[1,0,2]=[0,1,1]\]`
          },
          {
            label: "Independence",
            text: "The connector is not parallel to the shared direction.",
            math: String.raw`\[[1,1,0]\times[0,1,1]=[1,-1,1]\ne\vec0\]`
          },
          {
            label: "Plane and checks",
            text: "The second parameter selects the parallel line, while the first moves along it.",
            math: String.raw`\[\vec r=[1,0,2]+u[1,1,0]+v[0,1,1];\quad v=0:L_1,\quad v=1:L_2\]`
          }
        ],
        answer: String.raw`The connector supplies the second span, giving \(\vec r=[1,0,2]+u[1,1,0]+v[0,1,1]\).`,
        id: "hw-8-4-p3"
      },
      {
        title: "A line and an external point",
        prompt: String.raw`Construct a plane containing \(L:\vec r=[1,2,0]+s[2,0,1]\) and \(Q(0,3,2)\). Give vector and parametric forms and verify both requirements.`,
        tags: ["A", "T"],
        hint: "Connect the line anchor A to Q.",
        steps: [
          {
            label: "Second span",
            text: "The connector has a nonzero y-component, unlike the line direction.",
            math: String.raw`\[\overrightarrow{AQ}=[-1,1,2]\not\parallel[2,0,1]\]`
          },
          {
            label: "Equations",
            text: "Use A and the two independent spans.",
            math: String.raw`\[\vec r=[1,2,0]+u[2,0,1]+v[-1,1,2],\quad x=1+2u-v,\ y=2+v,\ z=u+2v\]`
          },
          {
            label: "Verify",
            text: "The plane includes every point of L and also Q.",
            math: String.raw`\[v=0\Rightarrow L,\qquad(u,v)=(0,1)\Rightarrow Q\]`
          }
        ],
        answer: String.raw`\(\vec r=[1,2,0]+u[2,0,1]+v[-1,1,2]\).`,
        id: "hw-8-4-p4"
      },
      {
        title: "When three points fail to determine a unique plane",
        prompt: String.raw`Do \(A(0,1,0)\), \(B(2,1,1)\), and \(C(4,1,2)\) determine a unique plane? Justify and give two different planes containing all three points.`,
        tags: ["T", "C"],
        hint: "Check whether the connecting directions are scalar multiples.",
        steps: [
          {
            label: "Directions",
            text: "Subtract A from B and C.",
            math: String.raw`\[\overrightarrow{AB}=[2,0,1],\quad\overrightarrow{AC}=[4,0,2]=2\overrightarrow{AB}\]`
          },
          {
            label: "Interpret",
            text: "Only one independent direction is supplied, so the points are collinear.",
            math: String.raw`\[\overrightarrow{AB}\times\overrightarrow{AC}=\vec0\]`
          },
          {
            label: "Show non-uniqueness",
            text: "Both equations hold for every listed point but describe different planes.",
            math: String.raw`\[y=1,\qquad x-2z=0\]`
          }
        ],
        answer: String.raw`No unique plane is determined. Infinitely many planes contain the common line, including \(y=1\) and \(x-2z=0\).`,
        id: "hw-8-4-p5"
      }
    ]
  },
  {
    id: "homework-8-5",
    number: "8.5",
    title: "Cartesian equations and plane properties",
    focus: "Use normals, convert plane forms, and justify plane orientations and angles.",
    estimatedMinutes: 40,
    problems: [
      {
        title: "Vector to Cartesian using a cross product",
        prompt: String.raw`Convert \(\vec r=[1,0,2]+s[1,1,0]+t[0,1,1]\) to Cartesian form. Verify that the normal is perpendicular to both spans.`,
        tags: ["K", "A"],
        hint: "Cross the two independent directions, then use the anchor.",
        steps: [
          {
            label: "Normal",
            text: "Compute the cross product in a fixed order.",
            math: String.raw`\[\vec n=[1,1,0]\times[0,1,1]=[1,-1,1]\]`
          },
          {
            label: "Point-normal form",
            text: "Use A(1,0,2).",
            math: String.raw`\[[1,-1,1]\cdot[x-1,y,z-2]=0\Rightarrow x-y+z=3\]`
          },
          {
            label: "Verify the normal",
            text: "Both span dot products are zero.",
            math: String.raw`\[[1,-1,1]\cdot[1,1,0]=0,\qquad[1,-1,1]\cdot[0,1,1]=0\]`
          }
        ],
        answer: String.raw`\(x-y+z=3\), with normal \([1,-1,1]\).`,
        id: "hw-8-5-p1"
      },
      {
        title: "Cartesian back to vector and parametric form",
        prompt: String.raw`Convert \(2x+y-z=4\) to vector and parametric form using integer span vectors. Check that every generated point satisfies the Cartesian equation.`,
        tags: ["A", "C"],
        hint: "Let y and z be twice independent parameters to avoid fractional spans.",
        steps: [
          {
            label: "Choose free coordinates",
            text: "Solve for x after setting y=2s and z=2t.",
            math: String.raw`\[y=2s,\quad z=2t,\quad x=2-s+t\]`
          },
          {
            label: "Group components",
            text: "Separate constants and parameter contributions.",
            math: String.raw`\[\vec r=[2,0,0]+s[-1,2,0]+t[1,0,2]\]`
          },
          {
            label: "Verify",
            text: "Substitution reduces to the required identity.",
            math: String.raw`\[2(2-s+t)+2s-2t=4\]`
          }
        ],
        answer: String.raw`\(\vec r=[2,0,0]+s[-1,2,0]+t[1,0,2]\). Parametric: \(x=2-s+t,\ y=2s,\ z=2t\).`,
        id: "hw-8-5-p2"
      },
      {
        title: "Cartesian equation from a point and normal",
        prompt: String.raw`Find a Cartesian equation through \(A(2,-1,3)\) with normal \([1,2,-1]\). Verify A and identify why the normal must be nonzero.`,
        tags: ["K", "A", "C"],
        hint: "Dot the normal with the displacement from A to a general point.",
        steps: [
          {
            label: "Point-normal form",
            text: "Subtract A component by component.",
            math: String.raw`\[[1,2,-1]\cdot[x-2,y+1,z-3]=0\]`
          },
          {
            label: "Expand",
            text: "Keep signs inside brackets until multiplication is complete.",
            math: String.raw`\[(x-2)+2(y+1)-(z-3)=0\Rightarrow x+2y-z+3=0\]`
          },
          {
            label: "Check and interpret",
            text: "A satisfies the equation. A zero normal would give no plane orientation.",
            math: String.raw`\[2+2(-1)-3+3=0,\qquad\vec n=[1,2,-1]\ne\vec0\]`
          }
        ],
        answer: String.raw`\(x+2y-z+3=0\). A nonzero normal is needed to define a plane.`,
        id: "hw-8-5-p3"
      },
      {
        title: "Classify plane relationships",
        prompt: String.raw`Compare \(\Pi_1:x+2y-z=4\) with \(\Pi_2:-2x-4y+2z=-8\), \(\Pi_3:-2x-4y+2z=8\), and \(\Pi_4:x+y+3z=1\).`,
        tags: ["T", "C"],
        hint: "Use a complete-equation scaling check for parallel normals and a dot product for perpendicular normals.",
        steps: [
          {
            label: "Coincident planes",
            text: "Multiplying every term of Pi1 by -2 gives Pi2.",
            math: String.raw`\[-2\Pi_1:\quad-2x-4y+2z=-8\Rightarrow\Pi_1=\Pi_2\]`
          },
          {
            label: "Distinct parallel planes",
            text: "Pi3 has the same left side as Pi2 but a different constant.",
            math: String.raw`\[8\ne-8\Rightarrow\Pi_1\parallel\Pi_3\text{ and }\Pi_1\ne\Pi_3\]`
          },
          {
            label: "Perpendicular planes",
            text: "The normals to Pi1 and Pi4 have zero dot product.",
            math: String.raw`\[[1,2,-1]\cdot[1,1,3]=1+2-3=0\Rightarrow\Pi_1\perp\Pi_4\]`
          }
        ],
        answer: "Pi1 and Pi2 coincide. Pi1 and Pi3 are distinct parallel planes. Pi1 and Pi4 are perpendicular.",
        id: "hw-8-5-p4"
      },
      {
        title: "Smaller angle between planes",
        prompt: String.raw`Find the smaller angle between \(x+y+z=2\) and \(x+z=1\). Keep an exact ratio before the final approximation.`,
        tags: ["A", "C"],
        hint: "Read normals directly from the coefficients, including the missing y term.",
        steps: [
          {
            label: "Normals",
            text: "A missing variable has coefficient zero.",
            math: String.raw`\[\vec n_1=[1,1,1],\quad\vec n_2=[1,0,1]\]`
          },
          {
            label: "Exact ratio",
            text: "Calculate the dot product and exact magnitudes.",
            math: String.raw`\[\vec n_1\cdot\vec n_2=2,\quad\|\vec n_1\|=\sqrt3,\quad\|\vec n_2\|=\sqrt2,\quad\cos\theta=\frac2{\sqrt6}\]`
          },
          {
            label: "Angle",
            text: "The absolute dot product selects the smaller angle.",
            math: String.raw`\[\theta=\cos^{-1}\!\left(\frac2{\sqrt6}\right)\approx35.3^\circ\]`
          }
        ],
        answer: String.raw`The smaller angle is approximately \(35.3^\circ\).`,
        id: "hw-8-5-p5"
      }
    ]
  },
  {
    id: "homework-8-6",
    number: "8.6",
    title: "Sketching points and planes in R³",
    focus: "Draw labelled axes and use coordinates, intercepts, and traces to explain a sketch.",
    estimatedMinutes: 40,
    problems: [
      {
        title: "Plot a point and its projection",
        prompt: String.raw`Sketch \(P(2,-1,3)\) on labelled three-dimensional axes. Mark its projection H onto the xy-plane and describe the coordinate movements.`,
        tags: ["K", "A", "C"],
        hint: "The xy-plane has z=0. Keep x and y when finding the projection.",
        steps: [
          {
            label: "First coordinate",
            text: "Start at O and move two units in positive x.",
            math: String.raw`\[O(0,0,0)\longrightarrow(2,0,0)\]`
          },
          {
            label: "Second coordinate",
            text: "Move one unit parallel to negative y.",
            math: String.raw`\[(2,0,0)\longrightarrow H(2,-1,0)\]`
          },
          {
            label: "Third coordinate",
            text: "Move three units parallel to positive z and retain light construction lines.",
            math: String.raw`\[H(2,-1,0)\longrightarrow P(2,-1,3)\]`
          }
        ],
        answer: String.raw`\(H=(2,-1,0)\). P lies three units above the xy-plane. A correct sketch labels the axes, H, P, and coordinate movements.`,
        id: "hw-8-6-p1"
      },
      {
        title: "A point below the xy-plane",
        prompt: String.raw`Sketch \(R(-1,2,-2)\) and its projection onto the xy-plane. Explain how each negative coordinate changes the construction.`,
        tags: ["A", "C"],
        hint: "A negative z-coordinate places the point below the xy-plane.",
        steps: [
          {
            label: "Horizontal construction",
            text: "Move one unit in negative x, then two units parallel to positive y.",
            math: String.raw`\[(0,0,0)\longrightarrow(-1,0,0)\longrightarrow H(-1,2,0)\]`
          },
          {
            label: "Vertical movement",
            text: "Move down two units parallel to z.",
            math: String.raw`\[H(-1,2,0)\longrightarrow R(-1,2,-2)\]`
          },
          {
            label: "Explain the signs",
            text: "Negative x reverses the x movement. Negative z reverses the vertical movement.",
            math: String.raw`\[z_R=-2<0,\qquad H=(-1,2,0)\]`
          }
        ],
        answer: String.raw`The projection is \((-1,2,0)\), and R lies below the xy-plane. Retain labelled construction lines in the sketch.`,
        id: "hw-8-6-p2"
      },
      {
        title: "Intercepts and coordinate-plane traces",
        prompt: String.raw`Sketch \(2x+3y+6z=6\). Find all three axis intercepts and all three coordinate-plane traces. Explain why the drawn triangle is not the whole plane.`,
        tags: ["K", "A", "C"],
        hint: "An axis intercept sets two coordinates to zero. A trace sets only one to zero.",
        steps: [
          {
            label: "Intercepts",
            text: "Set the other two coordinates to zero each time.",
            math: String.raw`\[A(3,0,0),\quad B(0,2,0),\quad C(0,0,1)\]`
          },
          {
            label: "Traces",
            text: "Each restriction gives a line in the named coordinate plane.",
            math: String.raw`\[z=0:2x+3y=6,\quad y=0:2x+6z=6,\quad x=0:3y+6z=6\]`
          },
          {
            label: "Complete the sketch",
            text: "Plot A, B, and C on labelled axes and join them to show orientation. Indicate that the plane extends beyond the triangle.",
            math: String.raw`\[\Pi\text{ is infinite in both independent in-plane directions}\]`
          }
        ],
        answer: String.raw`Intercepts \((3,0,0),(0,2,0),(0,0,1)\). The three traces join the corresponding intercept pairs; the plane extends beyond the patch.`,
        id: "hw-8-6-p3"
      },
      {
        title: "Missing coefficients and contained axes",
        prompt: String.raw`Compare sketches of \(x+y=2\) and \(x+y=0\) in R³. Does either plane meet or contain the z-axis? Explain why z being absent does not settle this by itself.`,
        tags: ["T", "C"],
        hint: "Test a general point (0,0,z) on the z-axis in each equation.",
        steps: [
          {
            label: "Test the first plane",
            text: "Substitute x=y=0.",
            math: String.raw`\[0+0=2\quad\text{is impossible}\]`
          },
          {
            label: "Test the second plane",
            text: "Every z-axis point satisfies the equation.",
            math: String.raw`\[0+0=0\quad\text{for every }z\in\mathbb R\]`
          },
          {
            label: "Sketch and interpret",
            text: "In each case, draw its xy-trace and extend parallel to z. The first misses the z-axis; the second contains it.",
            math: String.raw`\[x+y=2:\text{ no z-axis points};\qquad x+y=0:\{(0,0,z):z\in\mathbb R\}\]`
          }
        ],
        answer: String.raw`Both planes are parallel to the z direction. The plane \(x+y=2\) misses the z-axis, while \(x+y=0\) contains the whole axis.`,
        id: "hw-8-6-p4"
      },
      {
        title: "A plane through the origin",
        prompt: String.raw`Sketch \(x+y+z=0\) using traces. Explain why its axis intercepts alone do not show the plane orientation, and give two independent spans.`,
        tags: ["A", "T", "C"],
        hint: "All three axis intercepts coincide at O, so draw two independent trace directions.",
        steps: [
          {
            label: "Find traces",
            text: "Set one coordinate to zero at a time.",
            math: String.raw`\[z=0:y=-x,\qquad y=0:z=-x,\qquad x=0:z=-y\]`
          },
          {
            label: "Choose spans",
            text: "Use directions from two different traces.",
            math: String.raw`\[\vec a=[1,-1,0],\quad\vec b=[1,0,-1],\quad\vec a\not\parallel\vec b\]`
          },
          {
            label: "Describe the plane",
            text: "Draw a patch through O and the two trace directions, extending beyond them.",
            math: String.raw`\[\vec r=s[1,-1,0]+t[1,0,-1],\quad s,t\in\mathbb R\]`
          }
        ],
        answer: String.raw`All intercepts are O. The independent traces and spans show orientation, with vector form \(\vec r=s[1,-1,0]+t[1,0,-1]\).`,
        id: "hw-8-6-p5"
      }
    ]
  },
  {
    id: "homework-9-1",
    number: "9.1",
    title: "Intersections involving lines",
    focus: "Solve line-plane and line-line systems, then verify every coordinate.",
    estimatedMinutes: 40,
    problems: [
      {
        title: "A line crossing a plane",
        prompt: String.raw`Find the intersection of \(L:\vec r=[1,0,2]+t[1,2,-1]\) and \(\Pi:x+y+z=5\). Verify the intersection in both objects.`,
        tags: ["K", "A"],
        hint: "Substitute all three coordinate expressions into the plane.",
        steps: [
          {
            label: "Substitute",
            text: "The line has x=1+t, y=2t, and z=2-t.",
            math: String.raw`\[(1+t)+2t+(2-t)=5\Rightarrow3+2t=5\]`
          },
          {
            label: "Find the point",
            text: "Solve for the parameter and return to the line.",
            math: String.raw`\[t=1\Rightarrow P(2,2,1)\]`
          },
          {
            label: "Verify",
            text: "The coordinates come from the line and satisfy the plane.",
            math: String.raw`\[2+2+1=5\]`
          }
        ],
        answer: String.raw`The unique intersection is \(P(2,2,1)\).`,
        id: "hw-9-1-p1"
      },
      {
        title: "Contained or parallel and disjoint",
        prompt: String.raw`Classify \(L:\vec r=[1,0,1]+t[1,-1,0]\) relative to \(\Pi_1:x+y+z=2\) and \(\Pi_2:x+y+z=3\). Explain the difference between an identity and a contradiction.`,
        tags: ["A", "T", "C"],
        hint: "Substitution produces a constant expression because the direction is perpendicular to the normal.",
        steps: [
          {
            label: "Check the orientation",
            text: "The normal-direction dot product vanishes.",
            math: String.raw`\[[1,1,1]\cdot[1,-1,0]=0\]`
          },
          {
            label: "Substitute into Pi1",
            text: "No restriction remains on the parameter.",
            math: String.raw`\[(1+t)-t+1=2\Rightarrow2=2\quad\text{for every }t\]`
          },
          {
            label: "Substitute into Pi2",
            text: "The constant equality fails for every parameter.",
            math: String.raw`\[(1+t)-t+1=3\Rightarrow2=3\quad\text{is impossible}\]`
          }
        ],
        answer: "L is contained in Pi1. It is parallel and disjoint from Pi2. An identity allows all t, while the contradiction allows none.",
        id: "hw-9-1-p2"
      },
      {
        title: "Two intersecting lines",
        prompt: String.raw`Find the common point of \(L_1:\vec r=s[1,1,0]\) and \(L_2:\vec r=[1,0,0]+u[-1,1,0]\). Use separate parameters and verify all coordinates.`,
        tags: ["K", "A"],
        hint: "Equate x, y, and z separately.",
        steps: [
          {
            label: "Coordinate system",
            text: "One parameter pair must satisfy all equations.",
            math: String.raw`\[s=1-u,\qquad s=u,\qquad0=0\]`
          },
          {
            label: "Solve",
            text: "Substitute u=s into the first equation.",
            math: String.raw`\[2s=1\Rightarrow s=u=\tfrac12\]`
          },
          {
            label: "Verify both lines",
            text: "Both produce the same ordered triple.",
            math: String.raw`\[\tfrac12[1,1,0]=[1,0,0]+\tfrac12[-1,1,0]=[\tfrac12,\tfrac12,0]\]`
          }
        ],
        answer: String.raw`The lines intersect at \((\tfrac12,\tfrac12,0)\).`,
        id: "hw-9-1-p3"
      },
      {
        title: "A third-coordinate check reveals skew lines",
        prompt: String.raw`Determine the relationship between \(L_1:\vec r=s[1,1,0]\) and \(L_2:\vec r=[1,0,1]+u[-1,1,0]\). Show why solving only x and y is insufficient.`,
        tags: ["T", "C"],
        hint: "The z-coordinates must agree too, and the directions must be checked before using the word skew.",
        steps: [
          {
            label: "First two coordinates",
            text: "They produce a candidate parameter pair.",
            math: String.raw`\[s=1-u,\quad s=u\Rightarrow s=u=\tfrac12\]`
          },
          {
            label: "Third coordinate",
            text: "The lines lie at different fixed z-values.",
            math: String.raw`\[0=1\quad\text{is impossible}\]`
          },
          {
            label: "Classify",
            text: "The directions are not scalar multiples, so the disjoint lines are not parallel.",
            math: String.raw`\[[1,1,0]\not\parallel[-1,1,0]\Rightarrow\text{skew lines}\]`
          }
        ],
        answer: "The lines are skew. The x and y equations agree at a candidate pair, but z gives a contradiction.",
        id: "hw-9-1-p4"
      },
      {
        title: "A family of parallel planes",
        prompt: String.raw`Classify \(L:\vec r=[1,2,0]+t[1,1,-1]\) relative to \(\Pi_k:2x-y+z=k\) for every real k. Can any member intersect L at exactly one point?`,
        tags: ["A", "T", "C"],
        hint: "Calculate the normal-direction dot product and then substitute the entire line.",
        steps: [
          {
            label: "Orientation",
            text: "The same normal applies to every plane in the family.",
            math: String.raw`\[[2,-1,1]\cdot[1,1,-1]=2-1-1=0\]`
          },
          {
            label: "Substitute",
            text: "The parameter cancels and the left side is always zero.",
            math: String.raw`\[2(1+t)-(2+t)-t=0\]`
          },
          {
            label: "Classify every k",
            text: "The constant comparison decides whether all or no parameters work.",
            math: String.raw`\[k=0\Rightarrow L\subset\Pi_k;\qquad k\ne0\Rightarrow L\cap\Pi_k=\varnothing\]`
          }
        ],
        answer: String.raw`L is contained when \(k=0\) and parallel-disjoint otherwise. No member has exactly one intersection with L.`,
        id: "hw-9-1-p5"
      }
    ]
  },
  {
    id: "homework-9-2",
    number: "9.2",
    title: "Solving linear systems",
    focus: "Use elimination, identify free variables, and distinguish consistency from uniqueness.",
    estimatedMinutes: 40,
    problems: [
      {
        title: "A unique solution by elimination",
        prompt: String.raw`Solve \(x+y+z=6\), \(2x-y+z=3\), and \(x+2y-z=2\). Show elimination and verify all original equations.`,
        tags: ["K", "A"],
        hint: "Eliminate x from two equation pairs first.",
        steps: [
          {
            label: "Reduce the system",
            text: "Use equation 2 minus twice equation 1, then equation 3 minus equation 1.",
            math: String.raw`\[-3y-z=-9,\qquad y-2z=-4\]`
          },
          {
            label: "Solve the reduced equations",
            text: "Add three times the second reduced equation to the first.",
            math: String.raw`\[-7z=-21\Rightarrow z=3,\quad y=2,\quad x=1\]`
          },
          {
            label: "Verify",
            text: "Check each original restriction.",
            math: String.raw`\[1+2+3=6,\quad2(1)-2+3=3,\quad1+2(2)-3=2\]`
          }
        ],
        answer: String.raw`The system has the unique solution \((1,2,3)\).`,
        id: "hw-9-2-p1"
      },
      {
        title: "An identity with a remaining line of solutions",
        prompt: String.raw`Solve \(x+y+z=3\), \(x-y+z=1\), and \(2x+2z=4\). Explain why the identity from elimination does not allow every triple.`,
        tags: ["A", "T", "C"],
        hint: "The third equation repeats information from the first two.",
        steps: [
          {
            label: "Find a fixed coordinate",
            text: "Subtract equation 2 from equation 1.",
            math: String.raw`\[2y=2\Rightarrow y=1\]`
          },
          {
            label: "Identify redundancy",
            text: "The remaining restriction is x+z=2, which agrees with equation 3.",
            math: String.raw`\[2x+2z=4\Rightarrow0=0\text{ after comparison}\]`
          },
          {
            label: "Write the full family",
            text: "Let z=t, retaining all non-redundant restrictions.",
            math: String.raw`\[(x,y,z)=(2-t,1,t),\qquad t\in\mathbb R\]`
          }
        ],
        answer: String.raw`Infinitely many solutions form the line \((2-t,1,t)\). The identity adds no restriction, but the other equations still do.`,
        id: "hw-9-2-p2"
      },
      {
        title: "A contradiction after elimination",
        prompt: String.raw`Determine whether \(x+y+z=3\), \(x-y+z=1\), and \(2x+2z=5\) are consistent. Show the contradiction.`,
        tags: ["K", "T", "C"],
        hint: "Add the first two equations, then compare with the third.",
        steps: [
          {
            label: "Combine equations",
            text: "The first pair forces a value of 2x+2z.",
            math: String.raw`\[(x+y+z)+(x-y+z)=3+1\Rightarrow2x+2z=4\]`
          },
          {
            label: "Compare",
            text: "Subtract the combined equation from the third.",
            math: String.raw`\[(2x+2z)-(2x+2z)=5-4\Rightarrow0=1\]`
          },
          {
            label: "Interpret",
            text: "A contradiction has no solution, so no triple satisfies the original system."
          }
        ],
        answer: "The system is inconsistent and has no solution.",
        id: "hw-9-2-p3"
      },
      {
        title: "Two free variables after redundant equations",
        prompt: String.raw`Give the complete solution set of \(x-y+z=3\), \(2x-2y+2z=6\), and \(-x+y-z=-3\). State how many free variables remain.`,
        tags: ["A", "T", "C"],
        hint: "All three equations express the same restriction.",
        steps: [
          {
            label: "Compare complete equations",
            text: "The second is twice and the third is negative one times the first.",
            math: String.raw`\[E_2=2E_1,\qquad E_3=-E_1\]`
          },
          {
            label: "Choose free coordinates",
            text: "Let y=s and z=t, then solve the first equation.",
            math: String.raw`\[x=3+s-t,\qquad y=s,\qquad z=t\]`
          },
          {
            label: "Describe all solutions",
            text: "Two independent parameters remain.",
            math: String.raw`\[\vec r=[3,0,0]+s[1,1,0]+t[-1,0,1],\quad s,t\in\mathbb R\]`
          }
        ],
        answer: "The solution set is a plane, with two free variables. It is consistent but not uniquely determined.",
        id: "hw-9-2-p4"
      },
      {
        title: "Consistency depending on a constant",
        prompt: String.raw`For which k is \(x+y+z=2\), \(x-y+z=0\), \(2x+2z=k\) consistent? Give the full solution set whenever it is consistent.`,
        tags: ["A", "T", "C"],
        hint: "The first two equations force a value for the left side of the third.",
        steps: [
          {
            label: "Use the first pair",
            text: "Subtract and add to find the retained restrictions.",
            math: String.raw`\[y=1,\qquad x+z=1\]`
          },
          {
            label: "Check the parameter",
            text: "Twice x+z equals 2.",
            math: String.raw`\[2x+2z=2\Rightarrow k=2\]`
          },
          {
            label: "State both cases",
            text: "Keep the free variable only in the consistent case.",
            math: String.raw`\[k=2:(x,y,z)=(1-t,1,t);\qquad k\ne2:\text{ no solution}\]`
          }
        ],
        answer: String.raw`Consistent exactly when \(k=2\), with line of solutions \((1-t,1,t)\).`,
        id: "hw-9-2-p5"
      }
    ]
  },
  {
    id: "homework-9-3",
    number: "9.3",
    title: "Intersections of two planes",
    focus: "Find the complete intersection set and verify its location and direction.",
    estimatedMinutes: 40,
    problems: [
      {
        title: "A line of intersection",
        prompt: String.raw`Find a vector equation for the intersection of \(x+y+z=3\) and \(x-y+z=1\). Verify both the anchor and direction.`,
        tags: ["K", "A", "C"],
        hint: "Subtract the plane equations, then choose one free coordinate.",
        steps: [
          {
            label: "Eliminate",
            text: "Subtract the second equation from the first.",
            math: String.raw`\[2y=2\Rightarrow y=1,\qquad x+z=2\]`
          },
          {
            label: "Parameterize",
            text: "Let z=t and separate the constant point and direction.",
            math: String.raw`\[\vec r=[2,1,0]+t[-1,0,1]\]`
          },
          {
            label: "Verify",
            text: "The anchor lies in both planes and the direction is perpendicular to both normals.",
            math: String.raw`\[2+1=3,\quad2-1=1,\quad[1,1,1]\cdot[-1,0,1]=[1,-1,1]\cdot[-1,0,1]=0\]`
          }
        ],
        answer: String.raw`The common set is \(\vec r=[2,1,0]+t[-1,0,1]\), for every real t.`,
        id: "hw-9-3-p1"
      },
      {
        title: "Distinct parallel planes",
        prompt: String.raw`Determine the intersection of \(x+2y-z=4\) and \(2x+4y-2z=10\). Justify the geometric conclusion.`,
        tags: ["K", "T", "C"],
        hint: "Match the complete first equation to the second before comparing constants.",
        steps: [
          {
            label: "Compare normals",
            text: "The normals are parallel.",
            math: String.raw`\[[2,4,-2]=2[1,2,-1]\]`
          },
          {
            label: "Scale the equation",
            text: "Twice the first requires a different right side.",
            math: String.raw`\[2x+4y-2z=8\]`
          },
          {
            label: "Eliminate",
            text: "Subtract twice equation 1 from equation 2.",
            math: String.raw`\[0=10-8=2\Rightarrow\Pi_1\cap\Pi_2=\varnothing\]`
          }
        ],
        answer: "The planes are distinct and parallel, with no common points.",
        id: "hw-9-3-p2"
      },
      {
        title: "Coincident planes and their full common set",
        prompt: String.raw`Determine the common set of \(x+2y-z=4\) and \(2x+4y-2z=8\). Give a vector representation rather than a single point.`,
        tags: ["A", "T", "C"],
        hint: "Only one independent restriction remains.",
        steps: [
          {
            label: "Compare complete equations",
            text: "The second is exactly twice the first.",
            math: String.raw`\[E_2=2E_1\Rightarrow\Pi_1=\Pi_2\]`
          },
          {
            label: "Choose two free variables",
            text: "Let y=s and z=t.",
            math: String.raw`\[x=4-2s+t\]`
          },
          {
            label: "Represent the common plane",
            text: "Every point of this plane belongs to both equations.",
            math: String.raw`\[\vec r=[4,0,0]+s[-2,1,0]+t[1,0,1]\]`
          }
        ],
        answer: String.raw`The common set is the entire plane \(\vec r=[4,0,0]+s[-2,1,0]+t[1,0,1]\).`,
        id: "hw-9-3-p3"
      },
      {
        title: "Find and verify an intersection direction",
        prompt: String.raw`Find the intersection of \(x+y=2\) and \(y+z=3\). Compare your line direction with the cross product of the normals and explain any sign difference.`,
        tags: ["A", "C"],
        hint: "Let y be the free parameter.",
        steps: [
          {
            label: "Solve coordinates",
            text: "Choose y=t and use both equations.",
            math: String.raw`\[x=2-t,\quad y=t,\quad z=3-t\]`
          },
          {
            label: "Vector form",
            text: "Separate the fixed point and direction.",
            math: String.raw`\[\vec r=[2,0,3]+t[-1,1,-1]\]`
          },
          {
            label: "Check direction",
            text: "Opposite nonzero directions describe the same line.",
            math: String.raw`\[[1,1,0]\times[0,1,1]=[1,-1,1]=-[-1,1,-1]\]`
          }
        ],
        answer: String.raw`The intersection is \(\vec r=[2,0,3]+t[-1,1,-1]\). Its direction is the negative of the normal cross product, which is equally valid.`,
        id: "hw-9-3-p4"
      },
      {
        title: "A parameter-dependent plane pair",
        prompt: String.raw`Classify the intersection of \(\Pi_1:x+y+z=1\) and \(\Pi_k:x+y+kz=2\) for every real k. Give a vector equation whenever an intersection line exists.`,
        tags: ["A", "T", "C"],
        hint: "Subtract the equations before dividing by k-1.",
        steps: [
          {
            label: "Subtract",
            text: "Keep the exceptional coefficient value visible.",
            math: String.raw`\[(k-1)z=1\]`
          },
          {
            label: "Exceptional case",
            text: "At k=1 the reduced equation is impossible.",
            math: String.raw`\[k=1\Rightarrow0=1\Rightarrow\text{distinct parallel planes}\]`
          },
          {
            label: "General case",
            text: "For k not equal to 1, let y=t and use the first plane.",
            math: String.raw`\[\vec r=[\tfrac{k-2}{k-1},0,\tfrac1{k-1}]+t[-1,1,0],\qquad k\ne1\]`
          }
        ],
        answer: String.raw`No common points at \(k=1\). For \(k\ne1\), the planes meet in the stated line.`,
        id: "hw-9-3-p5"
      }
    ]
  },
  {
    id: "homework-9-4",
    number: "9.4",
    title: "Intersections of three planes",
    focus: "Interpret the common solution as a point, line, plane, or empty set.",
    estimatedMinutes: 40,
    problems: [
      {
        title: "One common point",
        prompt: String.raw`Find the common intersection of \(x+y+z=6\), \(x-y+z=2\), and \(x+y-z=0\). Verify the answer in all three planes.`,
        tags: ["K", "A"],
        hint: "Subtract equation pairs to isolate y and z.",
        steps: [
          {
            label: "Find y and z",
            text: "Subtract equation 2 from 1, then equation 3 from 1.",
            math: String.raw`\[2y=4\Rightarrow y=2,\qquad2z=6\Rightarrow z=3\]`
          },
          {
            label: "Find x",
            text: "Use the first equation.",
            math: String.raw`\[x+2+3=6\Rightarrow x=1\]`
          },
          {
            label: "Verify",
            text: "Check the complete system.",
            math: String.raw`\[1+2+3=6,\quad1-2+3=2,\quad1+2-3=0\]`
          }
        ],
        answer: String.raw`The unique common point is \((1,2,3)\).`,
        id: "hw-9-4-p1"
      },
      {
        title: "Three planes sharing a line",
        prompt: String.raw`Describe the common solution of \(x+y+z=2\), \(2x-y+z=1\), and \(3x+2z=3\). Explain why the third equation does not produce a single point.`,
        tags: ["A", "T", "C"],
        hint: "Compare the third equation with the sum of the first two.",
        steps: [
          {
            label: "Identify redundancy",
            text: "The third equation is already implied by the first pair.",
            math: String.raw`\[E_3=E_1+E_2\]`
          },
          {
            label: "Solve the independent restrictions",
            text: "Subtract equation 1 from equation 2 and let y=t.",
            math: String.raw`\[x-2y=-1\Rightarrow x=2t-1,\qquad z=3-3t\]`
          },
          {
            label: "State the common geometry",
            text: "One free parameter remains.",
            math: String.raw`\[\vec r=[-1,0,3]+t[2,1,-3]\]`
          }
        ],
        answer: "The common intersection is a line. The third plane contains the entire intersection of the first two.",
        id: "hw-9-4-p2"
      },
      {
        title: "Three equations describing one plane",
        prompt: String.raw`Classify the common intersection of \(x-y+z=3\), \(2x-2y+2z=6\), and \(-3x+3y-3z=-9\). Give its vector equation.`,
        tags: ["K", "T", "C"],
        hint: "Compare all coefficients and constants, then retain two free parameters.",
        steps: [
          {
            label: "Compare equations",
            text: "Every equation is a nonzero multiple of the first.",
            math: String.raw`\[E_2=2E_1,\qquad E_3=-3E_1\]`
          },
          {
            label: "Parameterize",
            text: "Let y=s and z=t.",
            math: String.raw`\[x=3+s-t\]`
          },
          {
            label: "Describe the common plane",
            text: "There are two independent free variables.",
            math: String.raw`\[\vec r=[3,0,0]+s[1,1,0]+t[-1,0,1]\]`
          }
        ],
        answer: "All three planes coincide, so their common set is the entire stated plane.",
        id: "hw-9-4-p3"
      },
      {
        title: "Pairwise intersections without a common point",
        prompt: String.raw`The planes are \(x=0\), \(y=0\), and \(x+y=1\). Find each pairwise intersection and explain why no point belongs to all three.`,
        tags: ["A", "T", "C"],
        hint: "The first two force x=y=0, which must still satisfy the third.",
        steps: [
          {
            label: "First pair",
            text: "The intersection of x=0 and y=0 is the z-axis.",
            math: String.raw`\[L_{12}:\vec r=[0,0,0]+t[0,0,1]\]`
          },
          {
            label: "Other pairs",
            text: "Use one fixed coordinate in the third equation.",
            math: String.raw`\[L_{13}:\vec r=[0,1,0]+t[0,0,1],\quad L_{23}:\vec r=[1,0,0]+t[0,0,1]\]`
          },
          {
            label: "Test all three",
            text: "The first pair violates the third plane.",
            math: String.raw`\[x=y=0\Rightarrow x+y=0\ne1\]`
          }
        ],
        answer: "The pairs meet in three distinct parallel lines, but the three planes have no common point.",
        id: "hw-9-4-p4"
      },
      {
        title: "A family with a point or a line",
        prompt: String.raw`Classify the common solution of \(x+y+z=3\), \(x-y+z=1\), and \(x+y+kz=3\) for every real k. Give the complete set in each case.`,
        tags: ["A", "T", "C"],
        hint: "Subtract the first equation from the third and keep the exceptional k-value.",
        steps: [
          {
            label: "Reduce",
            text: "The first pair gives y=1 and x+z=2.",
            math: String.raw`\[y=1,\quad x+z=2,\quad(k-1)z=0\]`
          },
          {
            label: "Non-exceptional case",
            text: "For k not equal to 1, z is fixed.",
            math: String.raw`\[k\ne1\Rightarrow z=0,\quad x=2,\quad y=1\]`
          },
          {
            label: "Exceptional case",
            text: "At k=1 the third equation repeats the first.",
            math: String.raw`\[k=1\Rightarrow\vec r=[2,1,0]+t[-1,0,1]\]`
          }
        ],
        answer: String.raw`For \(k\ne1\), the common set is the point \((2,1,0)\). For \(k=1\), it is the line \([2,1,0]+t[-1,0,1]\).`,
        id: "hw-9-4-p5"
      }
    ]
  },
  {
    id: "homework-9-5",
    number: "9.5",
    title: "Distance from a point to a line",
    focus: "Use perpendicular distance, exact radicals, and foot verification in R² and R³.",
    estimatedMinutes: 40,
    problems: [
      {
        title: "Cartesian distance and perpendicular foot in R²",
        prompt: String.raw`Find the exact distance from \(P(1,2)\) to \(3x+4y-5=0\). Find the perpendicular foot H and verify it.`,
        tags: ["K", "A", "C"],
        hint: "Use the normal [3,4]. The signed residual is 6 and its squared magnitude is 25.",
        steps: [
          {
            label: "Distance",
            text: "Substitute P into the complete Cartesian expression.",
            math: String.raw`\[d=\frac{|3+8-5|}{\sqrt{3^2+4^2}}=\frac65\]`
          },
          {
            label: "Foot",
            text: "Subtract the signed normal displacement.",
            math: String.raw`\[H=[1,2]-\frac6{25}[3,4]=[\tfrac7{25},\tfrac{26}{25}]\]`
          },
          {
            label: "Verify",
            text: "H lies on the line and the connector is normal to it.",
            math: String.raw`\[3(\tfrac7{25})+4(\tfrac{26}{25})-5=0,\quad\overrightarrow{HP}=\frac6{25}[3,4]\]`
          }
        ],
        answer: String.raw`\(d=\frac65\) units, with \(H=(\frac7{25},\frac{26}{25})\).`,
        id: "hw-9-5-p1"
      },
      {
        title: "Cross-product distance in R³",
        prompt: String.raw`Find the exact distance from \(Q(1,0,2)\) to \(L:\vec r=t[1,1,0]\). Verify it using a perpendicular foot.`,
        tags: ["A", "T"],
        hint: "Use the origin as the line anchor and divide the parallelogram area by the direction magnitude.",
        steps: [
          {
            label: "Cross product",
            text: "The anchor-to-point displacement is [1,0,2].",
            math: String.raw`\[[1,0,2]\times[1,1,0]=[-2,2,1]\]`
          },
          {
            label: "Exact distance",
            text: "Use the magnitude ratio.",
            math: String.raw`\[d=\frac{\sqrt{4+4+1}}{\sqrt{1+1}}=\frac3{\sqrt2}=\frac{3\sqrt2}{2}\]`
          },
          {
            label: "Projection check",
            text: "The foot uses the scalar projection parameter.",
            math: String.raw`\[t_H=\frac{[1,0,2]\cdot[1,1,0]}2=\frac12,\quad H=(\tfrac12,\tfrac12,0),\quad\|Q-H\|=\sqrt{\tfrac14+\tfrac14+4}=\frac{3\sqrt2}{2}\]`
          }
        ],
        answer: String.raw`The exact perpendicular distance is \(\frac{3\sqrt2}{2}\) units.`,
        id: "hw-9-5-p2"
      },
      {
        title: "Recognising zero distance",
        prompt: String.raw`Find the distance from \(P(3,1,2)\) to \(L:\vec r=[1,1,0]+t[1,0,1]\). Explain the result geometrically.`,
        tags: ["K", "T", "C"],
        hint: "Test membership before carrying out a long distance calculation.",
        steps: [
          {
            label: "Test the point",
            text: "One value must work in every coordinate.",
            math: String.raw`\[t=2:\quad[1,1,0]+2[1,0,1]=[3,1,2]\]`
          },
          {
            label: "Check the displacement",
            text: "The anchor-to-point vector is parallel to the direction.",
            math: String.raw`\[\overrightarrow{AP}=[2,0,2]=2[1,0,1],\quad\overrightarrow{AP}\times\vec d=\vec0\]`
          },
          {
            label: "Interpret",
            text: "P is already on the line, so no perpendicular separation remains.",
            math: String.raw`\[d(P,L)=0\]`
          }
        ],
        answer: String.raw`The distance is zero because P lies on L at \(t=2\).`,
        id: "hw-9-5-p3"
      },
      {
        title: "Distance between parallel lines in R²",
        prompt: String.raw`Find the exact distance between \(L_1:3x-4y-6=0\) and \(L_2:6x-8y+8=0\). Explain why the constants cannot be compared before normalising.`,
        tags: ["A", "T", "C"],
        hint: "First make the x- and y-coefficients identical.",
        steps: [
          {
            label: "Normalise",
            text: "Divide the complete second equation by two.",
            math: String.raw`\[L_2:3x-4y+4=0\]`
          },
          {
            label: "Distance",
            text: "The two equations now use the same normal.",
            math: String.raw`\[d=\frac{|4-(-6)|}{\sqrt{3^2+(-4)^2}}=\frac{10}{5}=2\]`
          },
          {
            label: "Verify with a point",
            text: "The point (2,0) lies on L1 and gives the same distance to L2.",
            math: String.raw`\[3(2)-4(0)-6=0,\qquad\frac{|3(2)-4(0)+4|}{5}=2\]`
          }
        ],
        answer: "The lines are 2 units apart. Constants must be compared using the same normal coefficients.",
        id: "hw-9-5-p4"
      },
      {
        title: "Projection and the nearest point",
        prompt: String.raw`Find the nearest point H on \(L:\vec r=[0,1,0]+t[1,0,1]\) to \(P(1,2,3)\), then calculate the exact distance. Verify perpendicularity.`,
        tags: ["A", "T", "C"],
        hint: "Project the anchor-to-point displacement onto the line direction.",
        steps: [
          {
            label: "Projection parameter",
            text: "Use A=(0,1,0) and w=P-A.",
            math: String.raw`\[\vec w=[1,1,3],\quad t_H=\frac{\vec w\cdot[1,0,1]}{[1,0,1]\cdot[1,0,1]}=\frac42=2\]`
          },
          {
            label: "Foot and distance",
            text: "Return to the line, then measure the residual.",
            math: String.raw`\[H=(2,1,2),\quad\overrightarrow{HP}=[-1,1,1],\quad d=\sqrt3\]`
          },
          {
            label: "Verify",
            text: "The residual is perpendicular to the line direction.",
            math: String.raw`\[[-1,1,1]\cdot[1,0,1]=-1+1=0\]`
          }
        ],
        answer: String.raw`The nearest point is \(H=(2,1,2)\), and the exact distance is \(\sqrt3\) units.`,
        id: "hw-9-5-p5"
      }
    ]
  },
  {
    id: "homework-9-6",
    number: "9.6",
    title: "Distance from a point to a plane",
    focus: "Use the normal projection, retain signed information for the foot, and check the geometry.",
    estimatedMinutes: 40,
    problems: [
      {
        title: "Distance and nearest point",
        prompt: String.raw`Find the distance from \(P(3,1,2)\) to \(2x-y+2z-3=0\), and find the perpendicular foot H. Verify both conditions for H.`,
        tags: ["K", "A", "C"],
        hint: "The normal is [2,-1,2], whose squared magnitude is 9.",
        steps: [
          {
            label: "Residual and distance",
            text: "Substitute P into the Cartesian expression.",
            math: String.raw`\[f(P)=2(3)-1+2(2)-3=6,\quad\|\vec n\|=3,\quad d=2\]`
          },
          {
            label: "Foot",
            text: "Keep the residual sign in the projection factor.",
            math: String.raw`\[H=[3,1,2]-\frac69[2,-1,2]=[\tfrac53,\tfrac53,\tfrac23]\]`
          },
          {
            label: "Verify",
            text: "H lies in the plane and HP is parallel to its normal.",
            math: String.raw`\[2(\tfrac53)-\tfrac53+2(\tfrac23)-3=0,\qquad\overrightarrow{HP}=\tfrac23[2,-1,2]\]`
          }
        ],
        answer: String.raw`\(d=2\) units and \(H=(\frac53,\frac53,\frac23)\).`,
        id: "hw-9-6-p1"
      },
      {
        title: "An integer perpendicular foot",
        prompt: String.raw`Find the exact distance from \(P(3,1,4)\) to \(x+2y+2z=4\). Find H and verify its location and normal connector.`,
        tags: ["A", "C"],
        hint: "Move from P by the signed residual divided by the squared normal magnitude.",
        steps: [
          {
            label: "Distance",
            text: "The residual is 9 and the normal magnitude is 3.",
            math: String.raw`\[d=\frac{|3+2(1)+2(4)-4|}{\sqrt{1+4+4}}=3\]`
          },
          {
            label: "Foot",
            text: "The signed projection factor is one.",
            math: String.raw`\[H=[3,1,4]-\frac99[1,2,2]=[2,-1,2]\]`
          },
          {
            label: "Verify",
            text: "Check the plane and parallel normal direction.",
            math: String.raw`\[2+2(-1)+2(2)=4,\qquad P-H=[1,2,2]\]`
          }
        ],
        answer: String.raw`The distance is 3 units, and the perpendicular foot is \(H=(2,-1,2)\).`,
        id: "hw-9-6-p2"
      },
      {
        title: "Zero distance and an absolute value",
        prompt: String.raw`Find the distance from \(P(1,-1,2)\) to \(2x+y-z+1=0\). A student says a negative signed numerator would give a negative distance. Explain the error.`,
        tags: ["K", "T", "C"],
        hint: "A point satisfying the Cartesian equation has no separation from the plane.",
        steps: [
          {
            label: "Substitute",
            text: "Use the complete expression including the constant.",
            math: String.raw`\[2(1)+(-1)-2+1=0\]`
          },
          {
            label: "Calculate",
            text: "The numerator vanishes.",
            math: String.raw`\[d=\frac{|0|}{\sqrt{2^2+1^2+(-1)^2}}=0\]`
          },
          {
            label: "Explain the absolute value",
            text: "A signed residual identifies a side of the plane. Its absolute value gives a non-negative length.",
            math: String.raw`\[d(P,\Pi)=\frac{|f(P)|}{\|\vec n\|}\ge0\]`
          }
        ],
        answer: "P lies in the plane, so its distance is zero. A negative residual never gives a negative distance.",
        id: "hw-9-6-p3"
      },
      {
        title: "Distance between parallel planes",
        prompt: String.raw`Find the distance between \(x-y+z=3\) and \(2x-2y+2z=12\). Verify using a point on the first plane.`,
        tags: ["A", "T", "C"],
        hint: "Rewrite both equations with exactly the same normal.",
        steps: [
          {
            label: "Normalise",
            text: "Divide the entire second equation by two.",
            math: String.raw`\[\Pi_2:x-y+z=6\]`
          },
          {
            label: "Distance",
            text: "Use the difference of constants with the common normal magnitude.",
            math: String.raw`\[d=\frac{|6-3|}{\sqrt{1+1+1}}=\sqrt3\]`
          },
          {
            label: "Point check",
            text: "A=(3,0,0) lies in the first plane.",
            math: String.raw`\[\frac{|3-0+0-6|}{\sqrt3}=\frac3{\sqrt3}=\sqrt3\]`
          }
        ],
        answer: String.raw`The planes are exactly \(\sqrt3\) units apart.`,
        id: "hw-9-6-p4"
      },
      {
        title: "Distance from a vector plane",
        prompt: String.raw`Find the exact distance from \(P(3,1,4)\) to \(\Pi:\vec r=[1,0,2]+s[1,1,0]+t[0,1,1]\). Find and verify the perpendicular foot.`,
        tags: ["A", "T", "C"],
        hint: "First obtain a nonzero normal from the independent spans.",
        steps: [
          {
            label: "Normal and displacement",
            text: "Cross the spans and subtract the known plane point from P.",
            math: String.raw`\[\vec n=[1,-1,1],\quad\overrightarrow{AP}=[2,1,2],\quad\overrightarrow{AP}\cdot\vec n=3\]`
          },
          {
            label: "Distance and foot",
            text: "Use the projection factor 3/3=1.",
            math: String.raw`\[d=\frac3{\sqrt3}=\sqrt3,\quad H=[3,1,4]-[1,-1,1]=[2,2,3]\]`
          },
          {
            label: "Verify the geometry",
            text: "The plane has Cartesian equation x-y+z=3.",
            math: String.raw`\[2-2+3=3,\qquad P-H=[1,-1,1]=\vec n\]`
          }
        ],
        answer: String.raw`The distance is \(\sqrt3\) units, with perpendicular foot \(H=(2,2,3)\).`,
        id: "hw-9-6-p5"
      }
    ]
  }
];
