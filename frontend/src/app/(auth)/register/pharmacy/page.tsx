"use client";

import React from "react";
import { PharmacyApplicationProvider } from "../../../../contexts/PharmacyApplicationContext";
import PharmacyApplicationFlow from "../../../../components/onboarding/pharmacy/PharmacyApplicationFlow";
import RouteProtection from "../../../../components/auth/RouteProtection";

const PharmacyRegistrationPage = () => {
  return (
    <PharmacyApplicationProvider>
      <RouteProtection
        allowedRoles={["patient", "incomplete_pharmacy", "pending_pharmacy"]}
        restrictedRoles={["pharmacy", "admin", "doctor", "pending_doctor"]}
        redirectTo="/pharmacy/application-status"
      >
        <PharmacyApplicationFlow />
      </RouteProtection>
    </PharmacyApplicationProvider>
  );
};

export default PharmacyRegistrationPage;
