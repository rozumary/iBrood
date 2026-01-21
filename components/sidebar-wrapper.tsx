"use client";
import Sidebar from "@/components/sidebar";

export default function SidebarWrapper({ mode }: { mode: "beekeeper" | "research" | "student" }) {
  const showExitSession = true;
  return <Sidebar mode={mode} showExitSession={showExitSession} />;
}
