import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqProps {
  items: FaqItem[];
  className?: string;
}

/**
 * FAQ list — DESIGN_SYSTEM.md §17: single-open mode ("only one at a time")
 * since that reads cleanest for a question/answer list.
 */
export function Faq({ items, className }: FaqProps) {
  return (
    <Accordion type="single" collapsible className={className}>
      {items.map((item, index) => (
        <AccordionItem key={item.question} value={`item-${index}`}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>
            <p className="max-w-measure text-content-secondary">
              {item.answer}
            </p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
