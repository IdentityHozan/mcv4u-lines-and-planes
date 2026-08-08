import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";

export const ADMIN_COOKIE = "mcv4u_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24;

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

function safeEqual(first: string, second: string) {
  const firstBuffer = Buffer.from(first);
  const secondBuffer = Buffer.from(second);
  return firstBuffer.length === secondBuffer.length && timingSafeEqual(firstBuffer, secondBuffer);
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function validateAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected && safeEqual(password, expected));
}

export function createAdminSession() {
  const issuedAt = Math.floor(Date.now() / 1000).toString();
  return `${issuedAt}.${sign(issuedAt)}`;
}

export function validateAdminSession(value: string | undefined) {
  if (!value || !isAdminConfigured()) return false;
  const [issuedAtText, signature] = value.split(".");
  if (!issuedAtText || !signature || !safeEqual(signature, sign(issuedAtText))) return false;
  const issuedAt = Number(issuedAtText);
  const age = Math.floor(Date.now() / 1000) - issuedAt;
  return Number.isFinite(issuedAt) && age >= 0 && age <= SESSION_DURATION_SECONDS;
}

export function isAdminRequest(request: NextRequest) {
  return validateAdminSession(request.cookies.get(ADMIN_COOKIE)?.value);
}

export function setAdminSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_COOKIE, createAdminSession(), {
    httpOnly: true,
    maxAge: SESSION_DURATION_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
