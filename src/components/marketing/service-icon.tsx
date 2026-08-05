import {
  Boxes,
  Gauge,
  PenTool,
  Rocket,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import type { LucideProps } from "lucide-react";

import type { Service } from "@/lib/data/services";

const ICONS: Record<Service["icon"], React.ComponentType<LucideProps>> = {
  Sparkles,
  Boxes,
  ShoppingBag,
  PenTool,
  Gauge,
  Rocket,
};

export function ServiceIcon({
  name,
  ...props
}: { name: Service["icon"] } & LucideProps) {
  const Icon = ICONS[name];
  return <Icon {...props} />;
}
