import React, { useEffect } from "react";
import { useDoctorApplication } from "@/contexts/DoctorApplicationContext";
import { useRouter } from "next/navigation";

const Step2_EmailVerification = () => {
  const { getStepTitle, getStepSubtitle } = useDoctorApplication();
  const router = useRouter();

  useEffect(() => {
    // Redirect to the verify account page
    router.push("/verify-account");
  }, [router]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="py-4 sm:py-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {getStepTitle(2)}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            {getStepSubtitle(2)}
          </p>
        </div>

        {/* Loading state while redirecting */}
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Redirecting to email verification...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step2_EmailVerification;
