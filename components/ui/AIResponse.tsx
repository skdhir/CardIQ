"use client";

/**
 * Renders AI-generated text with basic formatting:
 * - **bold** → <strong>
 * - Line breaks → <br> or paragraph splits
 * - Lines starting with "- " or "• " → bullet list
 * - Lines starting with a number+period → numbered list
 *
 * Intentionally lightweight — no full markdown parser needed.
 */
export default function AIResponse({ text, className = "" }: { text: string; className?: string }) {
  const paragraphs = text.split(/\n{2,}/);

  return (
    <div className={`space-y-2 ${className}`}>
      {paragraphs.map((para, pi) => {
        const lines = para.split("\n").filter((l) => l.trim());

        // Check if this paragraph is a list
        const isBulletList = lines.every((l) => /^[-•]\s/.test(l.trim()));
        const isNumberList = lines.every((l) => /^\d+[.)]\s/.test(l.trim()));

        if (isBulletList) {
          return (
            <ul key={pi} className="space-y-1 ml-1">
              {lines.map((line, li) => (
                <li key={li} className="flex gap-2 text-sm leading-relaxed">
                  <span className="text-brand-400 mt-0.5 shrink-0">&#x2022;</span>
                  <span>{formatInline(line.replace(/^[-•]\s*/, ""))}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (isNumberList) {
          return (
            <ol key={pi} className="space-y-1 ml-1">
              {lines.map((line, li) => (
                <li key={li} className="flex gap-2 text-sm leading-relaxed">
                  <span className="text-brand-500 font-semibold shrink-0">{li + 1}.</span>
                  <span>{formatInline(line.replace(/^\d+[.)]\s*/, ""))}</span>
                </li>
              ))}
            </ol>
          );
        }

        // Regular paragraph — join lines with <br>
        return (
          <p key={pi} className="text-sm leading-relaxed">
            {lines.map((line, li) => (
              <span key={li}>
                {li > 0 && <br />}
                {formatInline(line)}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

/** Convert **bold** and `code` inline markers to JSX */
function formatInline(text: string) {
  // Split on **bold** and `code` markers
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i} className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}
