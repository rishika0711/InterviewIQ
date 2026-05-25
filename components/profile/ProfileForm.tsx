"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  updateProfileAction,
  type ProfileUpdateState,
} from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const initialState: ProfileUpdateState = {};

export function ProfileForm({
  defaultName,
  email,
}: {
  defaultName: string;
  email: string;
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <form action={formAction} className="space-y-6 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="name">Display name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={80}
          defaultValue={defaultName}
          disabled={isPending}
          className="rounded-xl"
          autoComplete="name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email-readonly">Email</Label>
        <Input
          id="email-readonly"
          type="email"
          value={email}
          readOnly
          disabled
          className="rounded-xl bg-muted/40 text-muted-foreground"
        />
        <p className="text-xs text-muted-foreground">
          Email is tied to your sign-in provider and cannot be changed here.
        </p>
      </div>
      {state.error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
          {state.error}
        </div>
      )}
      {state.success && (
        <p className="text-sm font-medium text-primary">Profile updated.</p>
      )}
      <Button type="submit" disabled={isPending} className="rounded-xl shadow-sm">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
            Saving…
          </>
        ) : (
          "Save changes"
        )}
      </Button>
    </form>
  );
}
