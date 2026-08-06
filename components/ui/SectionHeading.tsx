import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border-subtle bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {description && (
        <p className={cn("max-w-xl text-base text-fg-muted sm:text-lg", align === "center" && "mx-auto")}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
