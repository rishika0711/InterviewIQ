"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Brain,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  PenLine,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/practice", label: "Practice", icon: PenLine },
  { href: "/history", label: "History", icon: History },
  { href: "/profile", label: "Profile", icon: UserRound },
];

function SidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <>
      <div className="flex items-center gap-3 px-5 py-6 border-b border-border/60">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15">
          <Brain className="h-5 w-5 text-primary" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-base font-bold tracking-tight truncate block">
            InterviewIQ
          </span>
          <span className="text-[11px] text-muted-foreground font-medium truncate block">
            Interview prep
          </span>
        </div>
        <ThemeToggle className="shrink-0" />
      </div>
      <nav className="flex-1 space-y-0.5 p-4">
        <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Navigate
        </p>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/12 text-primary shadow-sm ring-1 ring-primary/10"
                  : "text-muted-foreground hover:bg-accent/70 hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-[18px] w-[18px] shrink-0", isActive && "opacity-90")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 mt-auto border-t border-border/60">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-10 rounded-xl text-muted-foreground hover:bg-destructive/8 hover:text-destructive"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between gap-4 border-b border-border/70 bg-background/95 backdrop-blur-md px-4 py-3 supports-[backdrop-filter]:bg-background/80 shadow-sm">
        <div className="flex min-w-0 items-center gap-2.5">
          <Brain className="h-8 w-8 shrink-0 text-primary" />
          <span className="truncate font-semibold tracking-tight">InterviewIQ</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 rounded-xl"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {open && (
        <button
          type="button"
          className="lg:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px]"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border/70 bg-background/95 backdrop-blur-md transition-transform lg:translate-x-0 lg:static lg:z-0 supports-[backdrop-filter]:bg-background/90",
          "shadow-xl shadow-black/5 lg:shadow-none",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarNav pathname={pathname} onNavigate={() => setOpen(false)} />
      </aside>
    </>
  );
}
