export type TeachingStep = { text: string; math?: string };
export type TeachingScene = {
  id: string;
  section: string;
  title: string;
  explanation: string;
  given?: string;
  formula?: string;
  demo?: "given" | "triangle" | "parameter" | "two-points" | "space";
  practice?: boolean;
  questionOnly?: boolean;
  steps: TeachingStep[];
  notes: string;
};

// Matches the complete Video 1 lecture order.
export const videoOneTeaching: TeachingScene[] = [
  {
    "id": "slide-1",
    "section": "8.1",
    "title": "A point and a direction",
    "explanation": "A known point and a nonzero direction determine one line.",
    "notes": "Let's say we have a line L, and we know one point on it. We'll call that point P zero. We also have a nonzero vector m that runs parallel to the line. We want an equation that gives us any point on this line. So we need a place to start and a direction to move in. P zero gives us the starting place. M gives us the direction.",
    "steps": [
      {
        "text": "Let's say we have a line L, and we know one point on it. We'll call that point P zero. We also have a nonzero vector m that runs parallel to the line. We want an equation that gives us any point on this line. So we need a place to start and a direction to move in. P zero gives us the starting place. M gives us the direction.",
        "math": "\\[P_0(x_0,y_0),\\qquad \\vec m\\parallel L,\\quad\\vec m\\ne\\vec0\\]"
      }
    ],
    "given": "\\[P_0(x_0,y_0),\\qquad \\vec m\\parallel L,\\quad\\vec m\\ne\\vec0\\]",
    "demo": "given"
  },
  {
    "id": "slide-2",
    "section": "8.1",
    "title": "Position vectors",
    "explanation": "P₀ is known. P is any point on the line.",
    "notes": "Start with the blue arrow. It goes from the origin to our known point, P zero. This is r zero, the position vector of P zero. Its components are just the coordinates of that point.\n\nNow choose any point P on the line. The purple arrow goes from the origin to P. We call that position vector r. P is the point. R is the vector that gets us there from the origin.",
    "steps": [
      {
        "text": "Start with the blue arrow. It goes from the origin to our known point, P zero. This is r zero, the position vector of P zero. Its components are just the coordinates of that point.",
        "math": "\\[\\vec r_0=\\overrightarrow{OP_0}=[x_0,y_0]\\]"
      },
      {
        "text": "Now choose any point P on the line. The purple arrow goes from the origin to P. We call that position vector r. P is the point. R is the vector that gets us there from the origin.",
        "math": "\\[\\vec r=\\overrightarrow{OP}=[x,y]\\]"
      }
    ],
    "given": "\\[\\vec r_0=\\overrightarrow{OP_0}=[x_0,y_0]\\]",
    "demo": "triangle"
  },
  {
    "id": "slide-3",
    "section": "8.1",
    "title": "The position vector triangle",
    "explanation": "The direct route and the route through P₀ have the same displacement.",
    "notes": "How can we get from O to P? We can go directly along the purple arrow. Or we can go to P zero first, then follow the green arrow to P. Both routes finish at the same point, so their total displacement is the same.\n\nReplace the two position arrows with r and r zero. We get r equals r zero plus the displacement from P zero to P. We know where to start. Now we need a way to describe that last movement.",
    "steps": [
      {
        "text": "How can we get from O to P? We can go directly along the purple arrow. Or we can go to P zero first, then follow the green arrow to P. Both routes finish at the same point, so their total displacement is the same.",
        "math": "\\[\\overrightarrow{OP}=\\overrightarrow{OP_0}+\\overrightarrow{P_0P}\\]"
      },
      {
        "text": "Replace the two position arrows with r and r zero. We get r equals r zero plus the displacement from P zero to P. We know where to start. Now we need a way to describe that last movement.",
        "math": "\\[\\vec r=\\vec r_0+\\overrightarrow{P_0P}\\]"
      }
    ],
    "given": "\\[\\overrightarrow{OP}=\\overrightarrow{OP_0}+\\overrightarrow{P_0P}\\]",
    "demo": "triangle"
  },
  {
    "id": "slide-4",
    "section": "8.1",
    "title": "The vector equation of a line",
    "explanation": "The displacement along the line is a scalar multiple of its direction.",
    "notes": "Here is the relationship we just found. The position of P is our starting position plus a movement along the line. How do we write that movement using m?\n\nThe movement is parallel to m, so it is a scalar multiple of m. Two copies would move us twice as far. Half a copy would move us half as far. A negative multiple would move us the other way. We call that multiplier t.\n\nSubstitute t m for the displacement. That gives the vector equation of a line. R zero tells us where to start. M gives the direction. T tells us how much of that direction to use. Allow every real value of t, and we get the whole line.",
    "steps": [
      {
        "text": "Here is the relationship we just found. The position of P is our starting position plus a movement along the line. How do we write that movement using m?",
        "math": "\\[\\vec r=\\vec r_0+\\overrightarrow{P_0P}\\]"
      },
      {
        "text": "The movement is parallel to m, so it is a scalar multiple of m. Two copies would move us twice as far. Half a copy would move us half as far. A negative multiple would move us the other way. We call that multiplier t.",
        "math": "\\[\\overrightarrow{P_0P}=t\\vec m\\]"
      },
      {
        "text": "Substitute t m for the displacement. That gives the vector equation of a line. R zero tells us where to start. M gives the direction. T tells us how much of that direction to use. Allow every real value of t, and we get the whole line.",
        "math": "\\[\\vec r=\\vec r_0+t\\vec m,\\qquad t\\in\\mathbb R\\]"
      }
    ],
    "given": "\\[\\vec r=\\vec r_0+\\overrightarrow{P_0P}\\]",
    "demo": "triangle"
  },
  {
    "id": "slide-5",
    "section": "8.1",
    "title": "Steps for writing a vector equation",
    "explanation": "Identify a known point and a nonzero direction, then build the equation.",
    "notes": "Here is the method we will use in the questions. First, identify a point that is on the line. Write its coordinates as the components of the starting position vector.\n\nNext, identify a nonzero vector parallel to the line. If the question gives two points, their displacement can supply this direction.\n\nPut the starting position first, then add t times the direction. Allow t to be any real number so we get the entire line.\n\nCheck the starting point by setting t to zero. The direction must also match the one required by the question. Once those two pieces are correct, we have the correct line.",
    "steps": [
      {
        "text": "Here is the method we will use in the questions. First, identify a point that is on the line. Write its coordinates as the components of the starting position vector.",
        "math": "\\[\\text{1 Choose a point }P_0:\\quad\\vec r_0=\\overrightarrow{OP_0}\\]"
      },
      {
        "text": "Next, identify a nonzero vector parallel to the line. If the question gives two points, their displacement can supply this direction.",
        "math": "\\[\\text{2 Choose a direction }\\vec m\\parallel L,\\quad\\vec m\\ne\\vec0\\]"
      },
      {
        "text": "Put the starting position first, then add t times the direction. Allow t to be any real number so we get the entire line.",
        "math": "\\[\\text{3 Write }\\vec r=\\vec r_0+t\\vec m,\\quad t\\in\\mathbb R\\]"
      },
      {
        "text": "Check the starting point by setting t to zero. The direction must also match the one required by the question. Once those two pieces are correct, we have the correct line.",
        "math": "\\[\\text{4 Check }t=0:\\quad\\vec r=\\vec r_0\\]"
      }
    ],
    "given": "\\[\\text{1 Choose a point }P_0:\\quad\\vec r_0=\\overrightarrow{OP_0}\\]"
  },
  {
    "id": "slide-6",
    "section": "8.1",
    "title": "The meaning of t",
    "explanation": "Changing the parameter moves the point along the same line.",
    "notes": "Let's see what the parameter does. When t is negative one, we subtract one copy of m. We move from P zero in the opposite direction.\n\nWhen t is zero, we add nothing. So we stay at P zero. This is a useful check: zero should return the starting point in that particular equation.\n\nWhen t is one, we add one copy of m. We can choose any real number, including fractions. Changing t moves the point along the line. It does not change which line we are describing.",
    "steps": [
      {
        "text": "Let's see what the parameter does. When t is negative one, we subtract one copy of m. We move from P zero in the opposite direction.",
        "math": "\\[t=-1:\\quad\\vec r=\\vec r_0-\\vec m\\]"
      },
      {
        "text": "When t is zero, we add nothing. So we stay at P zero. This is a useful check: zero should return the starting point in that particular equation.",
        "math": "\\[t=0:\\quad\\vec r=\\vec r_0\\]"
      },
      {
        "text": "When t is one, we add one copy of m. We can choose any real number, including fractions. Changing t moves the point along the line. It does not change which line we are describing.",
        "math": "\\[t=1:\\quad\\vec r=\\vec r_0+\\vec m\\]"
      }
    ],
    "given": "\\[t=-1:\\quad\\vec r=\\vec r_0-\\vec m\\]",
    "demo": "parameter"
  },
  {
    "id": "slide-7",
    "section": "8.1",
    "title": "Lines and vectors",
    "explanation": "A line has a fixed location. A direction vector tells us how to move.",
    "notes": "A line continues forever in both directions. It has a particular location in the coordinate plane. Two lines pointing the same way can still be in different places.\n\nA vector has a magnitude and a direction. We may translate a free vector without changing it. Two equal vectors have the same magnitude and direction, even if we draw them in different places.\n\nThe starting position fixes the location of our line. The nonzero direction vector supplies the movement. Every real value of t gives the whole line. Restricting t can give only part of it, such as a segment.\n\nTwo lines coincide when their locations and directions agree. Their chosen direction vectors may have different lengths or opposite senses. That does not change the line.",
    "steps": [
      {
        "text": "A line continues forever in both directions. It has a particular location in the coordinate plane. Two lines pointing the same way can still be in different places.",
        "math": "\\[\\text{Line: infinite in both directions, with a fixed location}\\]"
      },
      {
        "text": "A vector has a magnitude and a direction. We may translate a free vector without changing it. Two equal vectors have the same magnitude and direction, even if we draw them in different places.",
        "math": "\\[\\text{Vector: a direction and a finite magnitude}\\]"
      },
      {
        "text": "The starting position fixes the location of our line. The nonzero direction vector supplies the movement. Every real value of t gives the whole line. Restricting t can give only part of it, such as a segment.",
        "math": "\\[\\vec r=\\vec r_0+t\\vec m,\\quad t\\in\\mathbb R\\]"
      },
      {
        "text": "Two lines coincide when their locations and directions agree. Their chosen direction vectors may have different lengths or opposite senses. That does not change the line.",
        "math": "\\[\\text{Same line: same location and parallel directions}\\]"
      }
    ],
    "given": "\\[\\text{Line: infinite in both directions, with a fixed location}\\]"
  },
  {
    "id": "slide-8",
    "section": "8.1",
    "title": "Vector equations in two and three dimensions",
    "explanation": "The same point and direction rule works in both spaces.",
    "notes": "In two dimensions, our point has two coordinates and our direction has two components. The rule is still starting position plus a multiple of the direction.\n\nIn three dimensions, add the z-coordinate and the third direction component. The idea is exactly the same. A line still uses one parameter, because we move in one fixed direction.",
    "steps": [
      {
        "text": "In two dimensions, our point has two coordinates and our direction has two components. The rule is still starting position plus a multiple of the direction.",
        "math": "\\[\\mathbb R^2:\\quad[x,y]=[x_0,y_0]+t[m_1,m_2]\\]"
      },
      {
        "text": "In three dimensions, add the z-coordinate and the third direction component. The idea is exactly the same. A line still uses one parameter, because we move in one fixed direction.",
        "math": "\\[\\mathbb R^3:\\quad[x,y,z]=[x_0,y_0,z_0]+t[m_1,m_2,m_3]\\]"
      }
    ],
    "given": "\\[\\mathbb R^2:\\quad[x,y]=[x_0,y_0]+t[m_1,m_2]\\]"
  },
  {
    "id": "slide-9",
    "section": "8.1",
    "title": "A point and a direction example",
    "explanation": "Known point P₀(5, 7). Direction [6, 11].",
    "notes": "Let's use the point five comma seven and direction six comma eleven. Put the point into the starting vector, then add t times the direction. That gives the equation shown here.\n\nNow choose a value of t and use it in both components. At one, we get eleven comma eighteen. At three, we get twenty-three comma forty. At negative one, we get negative one comma negative four. The round brackets describe a point. The square brackets describe its position vector.",
    "steps": [
      {
        "text": "Let's use the point five comma seven and direction six comma eleven. Put the point into the starting vector, then add t times the direction. That gives the equation shown here.",
        "math": "\\[\\vec r=[5,7]+t[6,11]\\]"
      },
      {
        "text": "Now choose a value of t and use it in both components. At one, we get eleven comma eighteen. At three, we get twenty-three comma forty. At negative one, we get negative one comma negative four. The round brackets describe a point. The square brackets describe its position vector."
      },
      {
        "text": "Use the same parameter in every coordinate.",
        "math": "\\[\\begin{array}{ccccc}\\text{t} & \\text{x} & \\text{y} & \\text{Point} & \\text{Position vector}\\\\\\hline 0 & 5 & 7 & (5, 7) & [5, 7]\\\\1 & 11 & 18 & (11, 18) & [11, 18]\\\\3 & 23 & 40 & (23, 40) & [23, 40]\\\\-1 & -1 & -4 & (-1, -4) & [-1, -4]\\end{array}\\]"
      }
    ],
    "given": "\\[\\vec r=[5,7]+t[6,11]\\]"
  },
  {
    "id": "slide-10",
    "section": "8.1",
    "title": "Class example  A point and direction",
    "explanation": "Sketch the line through P(4, 3) parallel to [−7, 1].",
    "notes": "Here is the first sketching example from the notes. Plot the given point four comma three. A direction of negative seven comma one means seven left and one up.\n\nWrite the starting position plus t times that direction. That gives a vector equation for the required line.\n\nAt t equals one, move seven left and one up. This gives negative three comma four. Plot that second point and draw a straight line through both points, extending it in both directions.\n\nAt t equals negative one, move the opposite way. We reach eleven comma two. This point gives another check on the same line.",
    "steps": [
      {
        "text": "Here is the first sketching example from the notes. Plot the given point four comma three. A direction of negative seven comma one means seven left and one up.",
        "math": "\\[P(4,3),\\quad\\vec m=[-7,1]\\]"
      },
      {
        "text": "Write the starting position plus t times that direction. That gives a vector equation for the required line.",
        "math": "\\[\\vec r=[4,3]+t[-7,1]\\]"
      },
      {
        "text": "At t equals one, move seven left and one up. This gives negative three comma four. Plot that second point and draw a straight line through both points, extending it in both directions.",
        "math": "\\[t=1:\\quad Q(-3,4)\\]"
      },
      {
        "text": "At t equals negative one, move the opposite way. We reach eleven comma two. This point gives another check on the same line.",
        "math": "\\[t=-1:\\quad R(11,2)\\]"
      }
    ],
    "given": "\\[P(4,3),\\quad\\vec m=[-7,1]\\]"
  },
  {
    "id": "slide-11",
    "section": "8.1",
    "title": "Practice 1  Find a point",
    "explanation": "Write the vector equation. Then find the point when t = −2.",
    "notes": "Try this one. The known point is two comma negative one, and the direction is three comma two. Write the vector equation, then find the point when t is negative two. That negative two multiplies both direction components. Pause the video and show your working.",
    "steps": [],
    "given": "\\[P_0(2,-1),\\qquad\\vec m=[3,2]\\]",
    "practice": true,
    "questionOnly": true
  },
  {
    "id": "slide-12",
    "section": "8.1",
    "title": "Practice 1  Solution",
    "explanation": "The same value of t must give both coordinates.",
    "notes": "We need a starting point and a direction. Put the position vector of the given point first, then add t times the direction.\n\nReplace t with negative two. Keep the direction in brackets so it is clear that negative two multiplies the whole vector.\n\nNegative two times three is negative six. Negative two times two is negative four. That gives the movement from our starting point.\n\nNow add matching components. Two minus six is negative four. Negative one minus four is negative five.\n\nThe question asks for a point, so use round brackets. Our point is negative four comma negative five. We started at the given point, scaled the direction, and added.",
    "steps": [
      {
        "text": "We need a starting point and a direction. Put the position vector of the given point first, then add t times the direction.",
        "math": "\\[\\vec r=[2,-1]+t[3,2]\\]"
      },
      {
        "text": "Replace t with negative two. Keep the direction in brackets so it is clear that negative two multiplies the whole vector.",
        "math": "\\[t=-2:\\quad\\vec r=[2,-1]-2[3,2]\\]"
      },
      {
        "text": "Negative two times three is negative six. Negative two times two is negative four. That gives the movement from our starting point.",
        "math": "\\[\\vec r=[2,-1]+[-6,-4]\\]"
      },
      {
        "text": "Now add matching components. Two minus six is negative four. Negative one minus four is negative five.",
        "math": "\\[\\vec r=[2-6,-1-4]=[-4,-5]\\]"
      },
      {
        "text": "The question asks for a point, so use round brackets. Our point is negative four comma negative five. We started at the given point, scaled the direction, and added.",
        "math": "\\[P(-4,-5)\\]"
      }
    ],
    "given": "\\[\\vec r=[2,-1]+t[3,2]\\]"
  },
  {
    "id": "slide-13",
    "section": "8.1",
    "title": "Parametric equations",
    "explanation": "Read corresponding components of the vector equation.",
    "notes": "Vector form puts the coordinates together. Let's separate them into an equation for x and an equation for y.\n\nMultiply t into the direction vector, then add matching components. The first component becomes x zero plus t m one. The second becomes y zero plus t m two.\n\nEqual vectors have equal corresponding components. Read the first components to get the x equation, then read the second components to get the y equation. These are the parametric equations.\n\nFor our numerical example, x is five plus six t, and y is seven plus eleven t. Use the same t in both equations because the two coordinates belong to one point.",
    "steps": [
      {
        "text": "Vector form puts the coordinates together. Let's separate them into an equation for x and an equation for y.",
        "math": "\\[[x,y]=[x_0,y_0]+t[m_1,m_2]\\]"
      },
      {
        "text": "Multiply t into the direction vector, then add matching components. The first component becomes x zero plus t m one. The second becomes y zero plus t m two.",
        "math": "\\[[x,y]=[x_0+tm_1,\\ y_0+tm_2]\\]"
      },
      {
        "text": "Equal vectors have equal corresponding components. Read the first components to get the x equation, then read the second components to get the y equation. These are the parametric equations.",
        "math": "\\[x=x_0+tm_1,\\qquad y=y_0+tm_2\\]"
      },
      {
        "text": "For our numerical example, x is five plus six t, and y is seven plus eleven t. Use the same t in both equations because the two coordinates belong to one point.",
        "math": "\\[x=5+6t,\\qquad y=7+11t\\]"
      }
    ],
    "given": "\\[[x,y]=[x_0,y_0]+t[m_1,m_2]\\]"
  },
  {
    "id": "slide-14",
    "section": "8.3",
    "title": "Parametric equations in three dimensions",
    "explanation": "Read the corresponding components, using the same t.",
    "notes": "We just separated the vector equation into x and y in two dimensions. In space, we do the same thing with a third component.\n\nThe first components give the x equation. X starts at x zero and changes by t times m one.\n\nThe second components give the y equation. Keep the very same parameter t.\n\nThe third components give the z equation. These three values are the coordinates of one point, so one t must work in all three equations.",
    "steps": [
      {
        "text": "We just separated the vector equation into x and y in two dimensions. In space, we do the same thing with a third component.",
        "math": "\\[[x,y,z]=[x_0,y_0,z_0]+t[m_1,m_2,m_3]\\]"
      },
      {
        "text": "The first components give the x equation. X starts at x zero and changes by t times m one.",
        "math": "\\[x=x_0+tm_1\\]"
      },
      {
        "text": "The second components give the y equation. Keep the very same parameter t.",
        "math": "\\[y=y_0+tm_2\\]"
      },
      {
        "text": "The third components give the z equation. These three values are the coordinates of one point, so one t must work in all three equations.",
        "math": "\\[z=z_0+tm_3\\]"
      }
    ],
    "given": "\\[[x,y,z]=[x_0,y_0,z_0]+t[m_1,m_2,m_3]\\]"
  },
  {
    "id": "slide-15",
    "section": "8.1",
    "title": "Symmetric form",
    "explanation": "Make t the subject of each coordinate equation.",
    "notes": "We can also remove t from the notation. Begin with the two parametric equations and rearrange each one to make t the subject.\n\nSubtract the starting coordinate from each side. This leaves t multiplied by the relevant direction component.\n\nDivide by that direction component. Each fraction now equals t. This division requires a nonzero component.\n\nSince both fractions equal the same t, they equal each other. That is symmetric form. It describes the same line as our vector and parametric equations.\n\nFor our example, use five and seven as the starting coordinates, and six and eleven as the direction components. Later, we'll see how to write the answer when a direction component is zero.",
    "steps": [
      {
        "text": "We can also remove t from the notation. Begin with the two parametric equations and rearrange each one to make t the subject.",
        "math": "\\[x=x_0+tm_1,\\qquad y=y_0+tm_2\\]"
      },
      {
        "text": "Subtract the starting coordinate from each side. This leaves t multiplied by the relevant direction component.",
        "math": "\\[x-x_0=tm_1,\\qquad y-y_0=tm_2\\]"
      },
      {
        "text": "Divide by that direction component. Each fraction now equals t. This division requires a nonzero component.",
        "math": "\\[\\frac{x-x_0}{m_1}=t,\\qquad\\frac{y-y_0}{m_2}=t\\]"
      },
      {
        "text": "Since both fractions equal the same t, they equal each other. That is symmetric form. It describes the same line as our vector and parametric equations.",
        "math": "\\[\\frac{x-x_0}{m_1}=\\frac{y-y_0}{m_2}\\]"
      },
      {
        "text": "For our example, use five and seven as the starting coordinates, and six and eleven as the direction components. Later, we'll see how to write the answer when a direction component is zero.",
        "math": "\\[\\frac{x-5}{6}=\\frac{y-7}{11}\\]"
      }
    ],
    "given": "\\[x=x_0+tm_1,\\qquad y=y_0+tm_2\\]"
  },
  {
    "id": "slide-16",
    "section": "8.3",
    "title": "Symmetric form in three dimensions",
    "explanation": "Make the same parameter the subject of all three equations.",
    "notes": "For this example, x is one plus two t, y is three minus five t, and z is six plus four t. Let's write symmetric form.\n\nSubtract the starting coordinate from each equation. Keep the negative five attached to the y direction.\n\nDivide by the matching nonzero direction component. Now each fraction equals t.\n\nSet the three fractions equal to one another. This is symmetric form in space. The negative denominator records that y decreases as t increases.",
    "steps": [
      {
        "text": "For this example, x is one plus two t, y is three minus five t, and z is six plus four t. Let's write symmetric form.",
        "math": "\\[x=1+2t,\\quad y=3-5t,\\quad z=6+4t\\]"
      },
      {
        "text": "Subtract the starting coordinate from each equation. Keep the negative five attached to the y direction.",
        "math": "\\[x-1=2t,\\quad y-3=-5t,\\quad z-6=4t\\]"
      },
      {
        "text": "Divide by the matching nonzero direction component. Now each fraction equals t.",
        "math": "\\[t=\\frac{x-1}{2},\\quad t=\\frac{y-3}{-5},\\quad t=\\frac{z-6}{4}\\]"
      },
      {
        "text": "Set the three fractions equal to one another. This is symmetric form in space. The negative denominator records that y decreases as t increases.",
        "math": "\\[\\frac{x-1}{2}=\\frac{y-3}{-5}=\\frac{z-6}{4}\\]"
      }
    ],
    "given": "\\[x=1+2t,\\quad y=3-5t,\\quad z=6+4t\\]"
  },
  {
    "id": "slide-17",
    "section": "8.1",
    "title": "A line through two points",
    "explanation": "A(1, 4) and B(3, 1) give a direction along the line.",
    "notes": "Now suppose we are given two points instead of a direction vector. We have A at one comma four and B at three comma one. We can use A as our starting point.\n\nThe movement from A to B gives a direction along the line. Subtract the starting position from the ending position, so use B minus A.\n\nThree minus one gives two. One minus four gives negative three. Our direction is two comma negative three: two to the right and three down.\n\nPut A and that direction into vector form. As a check, set t to one. One full movement from A to B gives three comma one, which is B.",
    "steps": [
      {
        "text": "Now suppose we are given two points instead of a direction vector. We have A at one comma four and B at three comma one. We can use A as our starting point.",
        "math": "\\[A(1,4),\\qquad B(3,1)\\]"
      },
      {
        "text": "The movement from A to B gives a direction along the line. Subtract the starting position from the ending position, so use B minus A.",
        "math": "\\[\\vec m=\\overrightarrow{AB}=\\vec{OB}-\\vec{OA}\\]"
      },
      {
        "text": "Three minus one gives two. One minus four gives negative three. Our direction is two comma negative three: two to the right and three down.",
        "math": "\\[\\vec m=[3-1,1-4]=[2,-3]\\]"
      },
      {
        "text": "Put A and that direction into vector form. As a check, set t to one. One full movement from A to B gives three comma one, which is B.",
        "math": "\\[\\vec r=[1,4]+t[2,-3]\\]"
      }
    ],
    "given": "\\[A(1,4),\\qquad B(3,1)\\]",
    "demo": "two-points"
  },
  {
    "id": "slide-18",
    "section": "8.1",
    "title": "Class example  Fractional coordinates",
    "explanation": "Find an integer direction through A(1/2, −3) and B(3/4, 1/2).",
    "notes": "The two points contain fractions. We still find a direction using the ending point minus the starting point.\n\nThree quarters minus one half is one quarter. One half minus negative three is seven halves. This fractional vector is already a valid direction.\n\nThe question requests integer components, so multiply the whole direction by four. That gives one comma fourteen. Scaling the direction by a nonzero number preserves its parallel direction.\n\nUse A as the starting point and the integer direction in the vector equation. B is reached at t equals one quarter, because our new direction is four times the original displacement.",
    "steps": [
      {
        "text": "The two points contain fractions. We still find a direction using the ending point minus the starting point.",
        "math": "\\[A(\\tfrac12,-3),\\qquad B(\\tfrac34,\\tfrac12)\\]"
      },
      {
        "text": "Three quarters minus one half is one quarter. One half minus negative three is seven halves. This fractional vector is already a valid direction.",
        "math": "\\[\\overrightarrow{AB}=[\\tfrac34-\\tfrac12,\\tfrac12-(-3)]=[\\tfrac14,\\tfrac72]\\]"
      },
      {
        "text": "The question requests integer components, so multiply the whole direction by four. That gives one comma fourteen. Scaling the direction by a nonzero number preserves its parallel direction.",
        "math": "\\[4\\overrightarrow{AB}=[1,14]\\]"
      },
      {
        "text": "Use A as the starting point and the integer direction in the vector equation. B is reached at t equals one quarter, because our new direction is four times the original displacement.",
        "math": "\\[\\vec r=[\\tfrac12,-3]+t[1,14]\\]"
      }
    ],
    "given": "\\[A(\\tfrac12,-3),\\qquad B(\\tfrac34,\\tfrac12)\\]"
  },
  {
    "id": "slide-19",
    "section": "8.1",
    "title": "Infinitely many equations of the same line",
    "explanation": "Change the starting point or scale the direction by a nonzero number.",
    "notes": "Here is our equation through A and B. It uses A as the starting point and A B as the direction.\n\nB also lies on the line, so we can start at B instead. This equation reaches A when u is negative one. A different starting point does not change the line if the direction stays parallel.\n\nWe can reverse the direction too. The new direction is negative one times the old direction. A line extends both ways, so this still reaches the same set of points.\n\nOr double the direction. Each parameter step is now twice as large, but the line itself stays the same. The parameter reaching a particular point can change.\n\nIn general, choose any starting point on the line and any nonzero multiple of its direction. There are infinitely many choices. These are infinitely many equations describing one line.",
    "steps": [
      {
        "text": "Here is our equation through A and B. It uses A as the starting point and A B as the direction.",
        "math": "\\[\\vec r=[1,4]+t[2,-3]\\]"
      },
      {
        "text": "B also lies on the line, so we can start at B instead. This equation reaches A when u is negative one. A different starting point does not change the line if the direction stays parallel.",
        "math": "\\[\\vec r=[3,1]+u[2,-3]\\]"
      },
      {
        "text": "We can reverse the direction too. The new direction is negative one times the old direction. A line extends both ways, so this still reaches the same set of points.",
        "math": "\\[\\vec r=[1,4]+v[-2,3]\\]"
      },
      {
        "text": "Or double the direction. Each parameter step is now twice as large, but the line itself stays the same. The parameter reaching a particular point can change.",
        "math": "\\[\\vec r=[1,4]+w[4,-6]\\]"
      },
      {
        "text": "In general, choose any starting point on the line and any nonzero multiple of its direction. There are infinitely many choices. These are infinitely many equations describing one line.",
        "math": "\\[\\vec r=([1,4]+a[2,-3])+s\\bigl(k[2,-3]\\bigr),\\quad a\\in\\mathbb R,\\ k\\ne0\\]"
      }
    ],
    "given": "\\[\\vec r=[1,4]+t[2,-3]\\]"
  },
  {
    "id": "slide-20",
    "section": "8.1",
    "title": "Three additional points",
    "explanation": "Use t = −1, 2, and 3. The value t = 1 already returns B.",
    "notes": "Let's find three additional points. Use x equals one plus two t, and y equals four minus three t. Zero already gives A, and one already gives B, so choose other values.\n\nAt negative one, the point is negative one comma seven. At two, it is five comma negative two. At three, it is seven comma negative five. Plot these points. They all lie on the same straight line because we used one parameter consistently.",
    "steps": [
      {
        "text": "Let's find three additional points. Use x equals one plus two t, and y equals four minus three t. Zero already gives A, and one already gives B, so choose other values.",
        "math": "\\[x=1+2t,\\qquad y=4-3t\\]"
      },
      {
        "text": "At negative one, the point is negative one comma seven. At two, it is five comma negative two. At three, it is seven comma negative five. Plot these points. They all lie on the same straight line because we used one parameter consistently."
      },
      {
        "text": "Use the same parameter in every coordinate.",
        "math": "\\[\\begin{array}{cc}\\text{t} & \\text{Point}\\\\\\hline -1 & (-1, 7)\\\\2 & (5, -2)\\\\3 & (7, -5)\\end{array}\\]"
      }
    ],
    "given": "\\[x=1+2t,\\qquad y=4-3t\\]",
    "demo": "two-points"
  },
  {
    "id": "slide-21",
    "section": "8.1",
    "title": "Practice 2  A point on the line",
    "explanation": "Does Q(2, 3) lie on this line? Justify your answer.",
    "notes": "Does Q, two comma three, lie on this line? Its coordinates are already fixed, so we need one value of t that produces both of them. Work out the t required by x, then compare it with the t required by y. Pause and try it.",
    "steps": [],
    "given": "\\[\\vec r=[1,4]+t[2,-3]\\]",
    "practice": true,
    "questionOnly": true
  },
  {
    "id": "slide-22",
    "section": "8.1",
    "title": "Practice 2  Solution",
    "explanation": "The two coordinates require different parameter values.",
    "notes": "Write the coordinate equations separately. We are checking whether one t can make x equal two and y equal three at the same time.\n\nStart with x. Two equals one plus two t. Subtract one and divide by two. This requires t to be one-half.\n\nNow use y. Three equals four minus three t. Subtract four and divide by negative three. This requires t to be one-third.\n\nThose values disagree. We can get the required x, or the required y, but not together at one parameter value. So Q is not on the line.",
    "steps": [
      {
        "text": "Write the coordinate equations separately. We are checking whether one t can make x equal two and y equal three at the same time.",
        "math": "\\[x=1+2t,\\qquad y=4-3t\\]"
      },
      {
        "text": "Start with x. Two equals one plus two t. Subtract one and divide by two. This requires t to be one-half.",
        "math": "\\[x=2:\\quad2=1+2t\\quad\\Longrightarrow\\quad t=\\frac12\\]"
      },
      {
        "text": "Now use y. Three equals four minus three t. Subtract four and divide by negative three. This requires t to be one-third.",
        "math": "\\[y=3:\\quad3=4-3t\\quad\\Longrightarrow\\quad t=\\frac13\\]"
      },
      {
        "text": "Those values disagree. We can get the required x, or the required y, but not together at one parameter value. So Q is not on the line.",
        "math": "\\[\\frac12\\ne\\frac13\\quad\\Longrightarrow\\quad Q(2,3)\\notin L\\]"
      }
    ],
    "given": "\\[x=1+2t,\\qquad y=4-3t\\]"
  },
  {
    "id": "slide-23",
    "section": "8.1",
    "title": "Vector to parametric to symmetric form",
    "explanation": "Convert one representation at a time using the same line.",
    "notes": "Let’s convert the line through A and B between forms. Start with the vector equation. We already know its point and direction.\n\nRead the first and second components separately. That gives the parametric equations.\n\nMake t the subject in each equation. Subtract the starting coordinate, then divide by the nonzero direction component.\n\nBoth expressions equal t, so set them equal to each other. That gives symmetric form. The minus sign in the y denominator belongs to the direction.",
    "steps": [
      {
        "text": "Let’s convert the line through A and B between forms. Start with the vector equation. We already know its point and direction.",
        "math": "\\[\\vec r=[1,4]+t[2,-3]\\]"
      },
      {
        "text": "Read the first and second components separately. That gives the parametric equations.",
        "math": "\\[x=1+2t,\\qquad y=4-3t\\]"
      },
      {
        "text": "Make t the subject in each equation. Subtract the starting coordinate, then divide by the nonzero direction component.",
        "math": "\\[\\frac{x-1}{2}=t,\\qquad\\frac{y-4}{-3}=t\\]"
      },
      {
        "text": "Both expressions equal t, so set them equal to each other. That gives symmetric form. The minus sign in the y denominator belongs to the direction.",
        "math": "\\[\\frac{x-1}{2}=\\frac{y-4}{-3}\\]"
      }
    ],
    "given": "\\[\\vec r=[1,4]+t[2,-3]\\]"
  },
  {
    "id": "slide-24",
    "section": "8.1",
    "title": "Symmetric to parametric to vector form",
    "explanation": "Give the common fraction a parameter, then rearrange.",
    "notes": "Now work backwards from symmetric form. We want to recover the coordinate equations and then vector form.\n\nCall the common value s. Both fractions must equal that same value. The letter is just the name of our parameter.\n\nMultiply by each denominator and add the starting coordinate. We get x equals one plus two s, and y equals four minus three s.\n\nGroup the constant components into a starting vector and the coefficients of s into the direction. We recover the same vector equation, with a different parameter name.",
    "steps": [
      {
        "text": "Now work backwards from symmetric form. We want to recover the coordinate equations and then vector form.",
        "math": "\\[\\frac{x-1}{2}=\\frac{y-4}{-3}\\]"
      },
      {
        "text": "Call the common value s. Both fractions must equal that same value. The letter is just the name of our parameter.",
        "math": "\\[\\frac{x-1}{2}=s,\\qquad\\frac{y-4}{-3}=s\\]"
      },
      {
        "text": "Multiply by each denominator and add the starting coordinate. We get x equals one plus two s, and y equals four minus three s.",
        "math": "\\[x=1+2s,\\qquad y=4-3s\\]"
      },
      {
        "text": "Group the constant components into a starting vector and the coefficients of s into the direction. We recover the same vector equation, with a different parameter name.",
        "math": "\\[\\vec r=[1,4]+s[2,-3]\\]"
      }
    ],
    "given": "\\[\\frac{x-1}{2}=\\frac{y-4}{-3}\\]"
  },
  {
    "id": "slide-25",
    "section": "8.3",
    "title": "A zero component in space",
    "explanation": "P(−2, 3, 5) and Q(−2, 4, −1) have the same x-coordinate.",
    "notes": "These two points have the same x-coordinate. Let's see what that does to the direction vector. Subtract P from Q.\n\nThe direction is zero comma one comma negative six. The zero x-component comes from subtracting equal x-coordinates.\n\nUse P as the starting point and add t times that direction.\n\nRead the coordinate equations. X stays at negative two. Y and z change with t. A fixed coordinate still allows a line because the other coordinates can vary.",
    "steps": [
      {
        "text": "These two points have the same x-coordinate. Let's see what that does to the direction vector. Subtract P from Q.",
        "math": "\\[\\overrightarrow{PQ}=[-2-(-2),4-3,-1-5]\\]"
      },
      {
        "text": "The direction is zero comma one comma negative six. The zero x-component comes from subtracting equal x-coordinates.",
        "math": "\\[\\overrightarrow{PQ}=[0,1,-6]\\]"
      },
      {
        "text": "Use P as the starting point and add t times that direction.",
        "math": "\\[\\vec r=[-2,3,5]+t[0,1,-6]\\]"
      },
      {
        "text": "Read the coordinate equations. X stays at negative two. Y and z change with t. A fixed coordinate still allows a line because the other coordinates can vary.",
        "math": "\\[x=-2+0t=-2,\\quad y=3+t,\\quad z=5-6t\\]"
      }
    ],
    "given": "\\[\\overrightarrow{PQ}=[-2-(-2),4-3,-1-5]\\]"
  },
  {
    "id": "slide-26",
    "section": "8.3",
    "title": "The fixed coordinate in symmetric form",
    "explanation": "Use nonzero components as denominators and keep x separate.",
    "notes": "We want symmetric form, but the x direction is zero. Keep x equals negative two as its own equation.\n\nMake t the subject of the y and z equations using their nonzero direction components.\n\nEquate those expressions and retain the separate x condition. Every part belongs in the answer. Division by a zero direction component would be undefined.\n\nCheck t equals one. Starting at P and adding one direction vector returns Q. This confirms both the varying coordinates and the fixed x-coordinate.",
    "steps": [
      {
        "text": "We want symmetric form, but the x direction is zero. Keep x equals negative two as its own equation.",
        "math": "\\[x=-2,\\quad y=3+t,\\quad z=5-6t\\]"
      },
      {
        "text": "Make t the subject of the y and z equations using their nonzero direction components.",
        "math": "\\[t=\\frac{y-3}{1},\\qquad t=\\frac{z-5}{-6}\\]"
      },
      {
        "text": "Equate those expressions and retain the separate x condition. Every part belongs in the answer. Division by a zero direction component would be undefined.",
        "math": "\\[x=-2,\\qquad\\frac{y-3}{1}=\\frac{z-5}{-6}\\]"
      },
      {
        "text": "Check t equals one. Starting at P and adding one direction vector returns Q. This confirms both the varying coordinates and the fixed x-coordinate.",
        "math": "\\[t=1:\\quad[-2,3,5]+[0,1,-6]=[-2,4,-1]\\]"
      }
    ],
    "given": "\\[x=-2,\\quad y=3+t,\\quad z=5-6t\\]"
  },
  {
    "id": "slide-27",
    "section": "8.3",
    "title": "Two zero direction components in space",
    "explanation": "Keep both fixed coordinates. Let the remaining coordinate vary.",
    "notes": "What if two direction components are zero? The direction zero comma zero comma four is still nonzero, so it defines a line.\n\nX stays one and y stays two. Only z changes with the parameter.\n\nWhen we remove the parameter, keep x equals one and y equals two together. Z is unrestricted. There is no fraction chain with zero denominators.\n\nThis is a line parallel to the z-axis. If all three direction components were zero, the equation would produce only one point instead of a line.",
    "steps": [
      {
        "text": "What if two direction components are zero? The direction zero comma zero comma four is still nonzero, so it defines a line.",
        "math": "\\[\\vec r=[1,2,3]+t[0,0,4]\\]"
      },
      {
        "text": "X stays one and y stays two. Only z changes with the parameter.",
        "math": "\\[x=1,\\quad y=2,\\quad z=3+4t\\]"
      },
      {
        "text": "When we remove the parameter, keep x equals one and y equals two together. Z is unrestricted. There is no fraction chain with zero denominators.",
        "math": "\\[x=1,\\quad y=2,\\quad z\\in\\mathbb R\\]"
      },
      {
        "text": "This is a line parallel to the z-axis. If all three direction components were zero, the equation would produce only one point instead of a line.",
        "math": "\\[\\text{One line parallel to the z-axis}\\]"
      }
    ],
    "given": "\\[\\vec r=[1,2,3]+t[0,0,4]\\]"
  },
  {
    "id": "slide-28",
    "section": "8.3",
    "title": "Practice 3  A line in space",
    "explanation": "Find vector, parametric, and symmetric equations through R and S.",
    "notes": "Try the three-dimensional version. The line passes through R and S. Find vector, parametric, and symmetric forms. Simplify the direction first, and watch for a fixed coordinate. Pause and attempt all three forms.",
    "steps": [],
    "given": "\\[R(3,-1,2),\\qquad S(3,2,-4)\\]",
    "practice": true,
    "questionOnly": true
  },
  {
    "id": "slide-29",
    "section": "8.3",
    "title": "Practice 3  Solution",
    "explanation": "Simplifying a direction can change the parameter assigned to a point.",
    "notes": "Subtract R from S. We get zero comma three comma negative six. Divide the direction by three to use zero comma one comma negative two. This keeps the same line direction.\n\nStart at R and add t times that simpler direction.\n\nRead the coordinate equations. X is three, y is negative one plus t, and z is two minus two t.\n\nKeep x equals three separately in symmetric form. Equate the two expressions for t from y and z.\n\nCheck S using t equals three. Three smaller direction steps now reach S. Simplifying the direction changed the parameter assigned to S, while preserving the line.",
    "steps": [
      {
        "text": "Subtract R from S. We get zero comma three comma negative six. Divide the direction by three to use zero comma one comma negative two. This keeps the same line direction.",
        "math": "\\[\\overrightarrow{RS}=[3-3,2-(-1),-4-2]=[0,3,-6]=3[0,1,-2]\\]"
      },
      {
        "text": "Start at R and add t times that simpler direction.",
        "math": "\\[\\vec r=[3,-1,2]+t[0,1,-2]\\]"
      },
      {
        "text": "Read the coordinate equations. X is three, y is negative one plus t, and z is two minus two t.",
        "math": "\\[x=3,\\qquad y=-1+t,\\qquad z=2-2t\\]"
      },
      {
        "text": "Keep x equals three separately in symmetric form. Equate the two expressions for t from y and z.",
        "math": "\\[x=3,\\qquad\\frac{y+1}{1}=\\frac{z-2}{-2}\\]"
      },
      {
        "text": "Check S using t equals three. Three smaller direction steps now reach S. Simplifying the direction changed the parameter assigned to S, while preserving the line.",
        "math": "\\[t=3:\\quad[3,-1,2]+3[0,1,-2]=[3,2,-4]\\]"
      }
    ],
    "given": "\\[\\overrightarrow{RS}=[3-3,2-(-1),-4-2]=[0,3,-6]=3[0,1,-2]\\]"
  },
  {
    "id": "slide-30",
    "section": "8.1",
    "title": "Coincident and distinct parallel lines",
    "explanation": "First compare directions, then test a starting point.",
    "notes": "Two different-looking equations may describe the same line. First compare their directions. Nonzero scalar multiples give parallel directions.\n\nIf the lines also share a point, they coincide. They are one geometric line, so every point on one belongs to the other.\n\nIf the directions are parallel but a starting point fails the other line’s complete coordinate check, they are distinct parallel lines. Distinct simply means different. Nonparallel intersections and skew lines will be studied in the intersections video.",
    "steps": [
      {
        "text": "Two different-looking equations may describe the same line. First compare their directions. Nonzero scalar multiples give parallel directions.",
        "math": "\\[\\vec m_2=k\\vec m_1,\\qquad k\\ne0\\]"
      },
      {
        "text": "If the lines also share a point, they coincide. They are one geometric line, so every point on one belongs to the other.",
        "math": "\\[\\text{Parallel directions and a shared point: coincident lines}\\]"
      },
      {
        "text": "If the directions are parallel but a starting point fails the other line’s complete coordinate check, they are distinct parallel lines. Distinct simply means different. Nonparallel intersections and skew lines will be studied in the intersections video.",
        "math": "\\[\\text{Parallel directions and no shared point: distinct parallel lines}\\]"
      }
    ],
    "given": "\\[\\vec m_2=k\\vec m_1,\\qquad k\\ne0\\]"
  },
  {
    "id": "slide-31",
    "section": "8.1",
    "title": "An x-intercept",
    "explanation": "E(−1, 5) and F(6, 11). At the x-intercept, y = 0.",
    "notes": "For this example, the line passes through E and F. First find a direction using F minus E. Six minus negative one gives seven, and eleven minus five gives six.\n\nUse E as the starting point and read the coordinate equations. At an x-intercept, the point lies on the x-axis, so its y-coordinate is zero.\n\nSet the y equation equal to zero. Subtract five, then divide by six. The parameter is negative five-sixths.\n\nUse that same parameter in the x equation. Convert negative one to negative six over six, then combine the fractions. This gives negative forty-one over six.\n\nSo the x-intercept is negative forty-one over six comma zero. The zero y-coordinate is the check that it lies on the x-axis. Keep the exact fraction.",
    "steps": [
      {
        "text": "For this example, the line passes through E and F. First find a direction using F minus E. Six minus negative one gives seven, and eleven minus five gives six.",
        "math": "\\[\\overrightarrow{EF}=[6-(-1),11-5]=[7,6]\\]"
      },
      {
        "text": "Use E as the starting point and read the coordinate equations. At an x-intercept, the point lies on the x-axis, so its y-coordinate is zero.",
        "math": "\\[x=-1+7t,\\qquad y=5+6t\\]"
      },
      {
        "text": "Set the y equation equal to zero. Subtract five, then divide by six. The parameter is negative five-sixths.",
        "math": "\\[0=5+6t\\quad\\Longrightarrow\\quad-5=6t\\quad\\Longrightarrow\\quad t=-\\frac56\\]"
      },
      {
        "text": "Use that same parameter in the x equation. Convert negative one to negative six over six, then combine the fractions. This gives negative forty-one over six.",
        "math": "\\[x=-1+7\\left(-\\frac56\\right)=-\\frac66-\\frac{35}{6}=-\\frac{41}{6}\\]"
      },
      {
        "text": "So the x-intercept is negative forty-one over six comma zero. The zero y-coordinate is the check that it lies on the x-axis. Keep the exact fraction.",
        "math": "\\[\\text{x-intercept}:\\quad\\left(-\\frac{41}{6},0\\right)\\]"
      }
    ],
    "given": "\\[\\overrightarrow{EF}=[6-(-1),11-5]=[7,6]\\]"
  },
  {
    "id": "slide-32",
    "section": "8.1",
    "title": "Equivalent vector equations",
    "explanation": "Parallel directions and a shared point establish the same line.",
    "notes": "Here is the line from the last example. Can a different-looking vector equation describe this same line?\n\nThe second equation has a different starting point and direction vector. Compare the directions first, then check whether the lines share a point.\n\nThe second direction is two-thirds of the first. That gives parallel directions. We still need to check their locations.\n\nTest the second starting point in the first equation. Using x gives negative one plus seven t equals negative fifteen, so t is negative two.\n\nSubstitute negative two into both components. We get negative fifteen comma negative seven, exactly the second starting point. Parallel directions and a shared point show that these are the same line.",
    "steps": [
      {
        "text": "Here is the line from the last example. Can a different-looking vector equation describe this same line?",
        "math": "\\[\\vec r=[-1,5]+t[7,6]\\]"
      },
      {
        "text": "The second equation has a different starting point and direction vector. Compare the directions first, then check whether the lines share a point.",
        "math": "\\[\\vec r=[-15,-7]+s\\left[\\frac{14}{3},4\\right]\\]"
      },
      {
        "text": "The second direction is two-thirds of the first. That gives parallel directions. We still need to check their locations.",
        "math": "\\[\\left[\\frac{14}{3},4\\right]=\\frac23[7,6]\\]"
      },
      {
        "text": "Test the second starting point in the first equation. Using x gives negative one plus seven t equals negative fifteen, so t is negative two.",
        "math": "\\[-1+7t=-15\\quad\\Longrightarrow\\quad t=-2\\]"
      },
      {
        "text": "Substitute negative two into both components. We get negative fifteen comma negative seven, exactly the second starting point. Parallel directions and a shared point show that these are the same line.",
        "math": "\\[[-1,5]-2[7,6]=[-15,-7]\\quad\\Longrightarrow\\quad\\text{same line}\\]"
      }
    ],
    "given": "\\[\\vec r=[-1,5]+t[7,6]\\]"
  },
  {
    "id": "slide-33",
    "section": "8.3",
    "title": "Coincident lines in space",
    "explanation": "Compare directions and test an anchor using one parameter.",
    "notes": "Let's compare two lines in space. Begin with the first line and identify its starting point and direction.\n\nNow look at the second line. As before, compare directions, then test a point. This time all three coordinates must agree.\n\nThe second direction is twice the first, so their directions are parallel.\n\nTest the second starting point in the first line. The x equation gives negative one minus s equals four. So s is negative five.\n\nUse negative five in every component. We get four comma negative ten comma negative twenty-one, exactly the second starting point. The lines have parallel directions and a shared point, so they coincide.",
    "steps": [
      {
        "text": "Let's compare two lines in space. Begin with the first line and identify its starting point and direction.",
        "math": "\\[L_1:\\vec r=[-1,0,4]+s[-1,2,5]\\]"
      },
      {
        "text": "Now look at the second line. As before, compare directions, then test a point. This time all three coordinates must agree.",
        "math": "\\[L_2:\\vec r=[4,-10,-21]+u[-2,4,10]\\]"
      },
      {
        "text": "The second direction is twice the first, so their directions are parallel.",
        "math": "\\[[-2,4,10]=2[-1,2,5]\\]"
      },
      {
        "text": "Test the second starting point in the first line. The x equation gives negative one minus s equals four. So s is negative five.",
        "math": "\\[-1-s=4\\quad\\Longrightarrow\\quad s=-5\\]"
      },
      {
        "text": "Use negative five in every component. We get four comma negative ten comma negative twenty-one, exactly the second starting point. The lines have parallel directions and a shared point, so they coincide.",
        "math": "\\[[-1,0,4]-5[-1,2,5]=[4,-10,-21]\\quad\\Longrightarrow\\quad L_1=L_2\\]"
      }
    ],
    "given": "\\[L_1:\\vec r=[-1,0,4]+s[-1,2,5]\\]"
  },
  {
    "id": "slide-34",
    "section": "8.3",
    "title": "Practice 4  Same line or separate",
    "explanation": "Determine the relationship. Explain both checks.",
    "notes": "Are these lines the same, or are they separate parallel lines? Compare their directions, then test the second starting point in the first line. Carry one parameter through x, y, and z. Pause and give a reason for your conclusion.",
    "steps": [],
    "given": "\\[L_3:\\vec r=[1,6,1]+t[-1,1,2]\\]\n\\[L_4:\\vec r=[-3,10,12]+k\\left[\\frac12,-\\frac12,-1\\right]\\]",
    "practice": true,
    "questionOnly": true
  },
  {
    "id": "slide-35",
    "section": "8.3",
    "title": "Practice 4  Solution",
    "explanation": "The directions are parallel, but the anchor fails the z-coordinate test.",
    "notes": "The second direction is negative one-half of the first. So the directions are parallel, although they point opposite ways.\n\nTest the second starting point using the first line. From x, one minus t equals negative three, so t is four.\n\nUse four in y and z. Y becomes ten, which matches. Z becomes nine.\n\nThe required z-coordinate is twelve. The candidate point therefore fails the full point check.\n\nSo these are distinct parallel lines. Checking x and y alone would have produced the wrong conclusion.",
    "steps": [
      {
        "text": "The second direction is negative one-half of the first. So the directions are parallel, although they point opposite ways.",
        "math": "\\[\\left[\\frac12,-\\frac12,-1\\right]=-\\frac12[-1,1,2]\\]"
      },
      {
        "text": "Test the second starting point using the first line. From x, one minus t equals negative three, so t is four.",
        "math": "\\[1-t=-3\\quad\\Longrightarrow\\quad t=4\\]"
      },
      {
        "text": "Use four in y and z. Y becomes ten, which matches. Z becomes nine.",
        "math": "\\[y=6+4=10,\\qquad z=1+2(4)=9\\]"
      },
      {
        "text": "The required z-coordinate is twelve. The candidate point therefore fails the full point check.",
        "math": "\\[[-3,10,9]\\ne[-3,10,12]\\]"
      },
      {
        "text": "So these are distinct parallel lines. Checking x and y alone would have produced the wrong conclusion.",
        "math": "\\[\\text{The lines are distinct and parallel.}\\]"
      }
    ],
    "given": "\\[\\left[\\frac12,-\\frac12,-1\\right]=-\\frac12[-1,1,2]\\]"
  },
  {
    "id": "slide-36",
    "section": "8.3",
    "title": "Practice 5  A final check",
    "explanation": "Does A(5, 0, 11) lie on L? Does M describe the same line?",
    "notes": "Let's combine the ideas. First decide whether A, five comma zero comma eleven, lies on L. Then decide whether M describes that same line. Find one parameter that works in all three coordinates, and use the result in your line comparison. Pause and try both parts.",
    "steps": [],
    "given": "\\[L:\\vec r=[1,2,3]+t[2,-1,4]\\]\n\\[M:\\vec r=[5,0,11]+s[-4,2,-8]\\]",
    "practice": true,
    "questionOnly": true
  },
  {
    "id": "slide-37",
    "section": "8.3",
    "title": "Practice 5  Solution",
    "explanation": "A shared point and parallel directions give the same line.",
    "notes": "Use the x-coordinate of A. One plus two t equals five, so t is two.\n\nSubstitute two everywhere in L. The point is five comma zero comma eleven. All three coordinates agree, so A lies on L.\n\nCompare the directions. The direction of M is negative two times the direction of L, so they are parallel.\n\nM starts at A, and A lies on L. Therefore the two lines share a point and have parallel directions. They describe the same line.",
    "steps": [
      {
        "text": "Use the x-coordinate of A. One plus two t equals five, so t is two.",
        "math": "\\[1+2t=5\\quad\\Longrightarrow\\quad t=2\\]"
      },
      {
        "text": "Substitute two everywhere in L. The point is five comma zero comma eleven. All three coordinates agree, so A lies on L.",
        "math": "\\[t=2:\\quad[1,2,3]+2[2,-1,4]=[5,0,11]\\]"
      },
      {
        "text": "Compare the directions. The direction of M is negative two times the direction of L, so they are parallel.",
        "math": "\\[[-4,2,-8]=-2[2,-1,4]\\]"
      },
      {
        "text": "M starts at A, and A lies on L. Therefore the two lines share a point and have parallel directions. They describe the same line.",
        "math": "\\[A\\in L,\\qquad M=L\\]"
      }
    ],
    "given": "\\[1+2t=5\\quad\\Longrightarrow\\quad t=2\\]"
  },
  {
    "id": "slide-38",
    "section": "8.2",
    "title": "Section 8.2  Scalar forms in two dimensions",
    "explanation": "Slope-intercept, point-slope and Cartesian forms describe the same line.",
    "notes": "Begin Section eight point two by connecting the scalar forms you already know. Point-slope form uses a known point and a finite slope. Here m is the scalar slope, not the vector with an arrow.\n\nFor a line through five comma three with slope two, substitute those values into point-slope form.\n\nExpand and rearrange. The slope-intercept equation is y equals two x minus seven.\n\nMove every term to one side. We get two x minus y minus seven equals zero. This is Cartesian or standard form, A x plus B y plus C equals zero. A and B cannot both be zero.",
    "steps": [
      {
        "text": "Begin Section eight point two by connecting the scalar forms you already know. Point-slope form uses a known point and a finite slope. Here m is the scalar slope, not the vector with an arrow.",
        "math": "\\[y-y_1=m(x-x_1)\\]"
      },
      {
        "text": "For a line through five comma three with slope two, substitute those values into point-slope form.",
        "math": "\\[y-3=2(x-5)\\]"
      },
      {
        "text": "Expand and rearrange. The slope-intercept equation is y equals two x minus seven.",
        "math": "\\[y=2x-7\\]"
      },
      {
        "text": "Move every term to one side. We get two x minus y minus seven equals zero. This is Cartesian or standard form, A x plus B y plus C equals zero. A and B cannot both be zero.",
        "math": "\\[2x-y-7=0\\]"
      }
    ],
    "given": "\\[y-y_1=m(x-x_1)\\]"
  },
  {
    "id": "slide-39",
    "section": "8.2",
    "title": "Direction vectors and normal vectors",
    "explanation": "A direction runs along the line. A normal is perpendicular to it in two dimensions.",
    "notes": "We are now moving into Section eight point two. A direction vector runs along a line. A normal vector points perpendicular to it. Their dot product is zero.\n\nIn two dimensions, we can get a normal by swapping the two direction components and changing the sign of one. The dot product cancels to zero. Any nonzero scalar multiple is also a valid normal.\n\nFor direction negative three comma two, we can use normal two comma three. The dot product is negative six plus six, which is zero. Later we will use the normal to build Cartesian equations and perpendicular lines.",
    "steps": [
      {
        "text": "We are now moving into Section eight point two. A direction vector runs along a line. A normal vector points perpendicular to it. Their dot product is zero.",
        "math": "\\[\\vec m\\cdot\\vec n=0\\]"
      },
      {
        "text": "In two dimensions, we can get a normal by swapping the two direction components and changing the sign of one. The dot product cancels to zero. Any nonzero scalar multiple is also a valid normal.",
        "math": "\\[\\vec m=[a,b]\\quad\\Rightarrow\\quad\\vec n=[b,-a]\\]"
      },
      {
        "text": "For direction negative three comma two, we can use normal two comma three. The dot product is negative six plus six, which is zero. Later we will use the normal to build Cartesian equations and perpendicular lines.",
        "math": "\\[[-3,2]\\cdot[2,3]=-6+6=0\\]"
      }
    ],
    "given": "\\[\\vec m\\cdot\\vec n=0\\]"
  },
  {
    "id": "slide-40",
    "section": "8.2",
    "title": "Why the coefficients give a normal",
    "explanation": "A normal is perpendicular to every displacement along the line.",
    "notes": "Let's connect a normal vector to Cartesian form. A normal is perpendicular to the line. Choose a known point P zero and any point P on the line. Their displacement lies along the line.\n\nThe normal and that displacement are perpendicular, so their dot product is zero. This is the reason behind the equation.\n\nExpand the dot product one component at a time. A multiplies the change in x, and B multiplies the change in y.\n\nExpand the brackets. Now the variable terms are A x and B y, and the remaining terms are constants.\n\nGroup those constants into C. We get A x plus B y plus C equals zero. That is why the coefficients A and B give a normal vector. They cannot both be zero.",
    "steps": [
      {
        "text": "Let's connect a normal vector to Cartesian form. A normal is perpendicular to the line. Choose a known point P zero and any point P on the line. Their displacement lies along the line.",
        "math": "\\[\\vec n=[A,B],\\qquad\\overrightarrow{P_0P}=[x-x_0,y-y_0]\\]"
      },
      {
        "text": "The normal and that displacement are perpendicular, so their dot product is zero. This is the reason behind the equation.",
        "math": "\\[\\vec n\\cdot\\overrightarrow{P_0P}=0\\]"
      },
      {
        "text": "Expand the dot product one component at a time. A multiplies the change in x, and B multiplies the change in y.",
        "math": "\\[A(x-x_0)+B(y-y_0)=0\\]"
      },
      {
        "text": "Expand the brackets. Now the variable terms are A x and B y, and the remaining terms are constants.",
        "math": "\\[Ax+By-Ax_0-By_0=0\\]"
      },
      {
        "text": "Group those constants into C. We get A x plus B y plus C equals zero. That is why the coefficients A and B give a normal vector. They cannot both be zero.",
        "math": "\\[Ax+By+C=0,\\quad C=-Ax_0-By_0\\]"
      }
    ],
    "given": "\\[\\vec n=[A,B],\\qquad\\overrightarrow{P_0P}=[x-x_0,y-y_0]\\]"
  },
  {
    "id": "slide-41",
    "section": "8.2",
    "title": "Cartesian form and a normal",
    "explanation": "The x and y coefficients give a nonzero normal to the line.",
    "notes": "Let's use the point four comma negative two and normal five comma three. The normal tells us the coefficients of x and y.\n\nWrite five x plus three y plus C equals zero. The only unknown coefficient is C.\n\nThe given point lies on the line, so substitute its coordinates into that equation.\n\nTwenty minus six is fourteen. To make the total zero, C must be negative fourteen.\n\nPut that value back into the equation. We get five x plus three y minus fourteen equals zero. Substituting the original point gives zero, so the point check works.",
    "steps": [
      {
        "text": "Let's use the point four comma negative two and normal five comma three. The normal tells us the coefficients of x and y.",
        "math": "\\[\\vec n=[5,3],\\qquad P_0(4,-2)\\]"
      },
      {
        "text": "Write five x plus three y plus C equals zero. The only unknown coefficient is C.",
        "math": "\\[5x+3y+C=0\\]"
      },
      {
        "text": "The given point lies on the line, so substitute its coordinates into that equation.",
        "math": "\\[5(4)+3(-2)+C=0\\]"
      },
      {
        "text": "Twenty minus six is fourteen. To make the total zero, C must be negative fourteen.",
        "math": "\\[20-6+C=0\\quad\\Longrightarrow\\quad C=-14\\]"
      },
      {
        "text": "Put that value back into the equation. We get five x plus three y minus fourteen equals zero. Substituting the original point gives zero, so the point check works.",
        "math": "\\[5x+3y-14=0\\]"
      }
    ],
    "given": "\\[\\vec n=[5,3],\\qquad P_0(4,-2)\\]"
  },
  {
    "id": "slide-42",
    "section": "8.2",
    "title": "Practice 6  A normal and a point",
    "explanation": "Find a Cartesian equation through (1, 4) with normal [2, −3].",
    "notes": "Your turn. Find a Cartesian equation through one comma four with normal two comma negative three. Use the normal as the coefficients, then substitute the point to find the constant. Pause before checking the solution.",
    "steps": [],
    "given": "\\[P(1,4),\\qquad\\vec n=[2,-3]\\]",
    "practice": true,
    "questionOnly": true
  },
  {
    "id": "slide-43",
    "section": "8.2",
    "title": "Practice 6  Solution",
    "explanation": "Substitute the point to determine C.",
    "notes": "The normal gives two x minus three y. Add an unknown constant C and set the expression equal to zero.\n\nSubstitute the given point. Two times one minus three times four plus C must be zero.\n\nThat gives negative ten plus C equals zero, so C is ten.\n\nOur equation is two x minus three y plus ten equals zero.\n\nCheck the original point. Two minus twelve plus ten is zero. The equation has the required normal and passes through the required point.",
    "steps": [
      {
        "text": "The normal gives two x minus three y. Add an unknown constant C and set the expression equal to zero.",
        "math": "\\[2x-3y+C=0\\]"
      },
      {
        "text": "Substitute the given point. Two times one minus three times four plus C must be zero.",
        "math": "\\[2(1)-3(4)+C=0\\]"
      },
      {
        "text": "That gives negative ten plus C equals zero, so C is ten.",
        "math": "\\[-10+C=0\\quad\\Longrightarrow\\quad C=10\\]"
      },
      {
        "text": "Our equation is two x minus three y plus ten equals zero.",
        "math": "\\[2x-3y+10=0\\]"
      },
      {
        "text": "Check the original point. Two minus twelve plus ten is zero. The equation has the required normal and passes through the required point.",
        "math": "\\[2(1)-3(4)+10=0\\]"
      }
    ],
    "given": "\\[2x-3y+C=0\\]"
  },
  {
    "id": "slide-44",
    "section": "8.2",
    "title": "A perpendicular line in two dimensions",
    "explanation": "Find the line through P(6, 5) perpendicular to the given line.",
    "notes": "We want a line through six comma five that is perpendicular to the given line. The given direction is negative three comma two. We need a direction perpendicular to that.\n\nCall our new direction a comma b. Perpendicular directions have a zero dot product, so negative three a plus two b must equal zero.\n\nA convenient choice is a equals two and b equals three. Check it: negative six plus six is zero.\n\nUse the required point and the new direction. This gives the perpendicular line. We have checked its direction and used the correct point to fix its location.",
    "steps": [
      {
        "text": "We want a line through six comma five that is perpendicular to the given line. The given direction is negative three comma two. We need a direction perpendicular to that.",
        "math": "\\[\\vec r=[4,1]+s[-3,2]\\]"
      },
      {
        "text": "Call our new direction a comma b. Perpendicular directions have a zero dot product, so negative three a plus two b must equal zero.",
        "math": "\\[[-3,2]\\cdot[a,b]=-3a+2b=0\\]"
      },
      {
        "text": "A convenient choice is a equals two and b equals three. Check it: negative six plus six is zero.",
        "math": "\\[a=2,\\quad b=3:\\quad-3(2)+2(3)=0\\]"
      },
      {
        "text": "Use the required point and the new direction. This gives the perpendicular line. We have checked its direction and used the correct point to fix its location.",
        "math": "\\[\\vec r=[6,5]+t[2,3]\\]"
      }
    ],
    "given": "\\[\\vec r=[4,1]+s[-3,2]\\]"
  },
  {
    "id": "slide-45",
    "section": "8.2",
    "title": "Cartesian to vector and parametric forms",
    "explanation": "Read a normal, choose a perpendicular direction, then find a point.",
    "notes": "Let’s convert directly from Cartesian form. The coefficients two and negative three give a normal vector. They are not the direction of the line.\n\nChoose a direction perpendicular to that normal. Three comma two works because their dot product is six minus six, which is zero.\n\nWe also need a point. Set x to zero and solve. Y is two, so zero comma two is a convenient starting point.\n\nPut the point and direction into vector form, then read the parametric equations.\n\nCheck by substituting the parametric equations into the original Cartesian equation. The t terms cancel and the constants cancel. Every point generated is on the original line.",
    "steps": [
      {
        "text": "Let’s convert directly from Cartesian form. The coefficients two and negative three give a normal vector. They are not the direction of the line.",
        "math": "\\[2x-3y+6=0:\\quad\\vec n=[2,-3]\\]"
      },
      {
        "text": "Choose a direction perpendicular to that normal. Three comma two works because their dot product is six minus six, which is zero.",
        "math": "\\[\\vec m=[3,2],\\quad[2,-3]\\cdot[3,2]=0\\]"
      },
      {
        "text": "We also need a point. Set x to zero and solve. Y is two, so zero comma two is a convenient starting point.",
        "math": "\\[x=0:\\quad-3y+6=0\\quad\\Rightarrow\\quad P(0,2)\\]"
      },
      {
        "text": "Put the point and direction into vector form, then read the parametric equations.",
        "math": "\\[\\vec r=[0,2]+t[3,2],\\quad x=3t,\\ y=2+2t\\]"
      },
      {
        "text": "Check by substituting the parametric equations into the original Cartesian equation. The t terms cancel and the constants cancel. Every point generated is on the original line.",
        "math": "\\[2(3t)-3(2+2t)+6=0\\]"
      }
    ],
    "given": "\\[2x-3y+6=0:\\quad\\vec n=[2,-3]\\]"
  },
  {
    "id": "slide-46",
    "section": "8.2",
    "title": "Vector and parametric to Cartesian form",
    "explanation": "Eliminate the shared parameter and check the normal.",
    "notes": "Now convert the other way. The vector equation gives a starting point and direction.\n\nRead the component equations using the same parameter in x and y.\n\nMake t the subject of each equation and set the results equal. Subtract two from x and add one to y before dividing.\n\nCross-multiply and expand. Two x minus four equals three y plus three, so the Cartesian equation is two x minus three y minus seven equals zero.\n\nRead the normal from the Cartesian coefficients. Its dot product with the original direction is zero. The original point also satisfies the equation, so the direction and location checks both work.",
    "steps": [
      {
        "text": "Now convert the other way. The vector equation gives a starting point and direction.",
        "math": "\\[\\vec r=[2,-1]+t[3,2]\\]"
      },
      {
        "text": "Read the component equations using the same parameter in x and y.",
        "math": "\\[x=2+3t,\\quad y=-1+2t\\]"
      },
      {
        "text": "Make t the subject of each equation and set the results equal. Subtract two from x and add one to y before dividing.",
        "math": "\\[\\frac{x-2}{3}=\\frac{y+1}{2}\\]"
      },
      {
        "text": "Cross-multiply and expand. Two x minus four equals three y plus three, so the Cartesian equation is two x minus three y minus seven equals zero.",
        "math": "\\[2(x-2)=3(y+1)\\quad\\Rightarrow\\quad2x-3y-7=0\\]"
      },
      {
        "text": "Read the normal from the Cartesian coefficients. Its dot product with the original direction is zero. The original point also satisfies the equation, so the direction and location checks both work.",
        "math": "\\[\\vec n=[2,-3],\\quad\\vec n\\cdot[3,2]=0\\]"
      }
    ],
    "given": "\\[\\vec r=[2,-1]+t[3,2]\\]"
  },
  {
    "id": "slide-47",
    "section": "8.2",
    "title": "Slope to vector form",
    "explanation": "A slope gives rise over run. The intercept supplies a known point.",
    "notes": "Let's convert a familiar slope equation into vector form. We still need a point and a direction.\n\nSlope is the change in y divided by the change in x. A rise of three and a run of four give direction four comma three. The x-component comes first.\n\nSet x to zero to find an easy point. Then y is two, so we can start at zero comma two.\n\nUse that point and the direction in vector form.\n\nReading the components gives x equals four t and y equals two plus three t. They describe the same line as the original slope equation.",
    "steps": [
      {
        "text": "Let's convert a familiar slope equation into vector form. We still need a point and a direction.",
        "math": "\\[y=\\frac34x+2\\]"
      },
      {
        "text": "Slope is the change in y divided by the change in x. A rise of three and a run of four give direction four comma three. The x-component comes first.",
        "math": "\\[\\frac{\\Delta y}{\\Delta x}=\\frac34\\quad\\Longrightarrow\\quad\\vec m=[4,3]\\]"
      },
      {
        "text": "Set x to zero to find an easy point. Then y is two, so we can start at zero comma two.",
        "math": "\\[x=0\\quad\\Longrightarrow\\quad y=2,\\quad P_0(0,2)\\]"
      },
      {
        "text": "Use that point and the direction in vector form.",
        "math": "\\[\\vec r=[0,2]+t[4,3]\\]"
      },
      {
        "text": "Reading the components gives x equals four t and y equals two plus three t. They describe the same line as the original slope equation.",
        "math": "\\[x=4t,\\qquad y=2+3t\\]"
      }
    ],
    "given": "\\[y=\\frac34x+2\\]"
  },
  {
    "id": "slide-48",
    "section": "8.2",
    "title": "Vector to slope intercept form",
    "explanation": "Use the direction for the slope and the known point for the intercept.",
    "notes": "Now convert the other way. The given vector equation supplies a starting point and a direction.\n\nFind the slope from the direction. The y-change is negative four and the x-change is negative one. Their ratio is four.\n\nWrite y equals four x plus b. We know the slope, so we just need the intercept.\n\nSubstitute the starting point, three comma negative six. Solving for b gives negative eighteen.\n\nSo the slope intercept equation is y equals four x minus eighteen. The direction determined the slope, and the known point determined the intercept.",
    "steps": [
      {
        "text": "Now convert the other way. The given vector equation supplies a starting point and a direction.",
        "math": "\\[\\vec r=[3,-6]+s[-1,-4]\\]"
      },
      {
        "text": "Find the slope from the direction. The y-change is negative four and the x-change is negative one. Their ratio is four.",
        "math": "\\[\\text{slope}=\\frac{\\Delta y}{\\Delta x}=\\frac{-4}{-1}=4\\]"
      },
      {
        "text": "Write y equals four x plus b. We know the slope, so we just need the intercept.",
        "math": "\\[y=4x+b\\]"
      },
      {
        "text": "Substitute the starting point, three comma negative six. Solving for b gives negative eighteen.",
        "math": "\\[-6=4(3)+b\\quad\\Longrightarrow\\quad b=-6-12=-18\\]"
      },
      {
        "text": "So the slope intercept equation is y equals four x minus eighteen. The direction determined the slope, and the known point determined the intercept.",
        "math": "\\[y=4x-18\\]"
      }
    ],
    "given": "\\[\\vec r=[3,-6]+s[-1,-4]\\]"
  },
  {
    "id": "slide-49",
    "section": "8.2",
    "title": "A vertical line",
    "explanation": "A zero x-component means that x stays fixed.",
    "notes": "This line has direction zero comma two. What happens to x as the parameter changes?\n\nX always equals one because zero times the parameter is zero. Y can change, so this is a vertical line.\n\nA normal must be perpendicular to the direction. We can choose two comma zero. Its dot product with zero comma two is zero.\n\nUse that normal as the Cartesian coefficients and substitute the known point. The constant is negative two.\n\nDivide the equation by two. We get x minus one equals zero, or simply x equals one. This form handles the vertical line directly.",
    "steps": [
      {
        "text": "This line has direction zero comma two. What happens to x as the parameter changes?",
        "math": "\\[\\vec r=[1,4]+s[0,2]\\]"
      },
      {
        "text": "X always equals one because zero times the parameter is zero. Y can change, so this is a vertical line.",
        "math": "\\[x=1+0s=1,\\qquad y=4+2s\\]"
      },
      {
        "text": "A normal must be perpendicular to the direction. We can choose two comma zero. Its dot product with zero comma two is zero.",
        "math": "\\[\\vec n=[2,0],\\qquad[2,0]\\cdot[0,2]=0\\]"
      },
      {
        "text": "Use that normal as the Cartesian coefficients and substitute the known point. The constant is negative two.",
        "math": "\\[2x+C=0,\\quad2(1)+C=0\\quad\\Longrightarrow\\quad C=-2\\]"
      },
      {
        "text": "Divide the equation by two. We get x minus one equals zero, or simply x equals one. This form handles the vertical line directly.",
        "math": "\\[2x-2=0\\quad\\Longrightarrow\\quad x-1=0\\]"
      }
    ],
    "given": "\\[\\vec r=[1,4]+s[0,2]\\]"
  },
  {
    "id": "slide-50",
    "section": "8.2",
    "title": "Horizontal lines",
    "explanation": "A zero y-direction component keeps y fixed.",
    "notes": "We have already seen a vertical line. Here the y-direction component is zero instead, so this is a horizontal line.\n\nRead the coordinates. X varies with t, but y remains negative three. The direction is nonzero, so this is still a whole line.\n\nThe Cartesian equation is y plus three equals zero. Its normal is zero comma one, which points vertically and is perpendicular to the horizontal direction.\n\nThe horizontal slope is zero. A vertical slope is undefined because its run is zero. Vector and Cartesian equations handle both cases without dividing by zero.",
    "steps": [
      {
        "text": "We have already seen a vertical line. Here the y-direction component is zero instead, so this is a horizontal line.",
        "math": "\\[\\vec r=[2,-3]+t[4,0]\\]"
      },
      {
        "text": "Read the coordinates. X varies with t, but y remains negative three. The direction is nonzero, so this is still a whole line.",
        "math": "\\[x=2+4t,\\quad y=-3\\]"
      },
      {
        "text": "The Cartesian equation is y plus three equals zero. Its normal is zero comma one, which points vertically and is perpendicular to the horizontal direction.",
        "math": "\\[y+3=0,\\quad\\vec n=[0,1]\\]"
      },
      {
        "text": "The horizontal slope is zero. A vertical slope is undefined because its run is zero. Vector and Cartesian equations handle both cases without dividing by zero.",
        "math": "\\[\\text{Slope }0\\qquad\\text{Vertical lines have undefined slope}\\]"
      }
    ],
    "given": "\\[\\vec r=[2,-3]+t[4,0]\\]"
  },
  {
    "id": "slide-51",
    "section": "8.2",
    "title": "Parallel or coincident lines",
    "explanation": "Parallel normals give parallel line directions in two dimensions.",
    "notes": "Let's compare these two Cartesian lines. Read a normal from the coefficients of x and y in each equation.\n\nThe second normal is twice the first. So the lines have parallel directions. We need a point check to decide whether they coincide.\n\nFind an easy point on the first line by setting y to zero. This gives x equals two.\n\nSubstitute two comma zero into the second equation. The result is twenty-four, not zero, so that point is absent from the second line.\n\nThe lines are distinct and parallel. Matching normal directions alone would not have established coincidence.",
    "steps": [
      {
        "text": "Let's compare these two Cartesian lines. Read a normal from the coefficients of x and y in each equation.",
        "math": "\\[L_1:3x-4y-6=0,\\quad L_2:6x-8y+12=0\\]"
      },
      {
        "text": "The second normal is twice the first. So the lines have parallel directions. We need a point check to decide whether they coincide.",
        "math": "\\[\\vec n_2=[6,-8]=2[3,-4]=2\\vec n_1\\]"
      },
      {
        "text": "Find an easy point on the first line by setting y to zero. This gives x equals two.",
        "math": "\\[y=0\\text{ in }L_1:\\quad3x-6=0\\quad\\Longrightarrow\\quad x=2\\]"
      },
      {
        "text": "Substitute two comma zero into the second equation. The result is twenty-four, not zero, so that point is absent from the second line.",
        "math": "\\[6(2)-8(0)+12=24\\ne0\\]"
      },
      {
        "text": "The lines are distinct and parallel. Matching normal directions alone would not have established coincidence.",
        "math": "\\[(2,0)\\notin L_2\\quad\\Longrightarrow\\quad\\text{distinct parallel lines}\\]"
      }
    ],
    "given": "\\[L_1:3x-4y-6=0,\\quad L_2:6x-8y+12=0\\]"
  },
  {
    "id": "slide-52",
    "section": "8.2",
    "title": "A parameter for perpendicular lines",
    "explanation": "For perpendicular lines in two dimensions, the normals are perpendicular.",
    "notes": "Here the first line contains an unknown coefficient k. We want the two lines to be perpendicular.\n\nRead their normals as k comma four and three comma negative two. In two dimensions, perpendicular lines have perpendicular normals.\n\nSet the dot product of these normals equal to zero.\n\nExpand: three k minus eight equals zero. Add eight to both sides.\n\nDivide by three. We need k equal to eight-thirds. Substituting this value makes the normal dot product zero.",
    "steps": [
      {
        "text": "Here the first line contains an unknown coefficient k. We want the two lines to be perpendicular.",
        "math": "\\[L_3:kx+4y-4=0,\\quad L_4:3x-2y-3=0\\]"
      },
      {
        "text": "Read their normals as k comma four and three comma negative two. In two dimensions, perpendicular lines have perpendicular normals.",
        "math": "\\[\\vec n_3=[k,4],\\qquad\\vec n_4=[3,-2]\\]"
      },
      {
        "text": "Set the dot product of these normals equal to zero.",
        "math": "\\[[k,4]\\cdot[3,-2]=0\\]"
      },
      {
        "text": "Expand: three k minus eight equals zero. Add eight to both sides.",
        "math": "\\[3k+4(-2)=0\\quad\\Longrightarrow\\quad3k=8\\]"
      },
      {
        "text": "Divide by three. We need k equal to eight-thirds. Substituting this value makes the normal dot product zero.",
        "math": "\\[k=\\frac83\\]"
      }
    ],
    "given": "\\[L_3:kx+4y-4=0,\\quad L_4:3x-2y-3=0\\]"
  },
  {
    "id": "slide-53",
    "section": "8.2",
    "title": "The acute angle between two lines",
    "explanation": "Use the absolute dot product to obtain the smaller angle.",
    "notes": "We want the acute angle between these two lines. Use their direction vectors and the absolute value in the dot-product formula.\n\nFirst calculate the dot product. Negative one times three plus three times four gives nine.\n\nNow find the magnitudes. The first is square root ten. The second is five. Keep these values exact.\n\nSubstitute into the cosine formula. We get nine over five square root ten. The absolute value makes us choose the smaller angle between the lines.\n\nUse inverse cosine in degree mode. The angle is approximately fifty-five point three degrees. Keep the exact ratio until this final approximation.",
    "steps": [
      {
        "text": "We want the acute angle between these two lines. Use their direction vectors and the absolute value in the dot-product formula.",
        "math": "\\[\\vec m_1=[-1,3],\\qquad\\vec m_2=[3,4]\\]"
      },
      {
        "text": "First calculate the dot product. Negative one times three plus three times four gives nine.",
        "math": "\\[\\vec m_1\\cdot\\vec m_2=(-1)(3)+(3)(4)=9\\]"
      },
      {
        "text": "Now find the magnitudes. The first is square root ten. The second is five. Keep these values exact.",
        "math": "\\[\\lVert\\vec m_1\\rVert=\\sqrt{(-1)^2+3^2}=\\sqrt{10},\\quad\\lVert\\vec m_2\\rVert=\\sqrt{3^2+4^2}=5\\]"
      },
      {
        "text": "Substitute into the cosine formula. We get nine over five square root ten. The absolute value makes us choose the smaller angle between the lines.",
        "math": "\\[\\cos\\theta=\\frac{|\\vec m_1\\cdot\\vec m_2|}{\\lVert\\vec m_1\\rVert\\lVert\\vec m_2\\rVert}=\\frac9{5\\sqrt{10}}\\]"
      },
      {
        "text": "Use inverse cosine in degree mode. The angle is approximately fifty-five point three degrees. Keep the exact ratio until this final approximation.",
        "math": "\\[\\theta=\\cos^{-1}\\!\\left(\\frac9{5\\sqrt{10}}\\right)\\approx55.3^\\circ\\]"
      }
    ],
    "given": "\\[\\vec m_1=[-1,3],\\qquad\\vec m_2=[3,4]\\]"
  },
  {
    "id": "slide-54",
    "section": "8.3",
    "title": "Section 8.3 Lines in three dimensions",
    "explanation": "Review all three coordinates before writing simultaneous Cartesian conditions.",
    "notes": "We are now consolidating Section eight point three. We introduced the three dimensional forms earlier so you could compare them with two dimensions. The same point and direction rule still applies. Let’s review the coordinates, then write simultaneous Cartesian conditions for a line.\n\nRead the first components to get the x equation.\n\nRead the second components to get the y equation.\n\nRead the third components to get the z equation. All three use the same t because they describe one point in space.",
    "steps": [
      {
        "text": "We are now consolidating Section eight point three. We introduced the three dimensional forms earlier so you could compare them with two dimensions. The same point and direction rule still applies. Let’s review the coordinates, then write simultaneous Cartesian conditions for a line.",
        "math": "\\[[x,y,z]=[x_0,y_0,z_0]+t[m_1,m_2,m_3]\\]"
      },
      {
        "text": "Read the first components to get the x equation.",
        "math": "\\[x=x_0+tm_1\\]"
      },
      {
        "text": "Read the second components to get the y equation.",
        "math": "\\[y=y_0+tm_2\\]"
      },
      {
        "text": "Read the third components to get the z equation. All three use the same t because they describe one point in space.",
        "math": "\\[z=z_0+tm_3\\]"
      }
    ],
    "given": "\\[[x,y,z]=[x_0,y_0,z_0]+t[m_1,m_2,m_3]\\]"
  },
  {
    "id": "slide-55",
    "section": "8.3",
    "title": "Class example  Symmetric form with three changes",
    "explanation": "Write the symmetric equations through the two given points.",
    "notes": "Take the first symmetric-form example from the notes. We know A and B, so subtract A from B to get a direction.\n\nThe differences are four, negative nine and one. All three components are nonzero.\n\nStart at A and read the three parametric equations using one t. T equals one returns B.\n\nSolve each coordinate equation for t and equate the results. Notice x plus one because the starting x-coordinate is negative one.",
    "steps": [
      {
        "text": "Take the first symmetric-form example from the notes. We know A and B, so subtract A from B to get a direction.",
        "math": "\\[A(-1,5,7),\\quad B(3,-4,8)\\]"
      },
      {
        "text": "The differences are four, negative nine and one. All three components are nonzero.",
        "math": "\\[\\overrightarrow{AB}=[4,-9,1]\\]"
      },
      {
        "text": "Start at A and read the three parametric equations using one t. T equals one returns B.",
        "math": "\\[x=-1+4t,\\quad y=5-9t,\\quad z=7+t\\]"
      },
      {
        "text": "Solve each coordinate equation for t and equate the results. Notice x plus one because the starting x-coordinate is negative one.",
        "math": "\\[\\frac{x+1}{4}=\\frac{y-5}{-9}=\\frac{z-7}{1}\\]"
      }
    ],
    "given": "\\[A(-1,5,7),\\quad B(3,-4,8)\\]"
  },
  {
    "id": "slide-56",
    "section": "8.3",
    "title": "Class example  Symmetric form with negative signs",
    "explanation": "Write the symmetric equations through the two given points.",
    "notes": "For the second example, the points have the same y-coordinate. Expect a fixed y condition.\n\nSubtract P from Q. Six comma zero comma negative six simplifies to one comma zero comma negative one.\n\nStart at P. X increases with t, y stays three, and z decreases with t. The simpler direction reaches Q at t equals six.\n\nKeep y equals three separately. Equate the x and z expressions for t. Do not divide the y equation by its zero direction component.",
    "steps": [
      {
        "text": "For the second example, the points have the same y-coordinate. Expect a fixed y condition.",
        "math": "\\[P(-2,3,1),\\quad Q(4,3,-5)\\]"
      },
      {
        "text": "Subtract P from Q. Six comma zero comma negative six simplifies to one comma zero comma negative one.",
        "math": "\\[\\overrightarrow{PQ}=[6,0,-6]=6[1,0,-1]\\]"
      },
      {
        "text": "Start at P. X increases with t, y stays three, and z decreases with t. The simpler direction reaches Q at t equals six.",
        "math": "\\[x=-2+t,\\quad y=3,\\quad z=1-t\\]"
      },
      {
        "text": "Keep y equals three separately. Equate the x and z expressions for t. Do not divide the y equation by its zero direction component.",
        "math": "\\[y=3,\\qquad\\frac{x+2}{1}=\\frac{z-1}{-1}\\]"
      }
    ],
    "given": "\\[P(-2,3,1),\\quad Q(4,3,-5)\\]"
  },
  {
    "id": "slide-57",
    "section": "8.3",
    "title": "Class example  Another fixed coordinate",
    "explanation": "Write the symmetric equations through the two given points.",
    "notes": "In the third example, both points have x equal to negative one. That coordinate will remain fixed.\n\nThe direction from X to Y is zero comma one comma four.\n\nStart at X and read the coordinate equations. One shared t must produce all three coordinates. T equals one gives Y.\n\nKeep x equals negative one on its own. The y and z direction components are nonzero, so their expressions for t form the fraction equality.",
    "steps": [
      {
        "text": "In the third example, both points have x equal to negative one. That coordinate will remain fixed.",
        "math": "\\[X(-1,2,5),\\quad Y(-1,3,9)\\]"
      },
      {
        "text": "The direction from X to Y is zero comma one comma four.",
        "math": "\\[\\overrightarrow{XY}=[0,1,4]\\]"
      },
      {
        "text": "Start at X and read the coordinate equations. One shared t must produce all three coordinates. T equals one gives Y.",
        "math": "\\[x=-1,\\quad y=2+t,\\quad z=5+4t\\]"
      },
      {
        "text": "Keep x equals negative one on its own. The y and z direction components are nonzero, so their expressions for t form the fraction equality.",
        "math": "\\[x=-1,\\qquad\\frac{y-2}{1}=\\frac{z-5}{4}\\]"
      }
    ],
    "given": "\\[X(-1,2,5),\\quad Y(-1,3,9)\\]"
  },
  {
    "id": "slide-58",
    "section": "8.3",
    "title": "Eliminating the parameter in space",
    "explanation": "Eliminate t twice so that both equations describe the same line.",
    "notes": "Let's use this same line to get equations without the parameter. In three dimensions, we will keep two independent coordinate relationships.\n\nEquate the expressions for t from x and y. Cross-multiply, then multiply both sides by negative one. This gives five times x minus one equals negative two times y minus three.\n\nNow equate the x and z expressions for t. Cross-multiply and simplify. We get two times x minus one equals z minus six. Both relationships must hold for a point on the line.",
    "steps": [
      {
        "text": "Let's use this same line to get equations without the parameter. In three dimensions, we will keep two independent coordinate relationships.",
        "math": "\\[x=1+2t,\\quad y=3-5t,\\quad z=6+4t\\]"
      },
      {
        "text": "Equate the expressions for t from x and y. Cross-multiply, then multiply both sides by negative one. This gives five times x minus one equals negative two times y minus three.",
        "math": "\\[\\frac{x-1}{2}=\\frac{y-3}{-5}\\quad\\Longrightarrow\\quad5(x-1)=-2(y-3)\\]"
      },
      {
        "text": "Now equate the x and z expressions for t. Cross-multiply and simplify. We get two times x minus one equals z minus six. Both relationships must hold for a point on the line.",
        "math": "\\[\\frac{x-1}{2}=\\frac{z-6}{4}\\quad\\Longrightarrow\\quad2(x-1)=z-6\\]"
      }
    ],
    "given": "\\[x=1+2t,\\quad y=3-5t,\\quad z=6+4t\\]"
  },
  {
    "id": "slide-59",
    "section": "8.3",
    "title": "Cartesian equations of a line in space",
    "explanation": "Expand the brackets and use both equations together.",
    "notes": "Expand the first relationship and collect the terms on one side. This gives five x plus two y minus eleven equals zero.\n\nExpand the second relationship. Rearranging gives two x minus z plus four equals zero.\n\nKeep the equations together. Each one describes a plane, and satisfying both restricts us to their intersection line. One plane equation by itself would allow too many points.\n\nCheck the point three comma negative two comma ten. Substitute it into both equations. Each gives zero, so the point satisfies the complete Cartesian description.",
    "steps": [
      {
        "text": "Expand the first relationship and collect the terms on one side. This gives five x plus two y minus eleven equals zero.",
        "math": "\\[5x-5=-2y+6\\quad\\Longrightarrow\\quad5x+2y-11=0\\]"
      },
      {
        "text": "Expand the second relationship. Rearranging gives two x minus z plus four equals zero.",
        "math": "\\[2x-2=z-6\\quad\\Longrightarrow\\quad2x-z+4=0\\]"
      },
      {
        "text": "Keep the equations together. Each one describes a plane, and satisfying both restricts us to their intersection line. One plane equation by itself would allow too many points.",
        "math": "\\[\\begin{cases}5x+2y-11=0\\\\2x-z+4=0\\end{cases}\\]"
      },
      {
        "text": "Check the point three comma negative two comma ten. Substitute it into both equations. Each gives zero, so the point satisfies the complete Cartesian description.",
        "math": "\\[P(3,-2,10):\\quad15-4-11=0,\\quad6-10+4=0\\]"
      }
    ],
    "given": "\\[5x-5=-2y+6\\quad\\Longrightarrow\\quad5x+2y-11=0\\]"
  },
  {
    "id": "slide-60",
    "section": "8.1",
    "title": "Homework for Sections 8.1 to 8.3",
    "explanation": "Use the assigned textbook questions after completing the practice examples.",
    "notes": "For Section eight point one, complete the assigned questions on textbook page four hundred thirty-three. Show the starting point, direction and parameter checks.\n\nFor Section eight point two, complete the listed questions on page four hundred forty-three. Practise conversions, normals and line relationships. Explain why each form describes the same line.\n\nFor Section eight point three, use page four hundred forty-nine. Keep the same parameter in all three coordinates, and retain any fixed-coordinate equations. Check your working against the typed solutions provided with our course materials.",
    "steps": [
      {
        "text": "For Section eight point one, complete the assigned questions on textbook page four hundred thirty-three. Show the starting point, direction and parameter checks.",
        "math": "\\[\\text{8.1 Page 433: }2,3,4,5,8,9,10,13(a),14\\]"
      },
      {
        "text": "For Section eight point two, complete the listed questions on page four hundred forty-three. Practise conversions, normals and line relationships. Explain why each form describes the same line.",
        "math": "\\[\\text{8.2 Page 443: }1(a,b,e),3,4,5,6,7,8,9(b),10(a,b),11(b)\\]"
      },
      {
        "text": "For Section eight point three, use page four hundred forty-nine. Keep the same parameter in all three coordinates, and retain any fixed-coordinate equations. Check your working against the typed solutions provided with our course materials.",
        "math": "\\[\\text{8.3 Page 449: }1(a,b,c),3,5(a,e,f),6,8(a),9,10(a,b),15\\]"
      }
    ],
    "given": "\\[\\text{8.1 Page 433: }2,3,4,5,8,9,10,13(a),14\\]"
  },
  {
    "id": "slide-61",
    "section": "8.3",
    "title": "Choosing a useful form",
    "explanation": "Every line begins with a known point and a nonzero direction.",
    "notes": "Everything started with a point and a nonzero direction. That is why the vector equation is r equals r zero plus t m.\n\nVector form keeps the starting point and direction together.\n\nParametric form separates the coordinates while keeping one shared parameter.\n\nSymmetric form equates the expressions for that parameter. Keep any fixed coordinate separately.\n\nIn two dimensions, Cartesian coefficients give a normal. We derived that from a zero dot product.\n\nIn three dimensions, our Cartesian description used two independent equations together. When checking points, use every coordinate. When comparing parallel lines, check their location as well as their directions. Try the matching homework next, and show the reasons for your steps.",
    "steps": [
      {
        "text": "Everything started with a point and a nonzero direction. That is why the vector equation is r equals r zero plus t m.",
        "math": "\\[\\vec r=\\vec r_0+t\\vec m\\]"
      },
      {
        "text": "Vector form keeps the starting point and direction together."
      },
      {
        "text": "Parametric form separates the coordinates while keeping one shared parameter."
      },
      {
        "text": "Symmetric form equates the expressions for that parameter. Keep any fixed coordinate separately."
      },
      {
        "text": "In two dimensions, Cartesian coefficients give a normal. We derived that from a zero dot product."
      },
      {
        "text": "In three dimensions, our Cartesian description used two independent equations together. When checking points, use every coordinate. When comparing parallel lines, check their location as well as their directions. Try the matching homework next, and show the reasons for your steps."
      }
    ],
    "given": "\\[\\vec r=\\vec r_0+t\\vec m\\]"
  }
];
