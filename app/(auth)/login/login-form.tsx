"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Brain, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleLogo } from "@/components/icons/GoogleLogo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type LoginFormProps = {
  googleEnabled: boolean;
};

export function LoginForm({ googleEnabled }: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  function handleGoogleSignIn() {
    if (googleLoading) return;
    setGoogleLoading(true);
    signIn("google", { callbackUrl: "/dashboard" });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setLoading(false);
      setError("Invalid email or password");
      return;
    }

    setRedirecting(true);
    router.push("/dashboard");
    router.refresh();
  }

  const busy = loading || redirecting || googleLoading;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 pt-16 pb-24">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-muted/80 via-background to-background"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed -top-32 right-[-10%] h-[28rem] w-[28rem] rounded-full bg-primary/15 blur-3xl -z-10"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed top-1/2 -left-32 h-[24rem] w-[24rem] rounded-full bg-indigo-500/10 blur-3xl -z-10"
      />

      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20 shadow-sm">
            <Brain className="h-7 w-7 text-primary" aria-hidden />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">InterviewIQ</h1>
            <p className="text-muted-foreground text-[15px] leading-relaxed max-w-[22rem] mx-auto">
              AI-powered interview prep for developers
            </p>
          </div>
        </div>

        <Card
          className={cn(
            "relative border-border/80 shadow-xl shadow-primary/5",
            "backdrop-blur-sm bg-card/95"
          )}
        >
          {redirecting && (
            <div
              role="status"
              aria-live="polite"
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl bg-card/85 backdrop-blur-sm"
            >
              <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden />
              <p className="text-sm font-semibold text-foreground">
                Signed in — taking you to your dashboard…
              </p>
            </div>
          )}
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-xl">Sign in</CardTitle>
            <CardDescription className="text-[15px]">
              {googleEnabled
                ? "Enter your credentials or continue with Google"
                : "Enter your email and password"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            {googleEnabled && (
              <>
                <Button
                  variant="outline"
                  className="w-full h-11 gap-2 border-border shadow-sm hover:bg-muted/80"
                  type="button"
                  disabled={busy}
                  onClick={handleGoogleSignIn}
                >
                  {googleLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <GoogleLogo className="h-5 w-5" />
                  )}
                  {googleLoading ? "Redirecting to Google…" : "Continue with Google"}
                </Button>

                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/80" />
                  </div>
                  <div className="relative flex justify-center text-[11px] font-medium uppercase tracking-wider">
                    <span className="bg-card px-3 text-muted-foreground">Or continue with email</span>
                  </div>
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="h-11 rounded-lg shadow-sm border-border/80"
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="h-11 rounded-lg shadow-sm border-border/80"
                  placeholder="••••••••"
                />
              </div>
              {error && (
                <p className="text-sm text-destructive font-medium">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full h-11 text-base shadow-md gap-2"
                disabled={busy}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground pt-2">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline underline-offset-4"
              >
                Register
              </Link>
            </p>
            <p className="text-center text-[11px] text-muted-foreground opacity-90">
              By continuing you agree to our standard terms of service.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
