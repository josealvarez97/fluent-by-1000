import { NextResponse } from "next/server";
import { getDefinition } from "@/lib/getCedict";

// https://nextjs.org/docs/app/api-reference/file-conventions/route#parameters
export async function GET(
  request: Request,
  { params }: { params: Promise<{ char: string }> }
) {
  const { char } = await params;

  if (!char || char.trim().length === 0) {
    return NextResponse.json({ error: "Missing character" }, { status: 400 });
  }

  const results = await getDefinition(char);

  if (!results || results.length === 0) {
    return NextResponse.json({ error: "Character not found" }, { status: 404 });
  }

  return NextResponse.json(results);
}
