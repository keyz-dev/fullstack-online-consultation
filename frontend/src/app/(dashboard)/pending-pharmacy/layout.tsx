import RouteProtection from "@/components/auth/RouteProtection";

export default function PendingPharmacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteProtection
      allowedRoles={["pending_pharmacy"]}
      restrictedRoles={["doctor", "pharmacy", "admin", "patient"]}
    >
      {children}
    </RouteProtection>
  );
}
