export type StudyGuide = {
  hook: string;
  steps: { title: string; body: string }[];
  checkpoint: { prompt: string; answer: string };
};

export const studyGuides: Record<string, StudyGuide> = {
  "8.1": {
    hook: "Let's say we know one point on a line and the direction it follows. Start at that point. Move one step forward, two steps forward, or half a step backward. The same equation gives you every point you can reach.",
    steps: [
      { title: "Choose a starting point", body: "Use any point you know is on the line. This is the point you get when $t=0$." },
      { title: "Find a direction", body: String.raw`Use the direction given in the question, or subtract the start from a second point: $\overrightarrow{AB}=B-A$.` },
      { title: "Write the equation and check it", body: "Add the starting position to $t$ times the direction. Read off one equation per coordinate and use the same $t$ in both." },
    ],
    checkpoint: {
      prompt: "Write vector and parametric equations for the line through $A(2,1)$ and $B(5,-1)$. Is $P(8,-3)$ on it?",
      answer: String.raw`Subtract to get $B-A=[3,-2]$, so $\vec r=[2,1]+t[3,-2]$. Read off $x=2+3t$ and $y=1-2t$. The first equation gives $8=2+3t$ when $t=2$. The same value gives $y=1-2(2)=-3$, so $P$ is on the line.`,
    },
  },
  "8.2": {
    hook: "In the last lesson, the direction told you how to travel along a line. This time, use a perpendicular arrow to write an equation you can check by plugging in a point.",
    steps: [
      { title: "Identify the normal", body: "In $Ax+By+C=0$, the normal is $[A,B]$. If you start with a direction $[a,b]$, turn it through a right angle to get a normal such as $[b,-a]$." },
      { title: "Use a point on the line", body: "To write Cartesian form, substitute the known point and solve for $C$. To go back to vector form, set one coordinate to zero and solve for the other. Solve for a coordinate with a nonzero coefficient." },
      { title: "Check the conversion", body: "Substitute your point into the Cartesian equation. If you found a direction, its dot product with the normal should also be zero." },
    ],
    checkpoint: {
      prompt: "Write a Cartesian equation for the line through $(3,-1)$ with direction $[2,5]$. Then give a different point on the line.",
      answer: "A normal is $[5,-2]$, so use $5(x-3)-2(y+1)=0$. This simplifies to $5x-2y-17=0$. Moving one step along the direction gives $(5,4)$, and $5(5)-2(4)-17=0$.",
    },
  },
  "8.3": {
    hook: "A line in space needs one more coordinate, but you still make only one choice: how far to move along its direction. The same parameter controls all three coordinates.",
    steps: [
      { title: "Start with a point and a direction", body: String.raw`Use $\vec r=\vec r_0+t[a,b,c]$. For two given points, subtract them to get the direction.` },
      { title: "Read the coordinates", body: "Write $x=x_0+at$, $y=y_0+bt$ and $z=z_0+ct$. Use one shared parameter, even if a coordinate never changes." },
      { title: "Make the parameter the subject", body: "Equate the expressions for $t$ to get symmetric form. If a direction component is zero, keep its coordinate as a separate equation." },
    ],
    checkpoint: {
      prompt: "Find the symmetric form of the line through $A(1,-2,4)$ and $B(4,0,4)$. Which coordinate must stay fixed?",
      answer: String.raw`The direction is $B-A=[3,2,0]$. Therefore $\frac{x-1}{3}=\frac{y+2}{2}$ and $z=4$. The line never moves in the $z$ direction, so there is no third fraction.`,
    },
  },
  "8.4": {
    hook: "On a line you can move back and forth. On a plane you need another direction to move away from that line. Think of choosing two independent moves from the same starting point.",
    steps: [
      { title: "Pick one point as your anchor", body: "If the problem gives three points, use one as the start for both displacement vectors." },
      { title: "Find two independent directions", body: String.raw`For points $A,B,C$, use $\overrightarrow{AB}$ and $\overrightarrow{AC}$. Check that they are not scalar multiples; otherwise you only have one line of movement.` },
      { title: "Write and test the equation", body: String.raw`Write $\vec r=\vec r_0+s\vec u+t\vec v$ and read off the coordinates. In a point check, the same pair $(s,t)$ has to satisfy all three equations.` },
    ],
    checkpoint: {
      prompt: "Write a vector equation of the plane through $A(0,1,2)$, $B(2,1,3)$ and $C(0,3,1)$. Use it to check $P(2,3,2)$.",
      answer: String.raw`The two directions are $[2,0,1]$ and $[0,2,-1]$, so $\vec r=[0,1,2]+s[2,0,1]+t[0,2,-1]$. The first two coordinates of $P$ give $s=1$ and $t=1$. They give $z=2+1-1=2$, so $P$ belongs to the plane.`,
    },
  },
  "8.5": {
    hook: "Vector form tells you how to move within a plane. Cartesian form gives you a quicker way to check if a point belongs. The arrow perpendicular to the plane connects the two forms.",
    steps: [
      { title: "Find a normal", body: "Use the given normal, or take the cross product of the two independent directions in the plane." },
      { title: "Use the normal and the anchor", body: "Use the normal $[A,B,C]$ for the coefficients in $A(x-x_0)+B(y-y_0)+C(z-z_0)=0$. Expand and substitute the anchor to check your signs." },
      { title: "To convert back, let two coordinates vary", body: "Solve for a coordinate whose coefficient is nonzero. Give the other two independent parameters, then read the point and directions from the coordinate equations." },
    ],
    checkpoint: {
      prompt: String.raw`Convert $\vec r=[1,1,0]+s[1,0,2]+t[0,1,1]$ to Cartesian form. Does the origin belong to the plane?`,
      answer: String.raw`The cross product gives $[-2,-1,1]$, so one equation is $-2(x-1)-(y-1)+z=0$, or $2x+y-z=3$. The origin gives $0$ on the left, not $3$, so it is outside the plane.`,
    },
  },
  "8.6": {
    hook: "A sketch needs enough points to show which way the plane tilts. Look for the places where it crosses the axes first. If those don't give you enough points, look for the lines where it crosses the coordinate planes.",
    steps: [
      { title: "Draw and label the axes", body: "For a point $(x,y,z)$, move along the $x$ and $y$ directions first, then move up or down by $z$. The projection onto the $xy$-plane stops before that last move." },
      { title: "Find the axis intercepts", body: "For an $x$-intercept, set $y=z=0$ and solve for $x$. Repeat for the other axes. Plot the signs as well as the distances." },
      { title: "Use a trace when intercepts fall short", body: "Set just one coordinate to zero, such as $z=0$ for the $xy$-trace. Use three points that are not all on one line to show a patch of the plane." },
    ],
    checkpoint: {
      prompt: "Find the axis intercepts of $x-2y=4$. The plane has no $z$ term. What third point could you use to sketch it?",
      answer: "The intercepts are $(4,0,0)$ and $(0,-2,0)$. The $z$-axis has $x=y=0$, which would give $0=4$, so there is no $z$-intercept. Use $(4,0,2)$ as a third point directly above $(4,0,0)$; changing $z$ does not affect the equation.",
    },
  },
  "9.1": {
    hook: "To find an intersection, look for points that belong to both objects. Write the coordinates of a point on one object, then check when those coordinates also satisfy the other.",
    steps: [
      { title: "For a line and plane, substitute", body: "Put the line's $x$, $y$ and $z$ expressions into the plane equation. Solve for the line parameter." },
      { title: "Read what the equation tells you", body: "One parameter value gives one crossing point. A true statement for every parameter means the whole line lies in the plane. A false statement means no intersection." },
      { title: "For two lines, use two parameters", body: "Compare directions first. If they are proportional, test a point for coincidence. Otherwise solve two coordinate equations using separate parameters, then check the third to decide whether they intersect or are skew." },
    ],
    checkpoint: {
      prompt: String.raw`Find the intersection of $\vec r=[1,2,0]+t[2,-1,1]$ with $x+y+z=7$.`,
      answer: "Substituting gives $(1+2t)+(2-t)+t=7$, so $3+2t=7$ and $t=2$. The intersection is $(5,0,2)$. Its coordinates add to $7$, so it also satisfies the plane equation.",
    },
  },
  "9.2": {
    hook: "Three equations can look crowded. Take away one unknown at a time. With each elimination, the same solutions remain possible, but you have less to work with.",
    steps: [
      { title: "Choose an easy variable to eliminate", body: "Number the equations and use one as a reference. Add or subtract a multiple of it from each of the other two. Carry the same operation through both sides of each equation." },
      { title: "Solve the smaller system", body: "Eliminate another variable, then substitute back. If an equation reduces to $0=0$, it adds no restriction. An equation such as $0=4$ means there is no solution." },
      { title: "Describe and check the whole solution", body: "Give each free variable its own parameter if needed. Substitute your values or parameter expressions into all the original equations." },
    ],
    checkpoint: {
      prompt: "Solve $x+y+z=4$, $2x+y-z=3$ and $x-y+z=0$. Show the step that gives $y$.",
      answer: "Subtract the third equation from the first to get $2y=4$, so $y=2$. The first two equations then give $x+z=2$ and $2x-z=1$. Adding gives $x=1$, then $z=1$. The point $(1,2,1)$ gives the original right sides $4$, $3$ and $0$.",
    },
  },
  "9.3": {
    hook: "When two planes cross, the points they share run along a line. Use their equations to find one point on that line and the direction you can move without leaving either plane.",
    steps: [
      { title: "Compare the normals", body: "If the normals are proportional, compare the constants using the same multiplier. A match gives one coincident plane; a mismatch gives no common points." },
      { title: "Eliminate one coordinate", body: "For nonparallel normals, combine the equations to find a simpler restriction. Choose one free coordinate, give it a parameter and write the other coordinates in terms of it." },
      { title: "Verify your line in both planes", body: "Substitute the starting point into both equations. The direction should be perpendicular to both normals; their cross product gives a useful direction check." },
    ],
    checkpoint: {
      prompt: "Find a vector equation for the intersection of $x+y-z=2$ and $x-y-z=0$.",
      answer: String.raw`Subtracting gives $2y=2$, so $y=1$. Then $x-z=1$. Take $z=t$ to get $\vec r=[1,1,0]+t[1,0,1]$. Substituting $(1+t,1,t)$ gives $2$ and $0$ in the two equations for every $t$.`,
    },
  },
  "9.4": {
    hook: "Even if three planes meet in pairs, the three intersections might be in different places. You are looking for the points that satisfy all three equations at the same time.",
    steps: [
      { title: "Look for parallel or repeated planes", body: "Compare normals and then the constants. A distinct parallel pair rules out a common point. If two equations describe the same plane, keep only one copy." },
      { title: "Eliminate to see what is left", body: "Work with all the distinct equations. A contradiction means no common points, even if every pair of planes intersects." },
      { title: "Count the free coordinates", body: "If the system is consistent, zero free coordinates means a point, one means a line, and two means a plane. Check the result in all the original equations." },
    ],
    checkpoint: {
      prompt: "The planes $x+y+z=2$, $x-y+z=0$ and $2x+2z=5$ intersect in pairs. Do they have any point in common?",
      answer: "No. Adding the first two equations forces $2x+2z=2$. The third equation requires the same expression to equal $5$, which is impossible. Pairwise intersections do not make the full system consistent.",
    },
  },
  "9.5": {
    hook: "Imagine dropping a perpendicular from a point to a line. Where it lands is the closest point on the line. The length of that segment is the distance you are looking for.",
    steps: [
      { title: "Identify what is given", body: "A Cartesian line in two dimensions gives you its normal. A vector line gives you a point $A$ on the line and its direction." },
      { title: "Choose the calculation that fits", body: "In two dimensions, use the absolute value of the Cartesian expression at the point and divide by the normal's length. In three dimensions, take the length of the cross product of $P-A$ and the line direction, then divide by the direction's length." },
      { title: "If asked for the foot, find the point", body: "Use the dot product to find where the displacement to $P$ is perpendicular to the line. Substitute the parameter into the line and check that the resulting displacement has zero dot product with the direction." },
    ],
    checkpoint: {
      prompt: String.raw`Find the perpendicular foot and exact distance from $P(3,0,2)$ to $\vec r=[1,0,0]+t[1,1,0]$.`,
      answer: String.raw`The displacement from the anchor is $[2,0,2]$. Project onto the direction to get $t=2/2=1$, so the foot is $H(2,1,0)$. Then $P-H=[1,-1,2]$ is perpendicular to $[1,1,0]$, and its length is $\sqrt{6}$.`,
    },
  },
  "9.6": {
    hook: "The shortest way from a point to a plane is straight along its normal. The distance tells you how far to move. The perpendicular foot tells you exactly where you land.",
    steps: [
      { title: "Read the normal and substitute the point", body: "For $Ax+By+Cz+D=0$, the normal is $[A,B,C]$. Evaluate the full left side at your point, including $D$, and keep its sign if you need the foot." },
      { title: "Turn the result into a distance", body: "Take the absolute value and divide by the normal's length. To locate the foot, remove the signed normal displacement, then check the point in the plane equation." },
      { title: "Reuse one common normal", body: "For parallel planes, match normal coefficients before comparing or averaging constants. For skew lines, the cross product of their directions gives a common normal." },
    ],
    checkpoint: {
      prompt: "Find the exact distance from $P(3,1,1)$ to $x+2y+2z-4=0$. Then find the perpendicular foot.",
      answer: String.raw`The signed value is $3+2+2-4=3$, and the normal has length $3$, so the distance is $1$. Subtract $\frac{3}{9}[1,2,2]$ from $P$ to get $H(\frac{8}{3},\frac13,\frac13)$. Its coordinates give $\frac83+\frac23+\frac23-4=0$.`,
    },
  },
};
