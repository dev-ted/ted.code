import { AuthGate } from "@/components/admin/auth-gate";
import { AdminSessionSync } from "@/components/admin/admin-session-sync";
import { AdminShell } from "@/components/admin/admin-shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGate>
      <AdminSessionSync />
      <AdminShell>{children}</AdminShell>
    </AuthGate>
  );
}
