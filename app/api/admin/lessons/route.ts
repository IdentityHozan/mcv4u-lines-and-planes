import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import type { ManagedLesson, ManagedLessonInput } from "@/data/managedLessonTypes";
import { conceptModules } from "@/data/linesAndPlanesData";
import { isAdminRequest } from "@/lib/adminAuth";
import { getContentStorageMode, getManagedLessons, saveManagedLessons } from "@/lib/contentStore";

function unauthorized() {
  return NextResponse.json({ error: "Admin sign-in is required." }, { status: 401 });
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function readInput(value: unknown): ManagedLessonInput | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const subtitle = typeof input.subtitle === "string" ? input.subtitle.trim() : "";
  const summary = typeof input.summary === "string" ? input.summary.trim() : "";
  const body = typeof input.body === "string" ? input.body.trim() : "";
  const slug = slugify(typeof input.slug === "string" && input.slug.trim() ? input.slug : title);
  const equation = typeof input.equation === "string" ? input.equation.trim() : "";
  const videoUrl = typeof input.videoUrl === "string" ? input.videoUrl.trim() : "";
  const takeaways = Array.isArray(input.takeaways)
    ? input.takeaways.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean).slice(0, 12)
    : [];

  if (!title || !subtitle || !summary || !body || !slug) return null;
  if (videoUrl && !/^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(videoUrl)) return null;
  return { title, subtitle, summary, body, slug, equation: equation || undefined, videoUrl: videoUrl || undefined, takeaways };
}

function slugUnavailable(slug: string, lessons: ManagedLesson[], currentId?: string) {
  return conceptModules.some((lesson) => lesson.id === slug) || lessons.some((lesson) => lesson.slug === slug && lesson.id !== currentId);
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();
  try {
    return NextResponse.json({ lessons: await getManagedLessons(), storage: getContentStorageMode() });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Lessons could not be loaded." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();
  const input = readInput(await request.json().catch(() => null));
  if (!input) return NextResponse.json({ error: "Complete every required field and check the video URL." }, { status: 400 });

  try {
    const lessons = await getManagedLessons();
    if (slugUnavailable(input.slug, lessons)) return NextResponse.json({ error: "That lesson URL is already in use." }, { status: 409 });
    const now = new Date().toISOString();
    const lesson: ManagedLesson = { ...input, id: randomUUID(), publishedAt: now, updatedAt: now };
    await saveManagedLessons([...lessons, lesson]);
    return NextResponse.json({ lesson }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "The lesson could not be saved." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();
  const body = (await request.json().catch(() => null)) as ({ id?: unknown } & Record<string, unknown>) | null;
  const id = body && typeof body.id === "string" ? body.id : "";
  const input = readInput(body);
  if (!id || !input) return NextResponse.json({ error: "The lesson data is incomplete." }, { status: 400 });

  try {
    const lessons = await getManagedLessons();
    const existing = lessons.find((lesson) => lesson.id === id);
    if (!existing) return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
    if (slugUnavailable(input.slug, lessons, id)) return NextResponse.json({ error: "That lesson URL is already in use." }, { status: 409 });
    const updated: ManagedLesson = { ...existing, ...input, updatedAt: new Date().toISOString() };
    await saveManagedLessons(lessons.map((lesson) => (lesson.id === id ? updated : lesson)));
    return NextResponse.json({ lesson: updated });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "The lesson could not be updated." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "A lesson ID is required." }, { status: 400 });

  try {
    const lessons = await getManagedLessons();
    if (!lessons.some((lesson) => lesson.id === id)) return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
    await saveManagedLessons(lessons.filter((lesson) => lesson.id !== id));
    return NextResponse.json({ deleted: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "The lesson could not be deleted." }, { status: 500 });
  }
}
