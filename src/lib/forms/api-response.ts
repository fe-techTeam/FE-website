import { NextResponse } from "next/server";

export function jsonOk(message: string) {
  return NextResponse.json({ ok: true, message });
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}
