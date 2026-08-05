"use client";

import { Star } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";

import { submitReviewAction } from "@/lib/shop/actions/reviews";
import { cn } from "@/lib/utils";

export function ReviewForm({
  productSlug,
  canReview,
}: {
  productSlug: string;
  canReview: boolean;
}) {
  const [rating, setRating] = React.useState(0);
  const [isPending, startTransition] = React.useTransition();
  const [fieldErrors, setFieldErrors] = React.useState<
    Record<string, string[]>
  >({});
  const [submitted, setSubmitted] = React.useState(false);

  if (!canReview) {
    return (
      <p className="text-body-sm text-content-secondary">
        <a href="/login" className="underline">
          Sign in
        </a>{" "}
        to leave a review.
      </p>
    );
  }

  if (submitted) {
    return (
      <p className="text-body-sm text-content-secondary">
        Thanks! Your review will appear after a quick moderation check.
      </p>
    );
  }

  return (
    <form
      className="grid max-w-measure gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        startTransition(async () => {
          const result = await submitReviewAction(productSlug, {
            rating,
            title: String(form.get("title") ?? ""),
            body: String(form.get("body") ?? ""),
          });
          if (result.success) {
            setSubmitted(true);
            toast.success(result.message);
          } else {
            setFieldErrors(result.fieldErrors ?? {});
            toast.error(result.message);
          }
        });
      }}
    >
      <div
        className="flex items-center gap-1"
        role="radiogroup"
        aria-label="Rating"
      >
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={rating === value}
            aria-label={`${value} star${value === 1 ? "" : "s"}`}
            onClick={() => setRating(value)}
          >
            <Star
              className={cn(
                "size-6",
                value <= rating
                  ? "fill-accent text-accent"
                  : "text-content-muted",
              )}
            />
          </button>
        ))}
      </div>
      {fieldErrors.rating && (
        <p className="text-body-sm text-danger">{fieldErrors.rating[0]}</p>
      )}

      <Input name="title" placeholder="Review title" required maxLength={120} />
      {fieldErrors.title && (
        <p className="text-body-sm text-danger">{fieldErrors.title[0]}</p>
      )}

      <Textarea
        name="body"
        placeholder="Share your experience with this product"
        required
        rows={4}
        maxLength={2000}
      />
      {fieldErrors.body && (
        <p className="text-body-sm text-danger">{fieldErrors.body[0]}</p>
      )}

      <Button
        type="submit"
        isLoading={isPending}
        className="justify-self-start"
      >
        Submit review
      </Button>
    </form>
  );
}
