import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Eraser, Loader2, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { AppLayout } from "@/components/AppLayout";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { OutputBlock } from "@/components/OutputBlock";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useServerFn } from "@tanstack/react-start";
import type { ResearchOutput } from "@/lib/ai-demo";
import { researchAi } from "@/lib/ai.functions";

export const Route = createFileRoute("/research-assistant")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workplace AI Assistant" },
      {
        name: "description",
        content:
          "Enter a research topic or paste an article to get an editable summary, key insights and practical recommendations.",
      },
      { property: "og:title", content: "AI Research Assistant — Workplace AI Assistant" },
      {
        property: "og:description",
        content: "Summaries, insights and recommendations for any topic or article you paste in.",
      },
    ],
  }),
  component: ResearchAssistant,
});

function ResearchAssistant() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<ResearchOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const research = useServerFn(researchAi);

  async function run() {
    if (!topic.trim()) {
      toast.error("Enter a topic or paste an article first.");
      return;
    }
    setLoading(true);
    try {
      setResult(await research({ data: { topic } }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not generate insights.");
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    if (!result) return;
    navigator.clipboard.writeText(
      [
        `SUMMARY\n${result.summary}`,
        `KEY INSIGHTS\n${result.insights}`,
        `RECOMMENDATIONS\n${result.recommendations}`,
      ].join("\n\n"),
    );
    toast.success("Insights copied to clipboard");
  }

  const patch = (key: keyof ResearchOutput) => (value: string) =>
    setResult((prev) => (prev ? { ...prev, [key]: value } : prev));

  return (
    <AppLayout
      title="AI Research Assistant"
      description="Get to the point of any topic or article, fast."
    >
      <section className="surface-card p-5 md:p-6">
        <div className="space-y-2">
          <Label htmlFor="topic">Research topic or article content</Label>
          <Textarea
            id="topic"
            rows={10}
            placeholder="e.g. How are mid-sized companies adopting AI for internal operations? — or paste the full text of an article."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button size="lg" onClick={run} disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {loading ? "Analysing…" : "Generate Insights"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setTopic("");
              setResult(null);
            }}
          >
            <Eraser className="size-4" /> Clear
          </Button>
        </div>
      </section>

      <section className="surface-card p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Research output</h2>
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
              {[92, 78, 96, 64].map((w) => (
                <div
                  key={w}
                  className="h-4 animate-pulse rounded-full bg-muted"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
          ) : result ? (
            <div className="space-y-5">
              <OutputBlock label="Summary" value={result.summary} onChange={patch("summary")} rows={5} />
              <OutputBlock label="Key Insights" value={result.insights} onChange={patch("insights")} />
              <OutputBlock
                label="Recommendations"
                value={result.recommendations}
                onChange={patch("recommendations")}
                rows={5}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-12 text-center">
              <Search className="size-6 text-muted-foreground" />
              <p className="text-sm font-medium">Nothing analysed yet</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Add a topic or paste an article, then generate an editable summary, insights and
                recommendations.
              </p>
            </div>
          )}
        </div>
      </section>

      <AiDisclaimer />
    </AppLayout>
  );
}
