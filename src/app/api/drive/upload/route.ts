import { NextResponse } from "next/server";

export function POST() {
  return NextResponse.json(
    { error: "La integración de Google Drive no está habilitada en el modo demostración" },
    { status: 404 },
  );
}
