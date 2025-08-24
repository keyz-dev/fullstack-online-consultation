import React from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { Button } from "../../../ui";

const Step7_Success = () => {
  const router = useRouter();

  return (
    <section className="min-h-screen flex flex-col dark:bg-gray-900">
      <main className="flex-grow">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-[70vh] w-full px-4 sm:px-6 lg:px-8">
            {/* Animated Checkmark */}
            <div className="mb-6 sm:mb-8">
              <span className="relative flex h-24 w-24 sm:h-32 sm:w-32">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-200 opacity-60 animate-ping"></span>
                <span className="absolute inline-flex h-20 w-20 sm:h-28 sm:w-28 rounded-full bg-green-200 opacity-70 animate-ping delay-150"></span>
                <span className="absolute inline-flex h-16 w-16 sm:h-24 sm:w-24 rounded-full bg-green-300 opacity-80 animate-ping delay-300"></span>
                <span className="relative inline-flex h-12 w-12 sm:h-20 sm:w-20 rounded-full bg-green-500 items-center justify-center">
                  <svg
                    className="w-8 h-8 sm:w-12 sm:h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-900 dark:text-white px-4">
              Doctor Application Submitted Successfully
            </h1>

            {/* Subtext */}
            <p className="text-center text-xs sm:text-sm max-w-xl mb-6 sm:mb-8 text-gray-600 dark:text-gray-300 px-4">
              Thank you for submitting your application. We will review it and
              get back to you within 24-48 hours. You will receive email
              notifications about the status of your application.
            </p>

            {/* What happens next */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8 max-w-md">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3">
                What happens next?
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">1.</span>
                  Our team will review your application and documents
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">2.</span>
                  We may contact you for additional information if needed
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">3.</span>
                  You'll receive an email with the approval decision
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">4.</span>
                  Once approved, you can start providing consultations
                </li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-[20%] justify-center w-full sm:w-auto">
              {/* Button to track application */}
              <Button
                onClickHandler={() => {
                  router.push("/pending-doctor/application-status");
                }}
                additionalClasses="primarybtn"
              >
                <MapPin size={18} />
                Track your Application
              </Button>

              {/* Button to go home */}
              <Button
                onClickHandler={() => {
                  router.push("/");
                }}
                additionalClasses="secondarybtn"
              >
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default Step7_Success;
