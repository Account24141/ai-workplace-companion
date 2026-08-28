import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.7-flash";

async function callGateway(system: string, user: string, jsonMode = false) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured for this app.");

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("Too many requests right now — please try again shortly.");
    if (res.status === 402)
      throw new Error("AI credits are exhausted for this workspace. Add credits to continue.");
    throw new Error(`AI request failed (${res.status}). ${detail.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("The AI returned an empty response. Please try again.");
  return text;
}

function parseJson<T>(raw: string): T {
  const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  return JSON.parse(cleaned) as T;
}

/* ---------------- Email generator ---------------- */

export const generateEmailAi = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        purpose: z.string().min(1),
        recipient: z.string().default(""),
        tone: z.enum(["formal", "friendly", "persuasive"]),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const text = await callGateway(
      "You are an expert workplace communication assistant. Write complete, specific, ready-to-send professional emails. Never use placeholders like [Name] unless no name is given. Output plain text only: a 'Subject:' line, greeting, 2-3 concise paragraphs, a clear call to action, and a sign-off.",
      [
        `Tone: ${data.tone}`,
        `Recipient: ${data.recipient || "unspecified"}`,
        `Purpose / context: ${data.purpose}`,
      ].join("\n"),
    );
    return { text };
  });

/* ---------------- Meeting summarizer ---------------- */

const meetingSchema = z.object({
  summary: z.string(),
  keyPoints: z.string(),
  actionItems: z.string(),
  decisions: z.string(),
  deadlines: z.string(),
});

export const summarizeMeetingAi = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ notes: z.string().min(10) }).parse(input))
  .handler(async ({ data }) => {
    const raw = await callGateway(
      "You summarize workplace meeting notes. Respond with JSON only, matching this shape: {\"summary\": string, \"keyPoints\": string, \"actionItems\": string, \"decisions\": string, \"deadlines\": string}. Each field except summary is a newline-separated list using '• ' bullets. Base everything strictly on the notes; if a section has nothing, say so briefly.",
      `Meeting notes:\n\n${data.notes}`,
      true,
    );
    return meetingSchema.parse(parseJson(raw));
  });

/* ---------------- Research assistant ---------------- */

const researchSchema = z.object({
  summary: z.string(),
  insights: z.string(),
  recommendations: z.string(),
});

export const researchAi = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ topic: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const raw = await callGateway(
      "You are a research analyst for business professionals. Respond with JSON only, matching this shape: {\"summary\": string, \"insights\": string, \"recommendations\": string}. summary is 3-5 sentences. insights and recommendations are newline-separated '• ' bullets that are concrete and specific to the input.",
      `Topic or article:\n\n${data.topic}`,
      true,
    );
    return researchSchema.parse(parseJson(raw));
  });
