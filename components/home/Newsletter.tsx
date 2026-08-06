"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-border-subtle bg-gradient-to-br from-bg-elevated-2 via-surface to-bg-elevated-2 px-8 py-12 sm:px-14 sm:py-16">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/20 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brand-2/20 blur-[100px]" />

      <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-md">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand">
            Join The Movement
          </span>
          <h3 className="mt-3 font-display text-3xl font-extrabold uppercase leading-[0.95] sm:text-4xl">
            Get 15% off your first order
          </h3>
          <p className="mt-3 text-sm text-fg-muted">
            Sign up for early access to drops, restocks, and members-only pricing.
          </p>
        </div>

        <div className="w-full max-w-md">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 rounded-full border border-brand/40 bg-brand/10 px-5 py-4 text-sm font-medium text-brand"
            >
              <Check size={18} />
              You&rsquo;re on the list. Welcome to Velocity.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full flex-1 rounded-full border border-border-strong bg-bg/60 px-5 py-3.5 text-sm text-fg placeholder:text-fg-faint focus:border-brand focus:outline-none"
              />
              <Button type="submit" className="shrink-0">
                Subscribe
                <ArrowRight size={15} />
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
