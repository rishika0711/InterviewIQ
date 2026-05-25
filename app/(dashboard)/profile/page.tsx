import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const name = session.user.name ?? "";
  const email = session.user.email ?? "";

  return (
    <div className="max-w-2xl space-y-10">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15">
            <User className="h-6 w-6 text-primary" aria-hidden />
          </div>
          <div className="min-w-0">
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-sm text-muted-foreground">
              Manage how your name appears in the app.
            </p>
          </div>
        </div>
      </div>
      <Separator className="opacity-50" />
      <ProfileForm key={name} defaultName={name} email={email} />
    </div>
  );
}
