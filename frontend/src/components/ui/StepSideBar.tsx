import React, { useState } from "react";
import { ArrowLeft, Menu, X } from "lucide-react";
import Logo from "./Logo";

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

interface StepSideBarProps {
  currentStep: string;
  visitedSteps: string[];
  steps: Step[];
  homePath?: string;
}

export default function StepSideBar({
  currentStep,
  visitedSteps,
  steps,
  homePath = "/",
}: StepSideBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Header + Dropdown in a relative container */}
      <div className="relative lg:hidden">
        <div className="flex items-center justify-between p-4 bg-white">
          <Logo size={120} destination={homePath} />
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
                {steps.map((step) => (
                  <li key={step.id} className="flex items-center gap-4">
                    <div
                      className={`
                        h-10 w-10 rounded-sm flex-shrink-0 flex items-center justify-center border
                        ${
                          currentStep === step.id ||
                          visitedSteps.includes(step.id)
                            ? "border-accent text-accent"
                            : "border-line_clr text-placeholder"
                        }
                      `}
                    >
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="font-normal text-primary">{step.title}</h4>
                      <p className="text-sm text-secondary opacity-50">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
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
      <aside className="hidden lg:flex w-[360px] flex-shrink-0 h-screen bg-light_bg border-r border-r-line_clr px-8 py-4 flex-col justify-between">
        <div className="flex items-center gap-3">
          <Logo size={120} destination={homePath} />
        </div>
        <nav>
          <ul className="space-y-6 py-8">
            {steps.map((step) => (
              <li key={step.id} className="flex items-center gap-4">
                <div
                  className={`
                    h-10 w-10 rounded-sm flex-shrink-0 flex items-center justify-center border
                    ${
                      currentStep === step.id || visitedSteps.includes(step.id)
                        ? "border-accent text-accent"
                        : "border-line_clr text-placeholder"
                    }
                  `}
                >
                  {step.icon}
                </div>
                <div>
                  <h4 className="font-normal text-primary">{step.title}</h4>
                  <p className="text-sm text-secondary opacity-50">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto text-center flex-1 flex flex-col justify-between">
          <div className="flex-1 w-full relative max-h-[220px] rounded-md overflow-hidden">
            <div
              className="absolute inset-0 bg-light_bg"
              style={{
                background: "rgba(255, 255, 255, 0.85)",
              }}
            ></div>
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
