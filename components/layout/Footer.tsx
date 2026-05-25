export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/40 py-5 px-4 sm:px-8 lg:px-10 text-sm text-muted-foreground mt-auto backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="font-medium tabular-nums">© {new Date().getFullYear()} InterviewIQ</span>
        {/* <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <span>
            Built by <strong className="text-foreground font-semibold">Rishika Singh</strong>
          </span>
          <a
            href="https://github.com/rishikasingh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/80 hover:text-primary font-medium underline-offset-4 hover:underline"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/rishikasingh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/80 hover:text-primary font-medium underline-offset-4 hover:underline"
          >
            LinkedIn
          </a>
        </div> */}
      </div>
    </footer>
  );
}
