"use client";

import { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type Props = { className?: string; children: ReactNode };

export function Accordion({ className, children }: Props) {
  return <div className={className}>{children}</div>;
}

export function AccordionItem({
  className,
  children,
  defaultOpen = false,
}: Props & { defaultOpen?: boolean }) {
  return (
    <details
      open={defaultOpen}
      className={`group rounded-2xl border border-slate-200 bg-white shadow-sm ${className || ""}`}
    >
      {children}
    </details>
  );
}

export function AccordionTrigger({ className, children, ...props }: Props & React.HTMLAttributes<HTMLElement>) {
  return (
    <summary
      className={`flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 font-semibold text-[#0A1F44] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2BB673] rounded-2xl ${className || ""}`}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
    </summary>
  );
}

export function AccordionContent({ className, children, ...props }: Props & React.HTMLAttributes<HTMLElement>) {
  return (
    <div className={`px-5 pb-5 pt-1 text-slate-700 ${className || ""}`} {...props}>
      {children}
    </div>
  );
}

export default Accordion;

