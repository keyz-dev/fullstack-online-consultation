import React from "react";
import { CheckCircle, Calendar, MessageSquare, CreditCard } from "lucide-react";
import SubHeading from "../ui/SubHeading";

const StepsSection = () => {
  const steps = [
    {
      icon: <Calendar className="w-8 h-8 text-accent" />,
      title: "Book Appointment",
      description:
        "Choose your preferred doctor and schedule a consultation at your convenience.",
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-accent" />,
      title: "Consult with Doctor",
      description:
        "Have a secure video consultation with our experienced healthcare professionals.",
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-accent" />,
      title: "Get Prescription",
      description:
        "Receive your prescription and treatment plan from qualified doctors.",
    },
    {
      icon: <CreditCard className="w-8 h-8 text-accent" />,
      title: "Order Medications",
      description:
        "Order your medications from our partner pharmacies with fast delivery.",
    },
  ];

  return (
    <section className="py-10 bg-light_bg dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <SubHeading
          tagline="How It Works"
          title="Simple Steps to Better Health"
          description="Get the care you need in just a few easy steps. Our platform makes healthcare accessible and convenient."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="text-center group hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-center mb-4">
                  <div className="bg-accent-light dark:bg-accent/20 rounded-full p-4 group-hover:bg-accent/30 transition-colors duration-300">
                    {step.icon}
                  </div>
                </div>
                <div className="flex items-center justify-center mb-3">
                  <span className="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                    {index + 1}
                  </span>
                  <h3 className="text-xl font-bold text-primary dark:text-white">
                    {step.title}
                  </h3>
                </div>
                <p className="text-secondary dark:text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
