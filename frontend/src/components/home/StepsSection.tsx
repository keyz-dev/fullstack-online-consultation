import React from "react";
import {
  LogIn,
  UserCheck,
  Stethoscope,
  MessageSquare,
  FileText,
  Truck,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import SubHeading from "../ui/SubHeading";

const StepsSection = () => {
  const steps = [
    {
      icon: <LogIn className="w-16 h-16 text-accent" />,
      title: "Sign Up Or Log In",
      description: "Using your smartphone, tablet or computer",
      number: 1,
    },
    {
      icon: <MessageSquare className="w-16 h-16 text-accent" />,
      title: "Choose & Consult Doctor",
      description:
        "Review doctor profiles and connect for a secure video consultation.",
      number: 2,
    },
    {
      icon: <FileText className="w-16 h-16 text-accent" />,
      title: "Get Prescription",
      description:
        "Receive your prescription and treatment plan from qualified doctors.",
      number: 3,
    },
    {
      icon: <Truck className="w-16 h-16 text-accent" />,
      title: "Medication Delivery",
      description:
        "Order medications from our partner pharmacies with fast delivery.",
      number: 4,
    },
  ];

  return (
    <section className="w-screen bg-white dark:bg-gray-900">
      <section className="container py-10 w-full flex flex-col gap-8 justify-center items-center">
        <SubHeading
          tagline="How It Works"
          title="Simple Steps to Better Health"
          description="Get the care you need in just a few easy steps. Our platform makes healthcare accessible and convenient."
        />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col gap-5 justify-center items-center">
                <div className="flex justify-center relative">
                  {step.icon}
                  <span className="absolute -top-2 -right-2 bg-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-primary dark:text-white text-center">
                  {step.title}
                </h3>
                <p className="text-center text-sm font-thin w-3/4 text-secondary dark:text-gray-300">
                  {step.description}
                </p>
              </div>

              {/* Arrow separator - only show if not the last item */}
              {index < steps.length - 1 && (
                <>
                  <ChevronRight className="hidden md:block w-10 h-10 text-accent" />
                  <ChevronDown className="md:hidden w-10 h-10 text-accent" />
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>
    </section>
  );
};

export default StepsSection;
