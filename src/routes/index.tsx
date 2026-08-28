import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, NotebookPen, Search, Clock, ShieldCheck, Zap } from "lucide-react";

import { AppLayout } from "@/components/AppLayout";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "A clean AI workspace for professionals: draft emails, summarise meeting notes and research any topic — all in one dashboard.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Draft emails, summarise meetings and research topics from one professional dashboard.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email-generator",
    icon: Mail,
    name: "Smart Email Generator",
    body: "Describe the situation, choose a tone, and get a polished email draft you can edit and send.",
    cta: "Start drafting",
  },
  {
    to: "/meeting-summarizer",
    icon: NotebookPen,
    name: "Meeting Notes Summarizer",
    body: "Paste raw notes and get a structured summary with key points, action items, decisions and deadlines.",
    cta: "Summarize notes",
  },
  {
    to: "/research-assistant",
    icon: Search,
    name: "AI Research Assistant",
    body: "Drop in a topic or article and receive a clear summary, key insights and practical recommendations.",
    cta: "Generate insights",
  },
] as const;

const stats = [
  { icon: Zap, label: "Tools ready", value: "3" },
  { icon: Clock, label: "Typical draft time", value: "< 30s" },
  { icon: ShieldCheck, label: "Data stored", value: "None" },
];

function Dashboard() {
  return (
    <AppLayout
      title="Dashboard"
      description="Your AI workspace for writing, summarising and researching."
    >
      <section className="surface-card overflow-hidden">
        <div className="bg-navy p-6 text-navy-foreground md:p-9">
          <p className="text-sm font-medium text-navy-foreground/65">Welcome back, Zimbili</p>
          <h2 className="mt-2 max-w-2xl text-2xl leading-tight md:text-3xl">
            Spend less time on the writing, and more on the work that matters.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-navy-foreground/75">
            Pick a tool below to draft an email, turn messy meeting notes into clear actions, or get
            up to speed on a new topic.
          </p>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-3 md:px-9 md:py-6">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-sky-soft text-primary">
                <s.icon className="size-5" />
              </span>
              <div>
                <p className="font-display text-lg font-semibold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {tools.map((tool) => (
          <section key={tool.to} className="surface-card flex flex-col p-5 transition-shadow hover:shadow-lift">
            <span className="flex size-11 items-center justify-center rounded-xl bg-sky-soft text-primary">
              <tool.icon className="size-5" />
            </span>
            <h3 className="mt-4 text-base font-semibold">{tool.name}</h3>
            <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">{tool.body}</p>
            <Button asChild className="mt-5 w-full">
              <Link to={tool.to}>
                {tool.cta} <ArrowRight className="size-4" />
              </Link>
            </Button>
          </section>
        ))}
      </div>

      <AiDisclaimer />
    </AppLayout>
  );
}
