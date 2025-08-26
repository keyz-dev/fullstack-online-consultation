import RouteProtection from "@/components/auth/RouteProtection";

export default function PendingDoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteProtection
      allowedRoles={["pending_doctor"]}
      restrictedRoles={["doctor", "pharmacy", "admin", "patient"]}
    >
      {children}
    </RouteProtection>
  );
}
