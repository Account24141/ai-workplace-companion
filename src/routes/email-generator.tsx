import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Eraser, Loader2, RefreshCw, Sparkles, Mail } from "lucide-react";
import { toast } from "sonner";

import { AppLayout } from "@/components/AppLayout";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useServerFn } from "@tanstack/react-start";
import type { Tone } from "@/lib/ai-demo";
import { generateEmailAi } from "@/lib/ai.functions";

export const Route = createFileRoute("/email-generator")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI Assistant" },
      {
        name: "description",
        content:
          "Draft professional workplace emails in seconds. Set the purpose, recipient and tone, then edit the generated draft.",
      },
      { property: "og:title", content: "Smart Email Generator — Workplace AI Assistant" },
      {
        property: "og:description",
        content: "Generate formal, friendly or persuasive professional emails and edit them inline.",
      },
    ],
  }),
  component: EmailGenerator,
});

function EmailGenerator() {
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState<Tone>("formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const generate = useServerFn(generateEmailAi);

  async function run() {
    if (!purpose.trim()) {
      toast.error("Add the email purpose or context first.");
      return;
    }
    setLoading(true);
    try {
      const { text } = await generate({ data: { purpose, recipient, tone } });
      setOutput(text);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not generate the email.");
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    navigator.clipboard.writeText(output);
    toast.success("Email copied to clipboard");
  }

  return (
    <AppLayout
      title="Smart Email Generator"
      description="Turn a short brief into a polished, ready-to-send email."
    >
      <section className="surface-card p-5 md:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="purpose">Email purpose or context</Label>
            <Textarea
              id="purpose"
              rows={4}
              placeholder="e.g. Follow up on the Q3 budget approval and ask for confirmation before Friday's review."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              placeholder="e.g. Lerato, Finance Manager"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="persuasive">Persuasive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button size="lg" onClick={run} disabled={loading}>
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {loading ? "Generating…" : "Generate Email"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setPurpose("");
              setRecipient("");
              setOutput("");
            }}
          >
            <Eraser className="size-4" /> Clear
          </Button>
        </div>
      </section>

      <section className="surface-card p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Generated email</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={copy} disabled={!output}>
              <Copy className="size-4" /> Copy
            </Button>
            <Button variant="outline" size="sm" onClick={run} disabled={!output || loading}>
              <RefreshCw className="size-4" /> Regenerate
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setOutput("")} disabled={!output}>
              <Eraser className="size-4" /> Clear
            </Button>
          </div>
        </div>

        <div className="mt-4">
          {loading ? (
            <div className="space-y-3">
              {[90, 70, 100, 80].map((w) => (
                <div
                  key={w}
                  className="h-4 animate-pulse rounded-full bg-muted"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
          ) : output ? (
            <Textarea
              rows={16}
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              className="resize-y bg-muted/40 leading-relaxed"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-12 text-center">
              <Mail className="size-6 text-muted-foreground" />
              <p className="text-sm font-medium">No draft yet</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Describe what the email needs to achieve, pick a tone, and your editable draft will
                appear here.
              </p>
            </div>
          )}
        </div>
      </section>

      <AiDisclaimer />
    </AppLayout>
  );
}
