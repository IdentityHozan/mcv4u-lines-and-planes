export type CourseUnit = {
  id: string;
  title: string;
  sections: readonly string[];
  videoId: string;
  quizId: string;
  testId: string;
};

export const courseUnits: readonly CourseUnit[] = [
  { id: "8.1", title: "Line equations", sections: ["8.1", "8.2", "8.3"], videoId: "video-lines", quizId: "quiz-unit-8-1", testId: "test-unit-8-1" },
  { id: "8.2", title: "Plane equations and sketching", sections: ["8.4", "8.5", "8.6"], videoId: "video-planes", quizId: "quiz-unit-8-2", testId: "test-unit-8-2" },
  { id: "9.1", title: "Intersections and systems", sections: ["9.1", "9.2", "9.3", "9.4"], videoId: "video-intersections", quizId: "quiz-unit-9-1", testId: "test-unit-9-1" },
  { id: "9.2", title: "Shortest distances", sections: ["9.5", "9.6"], videoId: "video-distances", quizId: "quiz-unit-9-2", testId: "test-unit-9-2" },
];

export const unitForSection = (section: string) => courseUnits.find((unit) => unit.sections.includes(section));
export const sectionRange = (sections: readonly string[]) => sections.length === 1 ? sections[0] : `${sections[0]} to ${sections[sections.length - 1]}`;
export const homeworkHref = (section: string) => `/practice?section=${encodeURIComponent(section)}`;
export const quizHref = (unitId: string) => `/assessments?unit=${encodeURIComponent(unitId)}`;
export const testHref = (unitId: string) => `/tests?unit=${encodeURIComponent(unitId)}`;
