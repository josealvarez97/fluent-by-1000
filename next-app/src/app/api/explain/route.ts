import { groq } from "@ai-sdk/groq";
import { ModelMessage, streamText } from "ai";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { sentence, char } = await req.json();
    if (!sentence || !char) {
      return new Response("Missing sentence or char", { status: 400 });
    }

    const messages = [
      {
        role: "user",
        content: `In the Chinese sentence "${sentence}", what is the meaning or role of the character/word "${char}"? Please explain its usage in this context in English.`,
      },
    ];

    const response = streamText({
      model: groq("openai/gpt-oss-20b"),
      messages: messages as ModelMessage[],
    });

    return response.toTextStreamResponse({
      headers: {
        "Content-Type": "text/event-stream",
      },
    });
  } catch (err) {
    console.error("Error in AI route:", err);
    return new Response("Failed to get AI explanation", { status: 500 });
  }
}
