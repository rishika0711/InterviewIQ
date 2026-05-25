import { Footer } from "@/components/layout/Footer";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col pt-14 lg:pt-0 min-w-0 min-h-screen lg:min-h-0 bg-gradient-to-br from-muted/25 via-background to-background">
        <main className="flex-1 py-4 sm:py-6 lg:py-10">
          <div className="animate-in fade-in duration-300 mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-10">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
