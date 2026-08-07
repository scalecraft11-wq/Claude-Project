import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  tone = "default",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "brand" | "sale" | "new";
}) {
  const tones: Record<string, string> = {
    default: "bg-white/90 text-fg border-border-subtle",
    brand: "bg-brand text-white border-brand",
    sale: "bg-brand-3 text-white border-brand-3",
    new: "bg-[#181818] text-white border-[#181818]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
