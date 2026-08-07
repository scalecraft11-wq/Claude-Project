"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";

const subjects = ["General Inquiry", "Order Support", "Wholesale", "Press", "Careers"];

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-success/25 bg-success/5 px-8 py-16 text-center"
      >
        <CheckCircle2 size={40} className="text-success" />
        <h3 className="font-display text-2xl font-bold uppercase tracking-tight">
          Message Sent
        </h3>
        <p className="max-w-sm text-sm text-fg-muted">
          Thanks for reaching out. Our team will get back to you within one
          business day.
        </p>
        <Button variant="outline" onClick={() => setSubmitted(false)}>
          Send Another Message
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-fg-faint">
            Full Name
          </label>
          <input
            required
            placeholder="Jane Doe"
            className="rounded-xl border border-border-subtle bg-surface px-4 py-3 text-sm text-fg placeholder:text-fg-faint focus:border-brand focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-fg-faint">
            Email
          </label>
          <input
            required
            type="email"
            placeholder="jane@email.com"
            className="rounded-xl border border-border-subtle bg-surface px-4 py-3 text-sm text-fg placeholder:text-fg-faint focus:border-brand focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-widest text-fg-faint">
          Subject
        </label>
        <select
          required
          defaultValue=""
          className="appearance-none rounded-xl border border-border-subtle bg-surface px-4 py-3 text-sm text-fg focus:border-brand focus:outline-none"
        >
          <option value="" disabled>
            Select a topic
          </option>
          {subjects.map((s) => (
            <option key={s} value={s} className="bg-surface">
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-widest text-fg-faint">
          Message
        </label>
        <textarea
          required
          rows={5}
          placeholder="Tell us how we can help..."
          className="resize-none rounded-xl border border-border-subtle bg-surface px-4 py-3 text-sm text-fg placeholder:text-fg-faint focus:border-brand focus:outline-none"
        />
      </div>

      <Button type="submit" size="lg" disabled={loading} className="mt-2">
        <AnimatePresence mode="wait" initial={false}>
          {loading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Sending...
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Send size={16} />
              Send Message
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </form>
  );
}
