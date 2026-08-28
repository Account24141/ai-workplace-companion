import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Eraser, Loader2, NotebookPen, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { AppLayout } from "@/components/AppLayout";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { OutputBlock } from "@/components/OutputBlock";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useServerFn } from "@tanstack/react-start";
import type { MeetingSummary } from "@/lib/ai-demo";
import { summarizeMeetingAi } from "@/lib/ai.functions";

export const Route = createFileRoute("/meeting-summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workplace AI Assistant" },
      {
        name: "description",
        content:
          "Paste long meeting notes and get an editable summary with key points, action items, decisions and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Workplace AI Assistant" },
      {
        property: "og:description",
        content: "Turn messy meeting notes into structured, editable summaries in seconds.",
      },
    ],
  }),
  component: MeetingSummarizer,
});

function MeetingSummarizer() {
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<MeetingSummary | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    if (notes.trim().length < 20) {
      toast.error("Paste a few lines of meeting notes first.");
      return;
    }
    setLoading(true);
    void buildMeetingPrompt(notes);
    setResult(await simulate(generateMeetingSummary(notes), 1500));
    setLoading(false);
  }

  function copy() {
    if (!result) return;
    navigator.clipboard.writeText(
      [
        `MEETING SUMMARY\n${result.summary}`,
        `KEY POINTS\n${result.keyPoints}`,
        `ACTION ITEMS\n${result.actionItems}`,
        `DECISIONS MADE\n${result.decisions}`,
        `DEADLINES\n${result.deadlines}`,
      ].join("\n\n"),
    );
    toast.success("Summary copied to clipboard");
  }

  const patch = (key: keyof MeetingSummary) => (value: string) =>
    setResult((prev) => (prev ? { ...prev, [key]: value } : prev));

  return (
    <AppLayout
      title="Meeting Notes Summarizer"
      description="Condense long notes into decisions, owners and deadlines."
    >
      <section className="surface-card p-5 md:p-6">
        <div className="space-y-2">
          <Label htmlFor="notes">Meeting notes</Label>
          <Textarea
            id="notes"
            rows={12}
            placeholder="Paste your raw meeting notes here — agenda points, discussion, who said what, any dates mentioned. The messier the better."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            {notes.trim() ? `${notes.trim().split(/\s+/).length} words` : "Nothing pasted yet"}
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button size="lg" onClick={run} disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {loading ? "Summarizing…" : "Summarize Meeting"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setNotes("");
              setResult(null);
            }}
          >
            <Eraser className="size-4" /> Clear
          </Button>
        </div>
      </section>

      <section className="surface-card p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Structured summary</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copy} disabled={!result}>
              <Copy className="size-4" /> Copy
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setResult(null)} disabled={!result}>
              <Eraser className="size-4" /> Clear
            </Button>
          </div>
        </div>

        <div className="mt-4">
          {loading ? (
            <div className="space-y-3">
              {[95, 75, 88, 60, 92].map((w) => (
                <div
                  key={w}
                  className="h-4 animate-pulse rounded-full bg-muted"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
          ) : result ? (
            <div className="space-y-5">
              <OutputBlock label="Meeting Summary" value={result.summary} onChange={patch("summary")} />
              <OutputBlock label="Key Points" value={result.keyPoints} onChange={patch("keyPoints")} />
              <OutputBlock
                label="Action Items"
                value={result.actionItems}
                onChange={patch("actionItems")}
              />
              <OutputBlock
                label="Decisions Made"
                value={result.decisions}
                onChange={patch("decisions")}
              />
              <OutputBlock label="Deadlines" value={result.deadlines} onChange={patch("deadlines")} />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-12 text-center">
              <NotebookPen className="size-6 text-muted-foreground" />
              <p className="text-sm font-medium">No summary yet</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Paste your notes above and the summary, key points, action items, decisions and
                deadlines will appear here — all editable.
              </p>
            </div>
          )}
        </div>
      </section>

      <AiDisclaimer />
    </AppLayout>
  );
}
