export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-card/40 backdrop-blur-sm">
      <div className="mx-auto flex h-[72px] w-full max-w-[1200px] items-center px-4 sm:px-6 lg:px-10">
        <span className="text-sm font-medium tabular-nums text-muted-foreground">
          © {new Date().getFullYear()} InterviewIQ
        </span>
      </div>
    </footer>
  );
}
