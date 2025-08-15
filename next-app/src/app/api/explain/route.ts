import { groq } from "@ai-sdk/groq";
import { streamText, type ModelMessage } from "ai";
import type { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";

// export const runtime = "edge";

const redis = Redis.fromEnv();

async function makeKey(input: {
  sentence: string;
  char: string;
}): Promise<string> {
  const enc = new TextEncoder().encode(JSON.stringify(input));
  const digest = await crypto.subtle.digest("SHA-256", enc);
  const hex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `explain:${hex.slice(0, 40)}`;
}

export async function POST(req: NextRequest): Promise<Response> {
  const { sentence, char } = (await req.json()) as {
    sentence?: string;
    char?: string;
  };
  if (!sentence || !char)
    return new Response("Missing sentence or char", { status: 400 });

  const cacheKey = await makeKey({ sentence, char });

  // 1) Cache hit → return plain text (your reader concatenates bytes as-is)
  const cached = await redis.get<string>(cacheKey);
  if (cached) {
    return new Response(cached, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  // 2) Miss → stream model and tee to cache (still plain text)
  const messages: ModelMessage[] = [
    {
      role: "user",
      content: `In the Chinese sentence "${sentence}", what is the meaning or role of the character/word "${char}"? Please explain its usage in this context in English.`,
    },
  ];

  const ai = streamText({ model: groq("openai/gpt-oss-20b"), messages });

  let full = "";
  const encoder = new TextEncoder();

  const textStream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = ai.textStream.getReader();
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          if (value) {
            full += value; // buffer for cache
            controller.enqueue(encoder.encode(value)); // send raw bytes to client
          }
        }
      } finally {
        controller.close();
        // Cache for 24h; ignore failures so UX isn’t blocked
        redis
          .set(
            cacheKey,
            full
            // { ex: 60 * 60 * 24 }// keep cache forever
          )
          .catch(() => {});
      }
    },
  });

  return new Response(textStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
