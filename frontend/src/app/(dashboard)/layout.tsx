"use client";

import React from "react";
import { BaseDashboardProvider, NotificationProvider } from "../../contexts";
import DashboardLayout from "../../components/layout/DashboardLayout";

interface DashboardBaseLayoutProps {
  children: React.ReactNode;
}

const DashboardBaseLayout: React.FC<DashboardBaseLayoutProps> = ({
  children,
}) => {
  return (
    <BaseDashboardProvider>
      <NotificationProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </NotificationProvider>
    </BaseDashboardProvider>
  );
};

export default DashboardBaseLayout;
