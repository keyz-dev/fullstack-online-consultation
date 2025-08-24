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
    if (visitedSteps.includes(stepId)) return "visited";
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
        <div className="flex items-center justify-between p-4 bg-white">
          {displayLogo && <Logo size={120} destination={homePath} />}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="p-2"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 z-50 bg-white shadow-lg p-6 flex flex-col gap-8">
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
            <div className="mt-4 flex justify-between items-center text-sm">
              <a
                href={homePath}
                className="flex items-center gap-2 text-secondary hover:text-accent"
              >
                <ArrowLeft size={16} />
                Back to home
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden max-h-[90vh] lg:flex w-[360px] flex-shrink-0 h-screen bg-light_bg border-r border-r-line_clr px-8 pb-4 flex-col justify-between">
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
        <div className="mt-auto text-center flex-1 flex flex-col justify-between">
          <div className="flex-1 w-full relative max-h-[220px] rounded-md overflow-hidden">
            <Image
              src={"/images/drogcine-card.png"}
              alt="DrogCine Card"
              width={100}
              height={80}
              className="w-full object-cover h-full"
            />
            <div className="absolute inset-0 bg-white/85 dark:bg-gray-900/85"></div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <a
              href={homePath}
              className="flex items-center gap-2 text-secondary hover:text-accent"
            >
              <ArrowLeft size={16} />
              Back to home
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
