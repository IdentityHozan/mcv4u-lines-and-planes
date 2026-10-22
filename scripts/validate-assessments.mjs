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
const { conceptModules, finalExam, homeworkSets, quizzes, tests } = require("../data/linesAndPlanesData.ts");

const bank = [...quizzes, ...tests, finalExam];
const ids = new Set();
assert.equal(quizzes.length, 3, "Three topic quizzes are required");
assert.equal(tests.length, 2, "Two unit tests are required");
for (const assessment of bank) {
  const target = quizzes.includes(assessment) ? 12 : tests.includes(assessment) ? 16 : 24;
  assert.equal(assessment.questions.length, target, `${assessment.id}: question count`);
  assert.ok(assessment.instructions?.length, `${assessment.id}: instructions`);
  const categories = new Set(assessment.questions.flatMap((question) => question.tags));
  assert.ok(["K", "A", "T", "C"].every((category) => categories.has(category)), `${assessment.id}: covers all four KATC categories`);
  let total = 0;
  for (const question of assessment.questions) {
    assert.ok(!ids.has(question.id), `Duplicate question id ${question.id}`);
    ids.add(question.id);
    assert.ok(question.prompt.trim().length > 15, `${question.id}: complete prompt`);
    assert.ok(question.tags.length && question.tags.every((tag) => ["K", "A", "T", "C"].includes(tag)), `${question.id}: KATC tags`);
    assert.ok(Number.isInteger(question.marks) && question.marks > 0, `${question.id}: positive integer marks`);
    assert.ok(question.section?.length, `${question.id}: academic section`);
    assert.ok(question.rationale.length && question.steps.length, `${question.id}: full explanation`);
    const text = [question.prompt, question.rationale, ...question.steps.flatMap((step) => [step.text, step.math ?? ""])];
    if (question.kind === "written") {
      assert.ok(question.criteria.length >= 2, `${question.id}: written marking criteria`);
      assert.ok(question.sampleAnswer.trim().length > 25, `${question.id}: model response`);
      text.push(question.sampleAnswer, ...question.criteria);
    } else {
      assert.equal(question.options.length, 4, `${question.id}: four answer choices`);
      assert.ok(Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex < 4, `${question.id}: correct index`);
      assert.equal(new Set(question.options.map((option) => option.replace(/\s+/g, "").toLowerCase())).size, 4, `${question.id}: distinct options`);
      text.push(...question.options);
    }
    for (const value of text) {
      assert.ok(!/[•—]/.test(value), `${question.id}: no decorative bullets or em dashes`);
      for (const [open, close] of [["\\(", "\\)"], ["\\[", "\\]"]]) {
        assert.equal(value.split(open).length, value.split(close).length, `${question.id}: balanced LaTeX delimiters`);
      }
    }
    total += question.marks;
  }
  console.log(`${assessment.title}: ${assessment.questions.length} questions, ${total} marks`);
}
assert.equal(ids.size, 92, "All 92 question IDs must be unique");
assert.equal(conceptModules.length, 12, "Twelve classroom sections are required");
assert.equal(homeworkSets.length, 4, "Four homework sets are required");
assert.ok(homeworkSets.every((set) => set.problems.length >= 6 && set.problems.every((problem) => problem.steps.length && problem.answer)), "Every homework set needs six fully solved problems");
console.log("Assessment content checks passed");
