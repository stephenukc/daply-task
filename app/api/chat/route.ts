import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export async function POST(req: Request) {
  try {
    const { messages, universalPrompt } = await req.json();

    if (!Array.isArray(messages)) {
      return new Response("Invalid request: 'messages' must be an array", {
        status: 400,
      });
    }

    const fullMessages = [
      ...(universalPrompt
        ? [{ role: "system", content: universalPrompt }]
        : []),
      ...messages,
    ];

    const result = await streamText({
      model: google("models/gemini-2.5-pro"),
      messages: fullMessages,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("Chat route error:", {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
      raw: error,
    });
    return new Response("Internal Server Error", { status: 500 });
  }
}
