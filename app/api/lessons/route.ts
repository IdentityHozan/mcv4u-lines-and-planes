import { NextResponse } from "next/server";
import { getManagedLessons } from "@/lib/contentStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ lessons: await getManagedLessons() }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ lessons: [] }, { headers: { "Cache-Control": "no-store" } });
  }
}
