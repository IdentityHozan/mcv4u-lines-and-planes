import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ts = require("typescript");
require.extensions[".ts"] = (module, filename) => {
  const result = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: filename,
  });
  module._compile(result.outputText, filename);
};
const { conceptModules, finalExam, homeworkSets, quizzes, tests, videoLessons } = require("../data/linesAndPlanesData.ts");
const { courseUnits, unitForSection, sectionRange, homeworkHref, quizHref, testHref } = require("../data/courseUnits.ts");
const expectedUnits = [
  { id: "8.1", sections: ["8.1", "8.2", "8.3"], videoId: "video-lines" },
  { id: "8.2", sections: ["8.4", "8.5", "8.6"], videoId: "video-planes" },
  { id: "9.1", sections: ["9.1", "9.2", "9.3", "9.4"], videoId: "video-intersections" },
  { id: "9.2", sections: ["9.5", "9.6"], videoId: "video-distances" },
];
const categories = ["K", "A", "T", "C"];
const ids = new Set();
function checkText(value, owner) {
  assert.equal(typeof value, "string", `${owner}: text must be a string`);
  assert.ok(!/[•—\x00-\x08\x0B\x0C\x0E-\x1F]/.test(value), `${owner}: no decorative bullets, em dashes or malformed control characters`);
  for (const [open, close] of [["\\(", "\\)"], ["\\[", "\\]"]]) {
    assert.equal(value.split(open).length, value.split(close).length, `${owner}: balanced LaTeX delimiters`);
  }
}
function checkSteps(steps, owner) {
  assert.ok(Array.isArray(steps) && steps.length, `${owner}: worked steps are required`);
  for (const step of steps) {
    assert.ok(step.label?.trim() && step.text?.trim(), `${owner}: every step needs a label and explanation`);
    [step.label, step.text, step.math ?? ""].forEach((value) => checkText(value, owner));
  }
}
function checkTags(tags, owner) {
  assert.ok(Array.isArray(tags) && tags.length && tags.every((tag) => categories.includes(tag)), `${owner}: valid KATC tags`);
  assert.equal(new Set(tags).size, tags.length, `${owner}: KATC tags are not repeated`);
}
function checkCriteria(question) {
  const { id, criteria, marks } = question;
  assert.ok(Array.isArray(criteria) && criteria.length >= 2, `${id}: written marking criteria`);
  const explicitWeights = question.criteriaMarks;
  if (explicitWeights !== undefined) {
    assert.ok(Array.isArray(explicitWeights), `${id}: criteriaMarks must be an array`);
    assert.equal(explicitWeights.length, criteria.length, `${id}: one weight per criterion`);
    assert.ok(explicitWeights.every((weight) => Number.isInteger(weight) && weight > 0), `${id}: positive integer criterion weights`);
    assert.equal(explicitWeights.reduce((sum, weight) => sum + weight, 0), marks, `${id}: criterion weights total the question marks`);
  }
  const matches = criteria.map((criterion) => criterion.match(/\((\d+)\s+marks?\)/i));
  if (matches.some(Boolean)) {
    assert.ok(matches.every(Boolean), `${id}: all textual criteria state their mark weight`);
    const weights = matches.map((match) => Number(match[1]));
    assert.ok(weights.every((weight) => weight > 0), `${id}: textual criterion weights are positive`);
    assert.equal(weights.reduce((sum, weight) => sum + weight, 0), marks, `${id}: textual criterion weights total the question marks`);
    if (explicitWeights) assert.deepEqual(weights, explicitWeights, `${id}: numeric and textual criterion weights agree`);
  }
}

assert.equal(quizzes.length, 4, "Exactly one quiz is required for each of the four units");
assert.equal(tests.length, 4, "Exactly one test is required for each of the four units");
for (const assessment of [...quizzes, ...tests, finalExam]) {
  const isQuiz = quizzes.includes(assessment);
  const isTest = tests.includes(assessment);
  const target = isQuiz ? 10 : isTest ? 12 : 24;
  const expectedMarks = isQuiz ? 22 : isTest ? 32 : 60;
  assert.equal(assessment.questions.length, target, `${assessment.id}: question count`);
  assert.equal(assessment.kind, isQuiz ? "quiz" : isTest ? "test" : "exam", `${assessment.id}: assessment kind`);
  assert.equal(assessment.mode, isQuiz ? "quiz" : "exam", `${assessment.id}: feedback mode`);
  assert.ok(assessment.instructions?.length, `${assessment.id}: instructions`);
  assert.ok(assessment.timeLimit?.trim(), `${assessment.id}: suggested time`);
  const presentCategories = new Set(assessment.questions.flatMap((question) => question.tags));
  assert.ok(categories.every((category) => presentCategories.has(category)), `${assessment.id}: covers all four KATC categories`);
  assert.ok(assessment.questions.some((question) => question.kind === "written"), `${assessment.id}: includes written reasoning`);
  assert.ok(assessment.questions.some((question) => question.kind !== "written"), `${assessment.id}: includes multiple-choice questions`);
  const prompts = new Set();
  let total = 0;
  for (const question of assessment.questions) {
    assert.ok(!ids.has(question.id), `Duplicate question id ${question.id}`);
    ids.add(question.id);
    assert.ok(question.prompt.trim().length > 15, `${question.id}: complete prompt`);
    assert.ok(!prompts.has(question.prompt), `${question.id}: repeated prompt within one paper`);
    prompts.add(question.prompt);
    checkTags(question.tags, question.id);
    assert.ok(Number.isInteger(question.marks) && question.marks > 0, `${question.id}: positive integer marks`);
    assert.ok(question.section?.length, `${question.id}: academic paper section`);
    assert.ok(question.rationale?.trim(), `${question.id}: rationale is required`);
    checkSteps(question.steps, question.id);
    const text = [question.prompt, question.rationale, question.section];
    if (question.kind === "written") {
      checkCriteria(question);
      assert.ok(question.sampleAnswer.trim().length > 25, `${question.id}: model response`);
      text.push(question.sampleAnswer, ...question.criteria);
    } else {
      assert.equal(question.options.length, 4, `${question.id}: four answer choices`);
      assert.ok(Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex < 4, `${question.id}: correct index`);
      assert.equal(new Set(question.options.map((option) => option.replace(/\s+/g, "").toLowerCase())).size, 4, `${question.id}: distinct options`);
      text.push(...question.options);
    }
    text.forEach((value) => checkText(value, question.id));
    total += question.marks;
  }
  assert.equal(total, expectedMarks, `${assessment.id}: total marks`);
  console.log(`${assessment.kind} ${assessment.number}: ${assessment.questions.length} questions, ${total} marks`);
}
assert.equal(ids.size, 112, "All 112 assessment question IDs must be unique");

assert.equal(conceptModules.length, 12, "Twelve classroom sections are required");
assert.equal(homeworkSets.length, 12, "Each classroom section requires its own homework set");
const lessonSections = conceptModules.map((lesson) => lesson.section ?? lesson.index);
const homeworkSections = homeworkSets.map((set) => set.number);
assert.equal(new Set(lessonSections).size, 12, "Lesson section numbers must be unique");
assert.equal(new Set(homeworkSections).size, 12, "Homework section numbers must be unique");
assert.deepEqual(homeworkSections, lessonSections, "Homework follows the same twelve sections and order as the lessons");
const problemIds = new Set();
for (const set of homeworkSets) {
  assert.equal(set.id, `homework-${set.number.replace(".", "-")}`, `${set.number}: stable homework id`);
  assert.equal(set.problems.length, 5, `${set.id}: five section-specific homework problems`);
  assert.ok(set.title?.trim() && set.focus?.trim(), `${set.id}: title and focus`);
  assert.ok(Number.isFinite(set.estimatedMinutes) && set.estimatedMinutes > 0, `${set.id}: positive suggested time`);
  for (const problem of set.problems) {
    assert.ok(!problemIds.has(problem.id), `Duplicate homework problem id ${problem.id}`);
    problemIds.add(problem.id);
    assert.ok(problem.title?.trim() && problem.prompt?.trim().length > 15, `${problem.id}: complete homework prompt`);
    assert.ok(problem.hint?.trim() && problem.answer?.trim(), `${problem.id}: hint and answer`);
    checkTags(problem.tags, problem.id);
    checkSteps(problem.steps, problem.id);
    [problem.title, problem.prompt, problem.hint, problem.answer].forEach((value) => checkText(value, problem.id));
  }
}
assert.equal(problemIds.size, 60, "All 60 fully solved homework problems have unique IDs");

assert.equal(courseUnits.length, 4, "Four instructional units are required");
assert.deepEqual(courseUnits.map((unit) => unit.id), expectedUnits.map((unit) => unit.id), "Unit identifiers and order match the course structure");
const allUnitSections = [];
for (const [index, unit] of courseUnits.entries()) {
  const expected = expectedUnits[index];
  assert.deepEqual(unit.sections, expected.sections, `${unit.id}: section coverage`);
  assert.equal(unit.videoId, expected.videoId, `${unit.id}: video mapping`);
  const slug = unit.id.replace(".", "-");
  assert.equal(unit.quizId, `quiz-unit-${slug}`, `${unit.id}: quiz mapping`);
  assert.equal(unit.testId, `test-unit-${slug}`, `${unit.id}: test mapping`);
  const unitQuizzes = quizzes.filter((quiz) => quiz.id === unit.quizId);
  const unitTests = tests.filter((test) => test.id === unit.testId);
  assert.equal(unitQuizzes.length, 1, `${unit.id}: exactly one linked live quiz`);
  assert.equal(unitTests.length, 1, `${unit.id}: exactly one linked live test`);
  assert.equal(unitQuizzes[0].number, unit.id, `${unit.id}: displayed quiz number`);
  assert.equal(unitTests[0].number, unit.id, `${unit.id}: displayed test number`);
  assert.ok(videoLessons.some((video) => video.id === unit.videoId), `${unit.id}: linked video exists`);
  const video = videoLessons.find((item) => item.id === unit.videoId);
  assert.deepEqual(video.sections, unit.sections, `${unit.id}: video and unit cover the same sections`);
  assert.equal(sectionRange(unit.sections), `${unit.sections[0]} to ${unit.sections.at(-1)}`, `${unit.id}: readable coverage range`);
  const quizUrl = new URL(quizHref(unit.id), "https://course.invalid");
  const testUrl = new URL(testHref(unit.id), "https://course.invalid");
  assert.equal(quizUrl.pathname, "/assessments");
  assert.equal(testUrl.pathname, "/tests");
  assert.equal(quizUrl.searchParams.get("unit"), unit.id, `${unit.id}: quiz deep link`);
  assert.equal(testUrl.searchParams.get("unit"), unit.id, `${unit.id}: test deep link`);
  for (const section of unit.sections) {
    assert.equal(unitForSection(section)?.id, unit.id, `${section}: maps back to its unit`);
    assert.equal(conceptModules.filter((lesson) => (lesson.section ?? lesson.index) === section).length, 1, `${section}: exactly one lesson`);
    assert.equal(homeworkSets.filter((set) => set.number === section).length, 1, `${section}: exactly one homework set`);
    const href = new URL(homeworkHref(section), "https://course.invalid");
    assert.equal(href.pathname, "/practice");
    assert.equal(href.searchParams.get("section"), section, `${section}: homework deep link`);
    allUnitSections.push(section);
  }
}
assert.deepEqual(allUnitSections, lessonSections, "Unit ranges cover every lesson once, with no gaps or overlaps");
console.log("Assessment, homework and course-unit content checks passed");
