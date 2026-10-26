import { Button, cn } from "@nils/ui";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export function CopyButton({ text, label = "Copy", className }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1200);
    return () => clearTimeout(t);
  }, [copied]);
  return (
    <Button
      variant="ghost"
      size="sm"
      icon
      aria-label={copied ? "Copied" : label}
      className={className}
      onClick={() => {
        void navigator.clipboard.writeText(text);
        setCopied(true);
      }}
    >
      <span className="relative size-4">
        <CopyIcon className={cn("absolute inset-0 transition-[opacity,scale] duration-150", copied ? "scale-50 opacity-0" : "scale-100 opacity-100")} />
        <CheckIcon weight="bold" className={cn("absolute inset-0 text-ok transition-[opacity,scale] duration-150", copied ? "scale-100 opacity-100" : "scale-50 opacity-0")} />
      </span>
    </Button>
  );
}
