import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    // Teach tailwind-merge the library's custom theme keys, so `text-ui`
    // (a size) never cancels `text-ink` (a color), and so on.
    theme: {
      text: ["ui"],
      radius: ["ui", "box"],
      shadow: ["pop", "modal"],
      ease: ["snap", "drawer"],
    },
  },
});

/** Join class names; later Tailwind classes win over earlier conflicting ones. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
