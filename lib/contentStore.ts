import { promises as fs } from "node:fs";
import path from "node:path";
import { list, put } from "@vercel/blob";
import type { ManagedLesson } from "@/data/managedLessonTypes";

const BLOB_PATH = "mcv4u/content/lessons.json";
const LOCAL_PATH = path.join(process.cwd(), "data", "adminLessons.json");

export type ContentStorageMode = "vercel-blob" | "local-file" | "unconfigured";

function hasBlobCredentials() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function getContentStorageMode(): ContentStorageMode {
  if (hasBlobCredentials()) return "vercel-blob";
  if (process.env.VERCEL) return "unconfigured";
  return "local-file";
}

function isManagedLesson(value: unknown): value is ManagedLesson {
  if (!value || typeof value !== "object") return false;
  const lesson = value as Partial<ManagedLesson>;
  return Boolean(
    typeof lesson.id === "string" &&
      typeof lesson.slug === "string" &&
      typeof lesson.title === "string" &&
      typeof lesson.subtitle === "string" &&
      typeof lesson.summary === "string" &&
      typeof lesson.body === "string" &&
      Array.isArray(lesson.takeaways) &&
      lesson.takeaways.every((item) => typeof item === "string") &&
      typeof lesson.publishedAt === "string" &&
      typeof lesson.updatedAt === "string",
  );
}

function parseLessons(value: unknown): ManagedLesson[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isManagedLesson).sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
}

async function readLocalLessons() {
  try {
    const source = await fs.readFile(LOCAL_PATH, "utf8");
    return parseLessons(JSON.parse(source) as unknown);
  } catch (error) {
    const code = error instanceof Error && "code" in error ? String(error.code) : "";
    if (code === "ENOENT") return [];
    throw error;
  }
}

async function readBlobLessons() {
  const result = await list({ prefix: BLOB_PATH, limit: 10 });
  const blob = result.blobs.find((item) => item.pathname === BLOB_PATH);
  if (!blob) return [];
  const response = await fetch(`${blob.url}?read=${Date.now()}`, { cache: "no-store" });
  if (!response.ok) throw new Error("The published lesson file could not be read from Vercel Blob.");
  return parseLessons((await response.json()) as unknown);
}

export async function getManagedLessons(): Promise<ManagedLesson[]> {
  const mode = getContentStorageMode();
  if (mode === "vercel-blob") return readBlobLessons();
  if (mode === "local-file") return readLocalLessons();
  return [];
}

export async function getManagedLesson(slug: string) {
  const lessons = await getManagedLessons();
  return lessons.find((lesson) => lesson.slug === slug) ?? null;
}

export async function saveManagedLessons(lessons: ManagedLesson[]) {
  const mode = getContentStorageMode();
  const content = `${JSON.stringify(lessons, null, 2)}\n`;

  if (mode === "vercel-blob") {
    await put(BLOB_PATH, content, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60,
      contentType: "application/json; charset=utf-8",
    });
    return;
  }

  if (mode === "local-file") {
    await fs.writeFile(LOCAL_PATH, content, "utf8");
    return;
  }

  throw new Error("Lesson storage is not configured. Connect a Vercel Blob store to this project first.");
}
