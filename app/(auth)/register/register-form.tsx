"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useActionState, useEffect, useRef, useState } from "react";
import { Brain, Loader2 } from "lucide-react";
import { registerUser, type ActionState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
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

const initialState: ActionState = {};

type RegisterFormProps = {
  googleEnabled: boolean;
};

export function RegisterForm({ googleEnabled }: RegisterFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [state, formAction, isPending] = useActionState(
    registerUser,
    initialState
  );

  function handleGoogleSignIn() {
    if (googleLoading) return;
    setGoogleLoading(true);
    signIn("google", { callbackUrl: "/dashboard" });
  }

  useEffect(() => {
    if (!state.success || !formRef.current) return;

    setRedirecting(true);
    const formData = new FormData(formRef.current);
    signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    }).then((result) => {
      if (result?.error) {
        router.push("/login");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    });
  }, [state.success, router]);

  const busy = isPending || redirecting || googleLoading;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 pt-16 pb-24">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-bl from-muted/80 via-background to-background"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed top-[-20%] left-[-10%] h-[28rem] w-[28rem] rounded-full bg-primary/12 blur-3xl -z-10"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-[-10%] right-[-15%] h-[22rem] w-[22rem] rounded-full bg-violet-500/10 blur-3xl -z-10"
      />

      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20 shadow-sm">
            <Brain className="h-7 w-7 text-primary" aria-hidden />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">InterviewIQ</h1>
            <p className="text-muted-foreground text-[15px]">Create your account</p>
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
                Account created — signing you in…
              </p>
            </div>
          )}
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-xl">Register</CardTitle>
            <CardDescription className="text-[15px]">
              Start practicing with AI-powered feedback
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
                    <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-muted text-[10px] font-bold tracking-tighter">
                      G
                    </span>
                  )}
                  {googleLoading ? "Redirecting to Google…" : "Continue with Google"}
                </Button>

                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/80" />
                  </div>
                  <div className="relative flex justify-center text-[11px] font-medium uppercase tracking-wider">
                    <span className="bg-card px-3 text-muted-foreground">
                      Or register with email
                    </span>
                  </div>
                </div>
              </>
            )}

            <form ref={formRef} action={formAction} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  required
                  minLength={2}
                  className="h-11 rounded-lg shadow-sm border-border/80"
                  placeholder="Your name"
                />
              </div>
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
                  minLength={8}
                  autoComplete="new-password"
                  className="h-11 rounded-lg shadow-sm border-border/80"
                  placeholder="Minimum 8 characters"
                />
                <p className="text-[11px] text-muted-foreground">
                  Password must be at least 8 characters long.
                </p>
              </div>
              {state.error && (
                <p className="text-sm text-destructive font-medium">{state.error}</p>
              )}
              <Button
                type="submit"
                className="w-full h-11 text-base shadow-md gap-2"
                disabled={busy}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Creating account…
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground pt-2">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>
            <p className="text-center text-[11px] text-muted-foreground opacity-90">
              By creating an account you agree to our standard terms of service.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
