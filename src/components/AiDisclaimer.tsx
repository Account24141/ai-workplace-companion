import { ShieldCheck } from "lucide-react";

export const AI_DISCLAIMER =
  "AI-generated content may contain inaccuracies or incomplete information. Always review and verify generated content before using it for important professional decisions or communications.";

export function AiDisclaimer() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-sky-soft/70 p-4">
      <ShieldCheck className="mt-0.5 size-4.5 shrink-0 text-primary" />
      <p className="text-sm leading-relaxed text-secondary-foreground">{AI_DISCLAIMER}</p>
    </div>
  );
}
