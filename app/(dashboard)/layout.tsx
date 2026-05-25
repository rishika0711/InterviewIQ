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
        <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-[1200px] w-full lg:mx-auto">
          <div className="animate-in fade-in duration-300">{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
