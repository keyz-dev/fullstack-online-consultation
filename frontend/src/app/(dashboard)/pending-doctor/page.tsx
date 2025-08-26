"use client";

import React from "react";
import { ApplicationTrackingPage } from "@/components/application-tracking";

const PendingDoctorPage: React.FC = () => {
  return <ApplicationTrackingPage userType="doctor" />;
};

export default PendingDoctorPage;
