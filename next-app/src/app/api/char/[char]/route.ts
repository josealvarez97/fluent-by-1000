import { NextResponse } from "next/server";
import { getDefinition } from "@/lib/getCedict";

export async function GET(
  request: Request,
  { params }: { params: { char: string } }
) {
  const char = params.char;

  if (!char || char.trim().length === 0) {
    return NextResponse.json({ error: "Missing character" }, { status: 400 });
  }

  const results = await getDefinition(char);

  if (!results || results.length === 0) {
    return NextResponse.json({ error: "Character not found" }, { status: 404 });
  }

  return NextResponse.json(results);
}
