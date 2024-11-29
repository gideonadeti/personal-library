import Header from "@/app/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-grow flex flex-col h-screen overflow-y-hidden">
        <Header />
        {children}
      </main>
    </SidebarProvider>
  );
}
