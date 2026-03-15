interface JournalPromptsProps {
  prompts: string[];
}

export default function JournalPrompts({ prompts }: JournalPromptsProps) {
  if (prompts.length === 0) return null;

  return (
    <section className="mt-8 rounded-lg bg-card p-6">
      <h3 className="text-lg font-bold text-card-foreground mb-4 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          <path d="m15 5 4 4" />
        </svg>
        Journal &amp; Reflection
      </h3>
      <ol className="space-y-3">
        {prompts.map((prompt, i) => (
          <li
            key={i}
            className="flex gap-3 rounded-md border-l-4 border-accent bg-muted/50 p-4"
          >
            <span className="flex-shrink-0 font-bold text-accent">{i + 1}.</span>
            <p className="text-foreground">{prompt}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
