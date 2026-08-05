"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import * as React from "react";
import { useForm } from "react-hook-form";

import { OAuthButtons } from "@/components/auth/oauth-buttons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toaster";

import { resendVerificationEmailAction } from "@/lib/auth/actions";
import {
  loginSchema,
  magicLinkSchema,
  type LoginInput,
  type MagicLinkInput,
} from "@/lib/validation/auth";

const ERROR_MESSAGES: Record<string, string> = {
  "too-many-attempts":
    "Too many login attempts. Please try again in a few minutes.",
  "email-not-verified":
    "Please verify your email before signing in — check your inbox for the link.",
  credentials: "Invalid email or password.",
};

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [magicLinkSent, setMagicLinkSent] = React.useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = React.useState<string | null>(
    null,
  );
  const [isResending, setIsResending] = React.useState(false);

  const passwordForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const magicLinkForm = useForm<MagicLinkInput>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: { email: "" },
  });

  const onPasswordSubmit = async (values: LoginInput) => {
    setIsSubmitting(true);
    setUnverifiedEmail(null);
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    setIsSubmitting(false);

    if (!result || result.error) {
      const code = result?.code ?? "credentials";
      const message = ERROR_MESSAGES[code] ?? ERROR_MESSAGES.credentials;
      toast.error(message);
      if (code === "email-not-verified") setUnverifiedEmail(values.email);
      return;
    }

    window.location.href = callbackUrl;
  };

  const onResendVerification = async () => {
    if (!unverifiedEmail) return;
    setIsResending(true);
    const result = await resendVerificationEmailAction({
      email: unverifiedEmail,
    });
    setIsResending(false);
    toast.success(result.message);
    setUnverifiedEmail(null);
  };

  const onMagicLinkSubmit = async (values: MagicLinkInput) => {
    setIsSubmitting(true);
    await signIn("email", {
      email: values.email,
      redirect: false,
      redirectTo: callbackUrl,
    });
    setIsSubmitting(false);
    setMagicLinkSent(true);
  };

  return (
    <div className="grid gap-6">
      <Tabs defaultValue="password">
        <TabsList>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="magic-link">Magic link</TabsTrigger>
        </TabsList>

        <TabsContent value="password" className="pt-6">
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              noValidate
              className="grid gap-5"
            >
              <FormField
                control={passwordForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" autoComplete="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-body-sm text-content-secondary transition-colors duration-fast hover:text-content-primary"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isSubmitting}
              >
                Sign in
              </Button>
              {unverifiedEmail && (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  isLoading={isResending}
                  onClick={onResendVerification}
                >
                  Resend verification email
                </Button>
              )}
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="magic-link" className="pt-6">
          {magicLinkSent ? (
            <p className="text-body-sm text-content-secondary">
              Check your email for a sign-in link. It expires in 10 minutes.
            </p>
          ) : (
            <Form {...magicLinkForm}>
              <form
                onSubmit={magicLinkForm.handleSubmit(onMagicLinkSubmit)}
                noValidate
                className="grid gap-5"
              >
                <FormField
                  control={magicLinkForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" autoComplete="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={isSubmitting}
                >
                  Email me a sign-in link
                </Button>
              </form>
            </Form>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-hairline-subtle" />
        <span className="text-body-sm text-content-muted">or</span>
        <div className="h-px flex-1 bg-hairline-subtle" />
      </div>

      <OAuthButtons callbackUrl={callbackUrl} />
    </div>
  );
}
