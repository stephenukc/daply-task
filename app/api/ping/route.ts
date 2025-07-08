import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export async function GET() {
  try {
    const result = await streamText({
      model: google("models/gemini-2.5-pro"),
      messages: [{ role: "user", content: "Say hello" }],
    });

    return result.toDataStreamResponse();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Chat route error:", {
        message: error.message,
        stack: error.stack,
      });
    } else {
      console.error("Chat route error (unknown):", error);
    }

    return new Response("Internal Server Error", { status: 500 });
  }
}
