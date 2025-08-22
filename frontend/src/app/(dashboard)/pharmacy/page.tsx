"use client";

import { Upcoming } from "@/components/ui";

export default function PharmacyOverviewPage() {
  return (
    <Upcoming
      title="Pharmacy Dashboard"
      description="Business dashboard for pharmacies to manage orders, inventory, and customer services."
      expectedDate="March 2024"
      colorTheme="orange"
      progressPercentage={70}
      features={[
        "Business overview",
        "Order management",
        "Inventory tracking",
        "Customer services",
        "Sales analytics",
        "Business insights",
      ]}
    />
  );
}
