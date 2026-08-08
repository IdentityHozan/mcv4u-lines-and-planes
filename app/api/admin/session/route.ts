import { NextRequest, NextResponse } from "next/server";
import {
  clearAdminSessionCookie,
  isAdminConfigured,
  isAdminRequest,
  setAdminSessionCookie,
  validateAdminPassword,
} from "@/lib/adminAuth";
import { getContentStorageMode } from "@/lib/contentStore";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    authenticated: isAdminRequest(request),
    configured: isAdminConfigured(),
    storage: getContentStorageMode(),
  });
}

export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "ADMIN_PASSWORD is not configured." }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as { password?: unknown } | null;
  if (!body || typeof body.password !== "string" || !validateAdminPassword(body.password)) {
    return NextResponse.json({ error: "The password is incorrect." }, { status: 401 });
  }

  const response = NextResponse.json({ authenticated: true, storage: getContentStorageMode() });
  setAdminSessionCookie(response);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  clearAdminSessionCookie(response);
  return response;
}
