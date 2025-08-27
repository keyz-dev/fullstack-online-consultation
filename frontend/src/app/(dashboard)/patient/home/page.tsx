"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";

const PatientHomePage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main home page
    router.replace("/");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader size="lg" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Redirecting to home page...
        </p>
      </div>
    </div>
  );
};

export default PatientHomePage;
