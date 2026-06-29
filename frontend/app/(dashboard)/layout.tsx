import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import VoiceAssistantButton from "@/components/VoiceAssistantButton";
import DemoSeeder from "@/components/DemoSeeder";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-primary)]">
      <DemoSeeder />
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />
        <VoiceAssistantButton />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
