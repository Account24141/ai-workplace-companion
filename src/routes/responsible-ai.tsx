import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Eye, Lock, ShieldCheck, UserCheck } from "lucide-react";

import { AppLayout } from "@/components/AppLayout";
import { AI_DISCLAIMER } from "@/components/AiDisclaimer";

export const Route = createFileRoute("/responsible-ai")({
  head: () => ({
    meta: [
      { title: "Responsible AI — Workplace AI Assistant" },
      {
        name: "description",
        content:
          "How to use AI-generated workplace content responsibly: verify accuracy, protect sensitive data and keep a human in the loop.",
      },
      { property: "og:title", content: "Responsible AI — Workplace AI Assistant" },
      {
        property: "og:description",
        content: "Guidelines for reviewing, verifying and safely using AI-generated work output.",
      },
    ],
  }),
  component: ResponsibleAi,
});

const principles = [
  {
    icon: UserCheck,
    title: "Human in the loop",
    body: "Every output here is a first draft. A person should always make the final call before anything is sent, shared or acted on.",
  },
  {
    icon: Eye,
    title: "Verify before you rely",
    body: "Check names, numbers, dates and commitments against your own records. Generated text can sound confident and still be wrong.",
  },
  {
    icon: Lock,
    title: "Protect sensitive information",
    body: "Avoid pasting confidential, personal or regulated data into AI tools unless your organisation has explicitly approved it.",
  },
  {
    icon: AlertTriangle,
    title: "Watch for bias and gaps",
    body: "Summaries may drop nuance or over-represent one viewpoint. Read for what is missing, not only for what is present.",
  },
];

function ResponsibleAi() {
  return (
    <AppLayout
      title="Responsible AI"
      description="Use AI assistance in a way that stays accurate, safe and accountable."
    >
      <section className="surface-card overflow-hidden">
        <div className="bg-navy p-6 text-navy-foreground md:p-8">
          <div className="flex items-center gap-2 text-sm font-medium text-navy-foreground/70">
            <ShieldCheck className="size-4" /> Disclaimer
          </div>
          <p className="mt-3 max-w-3xl font-display text-lg leading-relaxed md:text-xl">
            {AI_DISCLAIMER}
          </p>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {principles.map((p) => (
          <section key={p.title} className="surface-card p-5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-sky-soft text-primary">
              <p.icon className="size-5" />
            </span>
            <h2 className="mt-4 text-base font-semibold">{p.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
          </section>
        ))}
      </div>

      <section className="surface-card p-5 md:p-6">
        <h2 className="text-base font-semibold">How this prototype works</h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
          <li>• All generation is simulated in your browser — nothing you type leaves this page.</li>
          <li>• There is no account, database or stored history; refreshing clears your work.</li>
          <li>• Structured prompt templates are used internally to organise each request.</li>
          <li>• Every output area is editable so you can correct and finalise the draft yourself.</li>
        </ul>
      </section>
    </AppLayout>
  );
}
