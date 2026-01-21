import Sidebar from "@/components/sidebar";

export default function StudentModeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar mode="student" showExitSession />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
