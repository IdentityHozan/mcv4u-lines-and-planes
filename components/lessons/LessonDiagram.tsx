type LessonDiagramProps = {
  lessonId: string;
};

const textStyle = { fontFamily: "var(--font-geist-mono), monospace", fontSize: 12 };

function Frame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <figure className="overflow-hidden border border-white/10 bg-[#0d0d0d]" aria-label={title}>
      <svg viewBox="0 0 640 360" role="img" aria-labelledby={`diagram-${title.replaceAll(" ", "-")}`} className="block h-auto w-full">
        <title id={`diagram-${title.replaceAll(" ", "-")}`}>{title}</title>
        <defs>
          <pattern id="lesson-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#232323" strokeWidth="1" />
          </pattern>
          <marker id="lesson-arrow-blue" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
            <path d="M0,0 L9,4.5 L0,9 Z" fill="#38bdf8" />
          </marker>
          <marker id="lesson-arrow-white" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
            <path d="M0,0 L9,4.5 L0,9 Z" fill="#f5f5f5" />
          </marker>
        </defs>
        <rect width="640" height="360" fill="#0b0b0b" />
        <rect width="640" height="360" fill="url(#lesson-grid)" />
        {children}
      </svg>
      <figcaption className="border-t border-white/10 px-4 py-3 text-xs leading-5 text-zinc-400">{title}</figcaption>
    </figure>
  );
}

function Axes() {
  return (
    <g opacity="0.9">
      <line x1="84" y1="292" x2="568" y2="292" stroke="#6b7280" strokeWidth="1.5" markerEnd="url(#lesson-arrow-white)" />
      <line x1="116" y1="320" x2="116" y2="44" stroke="#38bdf8" strokeWidth="1.5" markerEnd="url(#lesson-arrow-blue)" />
      <line x1="88" y1="316" x2="426" y2="76" stroke="#4b5563" strokeWidth="1.5" markerEnd="url(#lesson-arrow-white)" />
      <text x="578" y="297" fill="#d4d4d8" style={textStyle}>x</text>
      <text x="107" y="34" fill="#7dd3fc" style={textStyle}>y</text>
      <text x="438" y="70" fill="#d4d4d8" style={textStyle}>z</text>
    </g>
  );
}

function LineEquationDiagram() {
  return (
    <Frame title="A line starts at an anchor point and follows a direction vector">
      <Axes />
      <line x1="166" y1="264" x2="526" y2="96" stroke="#f5f5f5" strokeWidth="4" />
      <circle cx="276" cy="213" r="8" fill="#f5f5f5" />
      <line x1="276" y1="213" x2="401" y2="155" stroke="#38bdf8" strokeWidth="5" markerEnd="url(#lesson-arrow-blue)" />
      <text x="244" y="238" fill="#f5f5f5" style={textStyle}>anchor r₀</text>
      <text x="405" y="146" fill="#7dd3fc" style={textStyle}>direction d</text>
      <text x="358" y="286" fill="#d4d4d8" style={textStyle}>r = r₀ + td</text>
    </Frame>
  );
}

function PlaneEquationDiagram() {
  return (
    <Frame title="Two in-plane directions span the plane and the normal points out of it">
      <Axes />
      <polygon points="142,250 380,102 558,178 314,326" fill="#38bdf8" fillOpacity="0.15" stroke="#38bdf8" strokeOpacity="0.72" strokeWidth="2" />
      <circle cx="304" cy="220" r="7" fill="#f5f5f5" />
      <line x1="304" y1="220" x2="440" y2="188" stroke="#f5f5f5" strokeWidth="4" markerEnd="url(#lesson-arrow-white)" />
      <line x1="304" y1="220" x2="230" y2="280" stroke="#9ca3af" strokeWidth="4" markerEnd="url(#lesson-arrow-white)" />
      <line x1="304" y1="220" x2="270" y2="72" stroke="#38bdf8" strokeWidth="5" markerEnd="url(#lesson-arrow-blue)" />
      <text x="444" y="185" fill="#f5f5f5" style={textStyle}>a</text>
      <text x="211" y="297" fill="#d4d4d8" style={textStyle}>b</text>
      <text x="248" y="61" fill="#7dd3fc" style={textStyle}>normal n</text>
    </Frame>
  );
}

function InterceptsDiagram() {
  return (
    <Frame title="Three axis intercepts establish the orientation of a plane">
      <Axes />
      <polygon points="208,292 116,126 414,80" fill="#38bdf8" fillOpacity="0.17" stroke="#38bdf8" strokeWidth="2" />
      {[[208, 292, "(a,0,0)"], [116, 126, "(0,b,0)"], [414, 80, "(0,0,c)"]].map(([x, y, label]) => (
        <g key={String(label)}><circle cx={Number(x)} cy={Number(y)} r="7" fill="#f5f5f5" /><text x={Number(x) + 10} y={Number(y) - 8} fill="#d4d4d8" style={textStyle}>{label}</text></g>
      ))}
    </Frame>
  );
}

function DefinePlaneDiagram() {
  return (
    <Frame title="A unique plane needs two independent directions">
      <polygon points="112,274 342,100 552,174 316,324" fill="#38bdf8" fillOpacity="0.13" stroke="#38bdf8" strokeOpacity="0.6" strokeWidth="2" />
      <circle cx="246" cy="222" r="8" fill="#f5f5f5" /><circle cx="422" cy="183" r="8" fill="#7dd3fc" /><circle cx="274" cy="285" r="8" fill="#38bdf8" />
      <line x1="246" y1="222" x2="412" y2="185" stroke="#f5f5f5" strokeWidth="3" markerEnd="url(#lesson-arrow-white)" />
      <line x1="246" y1="222" x2="271" y2="278" stroke="#38bdf8" strokeWidth="3" markerEnd="url(#lesson-arrow-blue)" />
      <text x="228" y="208" fill="#f5f5f5" style={textStyle}>A</text><text x="432" y="178" fill="#d4d4d8" style={textStyle}>B</text><text x="282" y="304" fill="#7dd3fc" style={textStyle}>C</text>
      <text x="348" y="220" fill="#d4d4d8" style={textStyle}>AB</text><text x="205" y="278" fill="#7dd3fc" style={textStyle}>AC</text>
    </Frame>
  );
}

function LinePlaneDiagram() {
  return (
    <Frame title="The shared point is found by substituting the line into the plane">
      <polygon points="96,246 346,100 566,190 318,334" fill="#38bdf8" fillOpacity="0.14" stroke="#38bdf8" strokeWidth="2" />
      <line x1="142" y1="318" x2="484" y2="58" stroke="#f5f5f5" strokeWidth="4" />
      <circle cx="326" cy="178" r="10" fill="#38bdf8" stroke="#f5f5f5" strokeWidth="3" />
      <text x="341" y="170" fill="#f5f5f5" style={textStyle}>intersection P</text>
      <text x="136" y="338" fill="#d4d4d8" style={textStyle}>r(t)</text>
      <text x="468" y="219" fill="#7dd3fc" style={textStyle}>plane Π</text>
    </Frame>
  );
}

function TwoPlanesDiagram() {
  return (
    <Frame title="Non-parallel planes meet along a line">
      <polygon points="66,224 342,72 560,146 286,304" fill="#38bdf8" fillOpacity="0.14" stroke="#38bdf8" strokeWidth="2" />
      <polygon points="146,70 384,126 492,326 252,270" fill="#f5f5f5" fillOpacity="0.08" stroke="#d4d4d8" strokeWidth="2" />
      <line x1="220" y1="135" x2="410" y2="279" stroke="#f5f5f5" strokeWidth="5" />
      <text x="90" y="244" fill="#7dd3fc" style={textStyle}>Π₁</text><text x="458" y="304" fill="#d4d4d8" style={textStyle}>Π₂</text>
      <text x="382" y="250" fill="#f5f5f5" style={textStyle}>intersection line</text>
    </Frame>
  );
}

function SystemsDiagram() {
  return (
    <Frame title="Algebraic outcomes match geometric relationships">
      <g transform="translate(24,40)">
        <polygon points="18,116 152,44 214,78 80,150" fill="#38bdf8" fillOpacity="0.14" stroke="#38bdf8" />
        <polygon points="60,38 176,70 202,164 86,132" fill="#f5f5f5" fillOpacity="0.06" stroke="#d4d4d8" />
        <text x="52" y="205" fill="#f5f5f5" style={textStyle}>one intersection set</text>
      </g>
      <g transform="translate(222,40)">
        <polygon points="18,98 156,26 216,60 78,132" fill="#38bdf8" fillOpacity="0.14" stroke="#38bdf8" />
        <polygon points="18,134 156,62 216,96 78,168" fill="#f5f5f5" fillOpacity="0.05" stroke="#d4d4d8" />
        <text x="52" y="205" fill="#f5f5f5" style={textStyle}>no intersection</text>
      </g>
      <g transform="translate(426,40)">
        <polygon points="18,116 156,44 216,78 78,150" fill="#38bdf8" fillOpacity="0.18" stroke="#38bdf8" />
        <polygon points="18,116 156,44 216,78 78,150" fill="#f5f5f5" fillOpacity="0.04" stroke="#f5f5f5" strokeDasharray="5 5" />
        <text x="43" y="205" fill="#f5f5f5" style={textStyle}>infinitely many</text>
      </g>
    </Frame>
  );
}

function DistanceDiagram() {
  return (
    <Frame title="Distance is measured along the shortest perpendicular segment">
      <line x1="108" y1="284" x2="540" y2="112" stroke="#f5f5f5" strokeWidth="4" />
      <circle cx="270" cy="92" r="9" fill="#38bdf8" />
      <circle cx="338" cy="192" r="8" fill="#f5f5f5" />
      <line x1="270" y1="92" x2="338" y2="192" stroke="#38bdf8" strokeWidth="4" strokeDasharray="8 6" />
      <path d="M326 175 L310 186 L321 202" fill="none" stroke="#7dd3fc" strokeWidth="2" />
      <text x="248" y="74" fill="#7dd3fc" style={textStyle}>point P</text>
      <text x="280" y="146" fill="#7dd3fc" style={textStyle}>shortest distance</text>
      <text x="495" y="104" fill="#d4d4d8" style={textStyle}>line L</text>
    </Frame>
  );
}

export function LessonDiagram({ lessonId }: LessonDiagramProps) {
  if (lessonId === "line-equations") return <LineEquationDiagram />;
  if (lessonId === "plane-equations") return <PlaneEquationDiagram />;
  if (lessonId === "sketching-r3") return <InterceptsDiagram />;
  if (lessonId === "defining-a-plane") return <DefinePlaneDiagram />;
  if (lessonId === "line-plane-intersections") return <LinePlaneDiagram />;
  if (lessonId === "two-plane-intersections") return <TwoPlanesDiagram />;
  if (lessonId === "consistent-systems") return <SystemsDiagram />;
  return <DistanceDiagram />;
}
