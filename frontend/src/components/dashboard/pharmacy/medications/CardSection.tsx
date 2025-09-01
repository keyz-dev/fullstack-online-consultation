"use client";

import React from "react";
import StatRenderer from "@/components/ui/StatRenderer";
import { Package, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface MedicationStats {
  total: number;
  available: number;
  outOfStock: number;
  expiringSoon: number;
  requiresPrescription: number;
  overTheCounter: number;
}

interface CardSectionProps {
  medicationStats: MedicationStats;
  loading?: boolean;
}

const CardSection = ({ medicationStats, loading = false }: CardSectionProps) => {
  const statCards = [
    {
      title: "Total Medications",
      value: medicationStats?.total || 0,
      description: "Full medication inventory",
      icon: Package,
      colorTheme: "blue" as const,
    },
    {
      title: "Available",
      value: medicationStats?.available || 0,
      description: "Medications in stock",
      icon: CheckCircle,
      colorTheme: "green" as const,
    },
    {
      title: "Out of Stock",
      value: medicationStats?.outOfStock || 0,
      description: "Medications needing restock",
      icon: XCircle,
      colorTheme: "red" as const,
    },
    {
      title: "Expiring Soon",
      value: medicationStats?.expiringSoon || 0,
      description: "Medications expiring within 30 days",
      icon: AlertTriangle,
      colorTheme: "yellow" as const,
    },
  ];

  return (
    <div className="mb-6">
      <StatRenderer
        statCards={statCards}
        loading={loading}
      />
    </div>
  );
};

export default CardSection;
