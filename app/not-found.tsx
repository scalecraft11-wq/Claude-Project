import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] items-center overflow-hidden py-20">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/22 blur-[140px]" />
      <Container className="relative flex flex-col items-center text-center">
        <span className="font-display text-[9rem] font-extrabold leading-none text-black/[0.05] sm:text-[12rem]">
          404
        </span>
        <h1 className="-mt-6 font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
          Off the beaten path
        </h1>
        <p className="mt-4 max-w-md text-fg-muted">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
          Let&rsquo;s get you back on track.
        </p>
        <ButtonLink href="/" size="lg" className="mt-8">
          Back to Home
          <ArrowRight size={16} />
        </ButtonLink>
      </Container>
    </div>
  );
}
