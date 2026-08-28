/**
 * Frontend-only simulated AI generation.
 * Structured prompt templates are built here for transparency, then a
 * realistic demo response is produced locally — no backend involved.
 */

export type Tone = "formal" | "friendly" | "persuasive";

export const simulate = <T,>(value: T, ms = 1400): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export function buildEmailPrompt(input: {
  purpose: string;
  recipient: string;
  tone: Tone;
}) {
  return [
    "ROLE: Professional workplace communication assistant.",
    `RECIPIENT: ${input.recipient || "the recipient"}`,
    `TONE: ${input.tone}`,
    `PURPOSE / CONTEXT: ${input.purpose}`,
    "FORMAT: subject line, greeting, 2-3 concise paragraphs, clear call to action, sign-off.",
  ].join("\n");
}

export function generateEmail(input: {
  purpose: string;
  recipient: string;
  tone: Tone;
}) {
  const name = input.recipient.trim() || "there";
  const purpose = input.purpose.trim() || "the item we discussed";
  const topic = purpose.replace(/\.$/, "");

  const openers: Record<Tone, string> = {
    formal: `Dear ${name},\n\nI hope this message finds you well. I am writing regarding ${topic}.`,
    friendly: `Hi ${name},\n\nHope your week is going well! I wanted to reach out about ${topic}.`,
    persuasive: `Hi ${name},\n\nI'll be brief, because I think ${topic} is worth your attention this week.`,
  };

  const bodies: Record<Tone, string> = {
    formal:
      "To ensure we remain aligned, I have summarised the current position and the outstanding items below. Please review at your convenience and advise if any details require amendment.\n\nI would welcome the opportunity to confirm next steps and agree on a timeline that works for your team.",
    friendly:
      "I've pulled together a quick summary of where things stand and what's still open, so nothing slips through the cracks. Nothing here is urgent, but it would help to get your read on it.\n\nHappy to jump on a short call if that's easier than trading emails.",
    persuasive:
      "Acting now gives us a clear advantage: less rework later, a shorter delivery window, and a much smoother experience for the people who depend on this. The effort on your side is small — a quick confirmation and one decision.\n\nIf we lock this in this week, we stay ahead of the deadline instead of chasing it.",
  };

  const closers: Record<Tone, string> = {
    formal: "Could you kindly confirm your availability before Friday?\n\nKind regards,\nZimbili",
    friendly: "Could you let me know your thoughts by Friday?\n\nThanks so much,\nZimbili",
    persuasive: "Can I get your go-ahead by Thursday so we can start immediately?\n\nBest,\nZimbili",
  };

  const subjects: Record<Tone, string> = {
    formal: `Subject: ${capitalise(topic)} — request for confirmation`,
    friendly: `Subject: Quick one about ${topic}`,
    persuasive: `Subject: ${capitalise(topic)} — a small decision with a big payoff`,
  };

  return `${subjects[input.tone]}\n\n${openers[input.tone]}\n\n${bodies[input.tone]}\n\n${closers[input.tone]}`;
}

export function buildMeetingPrompt(notes: string) {
  return [
    "ROLE: Meeting analyst.",
    "TASK: Summarise the notes into Summary, Key Points, Action Items, Decisions Made, Deadlines.",
    "RULES: Preserve owners and dates. Do not invent commitments.",
    `NOTES: ${notes.slice(0, 4000)}`,
  ].join("\n");
}

export type MeetingSummary = {
  summary: string;
  keyPoints: string;
  actionItems: string;
  decisions: string;
  deadlines: string;
};

export function generateMeetingSummary(notes: string): MeetingSummary {
  const words = notes.trim().split(/\s+/).filter(Boolean).length;
  return {
    summary: `The team reviewed current delivery progress, surfaced blockers, and agreed on priorities for the coming sprint. Notes analysed: ${words} words. Overall sentiment was constructive, with the main tension being scope versus the end-of-quarter deadline.`,
    keyPoints: [
      "• Delivery is broadly on track, with two workstreams behind schedule.",
      "• The onboarding flow is the biggest driver of drop-off and needs redesign.",
      "• Support volume increased, mostly repeat questions that documentation could absorb.",
      "• Budget for the next quarter is confirmed but not yet allocated per team.",
    ].join("\n"),
    actionItems: [
      "• Thabo — draft the revised onboarding flow and share for feedback.",
      "• Lerato — audit the top 10 support tickets and propose help-centre articles.",
      "• Zimbili — circulate the sprint plan with updated owners.",
      "• Sipho — confirm vendor pricing before the budget split is finalised.",
    ].join("\n"),
    decisions: [
      "• Onboarding redesign is the priority for the next sprint.",
      "• The reporting module is deferred to the following quarter.",
      "• Weekly check-ins move to 30 minutes with a written pre-read.",
    ].join("\n"),
    deadlines: [
      "• Onboarding draft — Wednesday next week.",
      "• Support ticket audit — end of this week.",
      "• Sprint plan circulated — within 48 hours.",
      "• Budget allocation sign-off — end of month.",
    ].join("\n"),
  };
}

export function buildResearchPrompt(topic: string) {
  return [
    "ROLE: Research analyst for busy professionals.",
    "TASK: Produce Summary, Key Insights, Recommendations.",
    "RULES: Neutral tone, flag uncertainty, prefer actionable framing.",
    `INPUT: ${topic.slice(0, 4000)}`,
  ].join("\n");
}

export type ResearchOutput = {
  summary: string;
  insights: string;
  recommendations: string;
};

export function generateResearch(topic: string): ResearchOutput {
  const subject = topic.trim().split(/\s+/).slice(0, 8).join(" ") || "the topic";
  return {
    summary: `${capitalise(subject)} is moving from early experimentation to practical, measurable adoption. Organisations seeing real gains treat it as a workflow change rather than a tool purchase: they narrow the use case, measure the baseline first, and keep a human reviewer in the loop for anything customer-facing or high-risk.`,
    insights: [
      "• Value concentrates in repetitive, text-heavy work: drafting, summarising, and triage.",
      "• Teams that define a quality bar up front adopt roughly twice as fast as teams that don't.",
      "• The main failure mode is trust, not capability — unreviewed output erodes confidence quickly.",
      "• Cost and effort are dominated by process redesign and training, not the technology itself.",
    ].join("\n"),
    recommendations: [
      "1. Pick one workflow with a clear before/after metric and pilot for four weeks.",
      "2. Publish a short review checklist so every output is verified the same way.",
      "3. Track time saved and error rate together, so speed gains aren't hiding quality losses.",
      "4. Document what worked as a reusable template before expanding to a second team.",
    ].join("\n"),
  };
}

function capitalise(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
