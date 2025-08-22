"use client";

import { Upcoming } from "@/components/ui";

export default function PharmacyOrdersPage() {
  return (
    <Upcoming
      title="Orders Management"
      description="Comprehensive order management system for pharmacies to process and track medication orders."
      expectedDate="March 2024"
      colorTheme="teal"
      progressPercentage={70}
      features={[
        "Order processing",
        "Order tracking",
        "Inventory management",
        "Customer notifications",
        "Order history",
        "Payment processing",
      ]}
    />
  );
}
