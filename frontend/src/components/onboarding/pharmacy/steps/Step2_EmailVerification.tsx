import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePharmacyApplication } from "../../../../contexts/PharmacyApplicationContext";

const Step2_EmailVerification = () => {
  const router = useRouter();
  const { getStepTitle, getStepSubtitle } = usePharmacyApplication();

  useEffect(() => {
    // Redirect to the central email verification page
    router.push("/verify-account");
  }, [router]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">
              Redirecting to email verification...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2_EmailVerification;
