import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ error: "La autenticación no está habilitada en el modo demostración" }, { status: 404 });
}

export function POST() {
  return NextResponse.json({ error: "La autenticación no está habilitada en el modo demostración" }, { status: 404 });
}
