import React, { useState } from "react";
import { ArrowLeft, Menu, X, Check } from "lucide-react";
import Logo from "./Logo";
import Image from "next/image";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

interface StepSideBarProps {
  currentStep: number;
  visitedSteps: number[];
  steps: Step[];
  homePath?: string;
  displayLogo?: boolean;
}

export default function StepSideBar({
  currentStep,
  visitedSteps,
  steps,
  homePath = "/",
  displayLogo = true,
}: StepSideBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getStepStatus = (stepId: number) => {
    if (currentStep === stepId) return "active";
    if (visitedSteps && visitedSteps.includes(stepId)) return "visited";
    return "pending";
  };

  const getStepStyles = (status: string) => {
    switch (status) {
      case "active":
        return {
          container:
            "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
          text: "text-blue-900 dark:text-blue-100 font-medium",
          description: "text-blue-700 dark:text-blue-300",
        };
      case "visited":
        return {
          container:
            "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
          text: "text-green-900 dark:text-green-100 font-medium",
          description: "text-green-700 dark:text-green-300",
        };
      default:
        return {
          container:
            "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-400 dark:text-gray-500",
          text: "text-gray-500 dark:text-gray-400",
          description: "text-gray-400 dark:text-gray-500",
        };
    }
  };

  return (
    <>
      {/* Mobile Header + Dropdown in a relative container */}
      <div className="relative lg:hidden">
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          {displayLogo && <Logo size={120} destination={homePath} />}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-lg dark:shadow-gray-800/50 p-6 flex flex-col gap-8 border-b border-gray-200 dark:border-gray-700">
            <nav>
              <ul className="space-y-5">
                {steps.map((step) => {
                  const status = getStepStatus(step.id);
                  const styles = getStepStyles(status);

                  return (
                    <li key={step.id} className="flex items-center gap-4">
                      <div
                        className={`h-10 w-10 rounded-sm flex-shrink-0 flex items-center justify-center border ${styles.container}`}
                      >
                        {step.completed ? <Check size={16} /> : step.icon}
                      </div>
                      <div>
                        <h4 className={`font-normal ${styles.text}`}>
                          {step.title}
                        </h4>
                        <p className={`text-sm ${styles.description}`}>
                          {step.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="mt-4 relative">
              <div className="w-full relative max-h-[100px] rounded-lg overflow-hidden">
                <Image
                  src={"/images/drogcine-card.png"}
                  alt="DrogCine Card"
                  width={100}
                  height={20}
                  className="w-full object-cover h-full opacity-15"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50/70 to-transparent dark:from-gray-900/70"></div>
                <div className="absolute bottom-2 left-2 right-2">
                  <a
                    href={homePath}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-white/80 dark:bg-gray-800/80 px-3 py-2 rounded-lg backdrop-blur-sm text-sm shadow-sm border border-gray-200/50 dark:border-gray-700/50"
                  >
                    <ArrowLeft size={16} />
                    Back to home
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden max-h-[90vh] lg:flex w-[360px] flex-shrink-0 h-screen bg-light_bg border-r border-r-gray-200 dark:border-gray-700 px-8 pb-4 flex-col justify-between">
        <div className="flex items-center gap-3">
          {displayLogo && <Logo size={120} destination={homePath} />}
        </div>
        <nav>
          <ul className="space-y-6 py-8">
            {steps.map((step) => {
              const status = getStepStatus(step.id);
              const styles = getStepStyles(status);

              return (
                <li key={step.id} className="flex items-center gap-4">
                  <div
                    className={`h-10 w-10 rounded-sm flex-shrink-0 flex items-center justify-center border ${styles.container}`}
                  >
                    {step.completed ? <Check size={16} /> : step.icon}
                  </div>
                  <div>
                    <h4 className={`font-normal ${styles.text}`}>
                      {step.title}
                    </h4>
                    <p className={`text-sm ${styles.description}`}>
                      {step.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="mt-auto text-center flex-1 flex flex-col justify-center">
          <div className="flex-1 w-full relative max-h-[140px] rounded-lg overflow-hidden">
            <Image
              src={"/images/drogcine-card.png"}
              alt="DrogCine Card"
              width={100}
              height={100}
              className="w-full object-cover h-full opacity-15"
            />
            <div className="absolute inset-0 "></div>
            <div className="absolute bottom-4 left-4 right-4">
              <a
                href={homePath}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-4 py-3 rounded-lg backdrop-blur-sm shadow-sm border border-gray-200/50 dark:border-gray-700/50"
              >
                <ArrowLeft size={16} />
                Back to home
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
