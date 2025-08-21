import React, { useState } from "react";
import { useHome } from "../../contexts";
import { ChevronDown, ChevronUp } from "lucide-react";
import SubHeading from "../ui/SubHeading";

const QASection = () => {
  const { homeData, loading } = useHome();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (loading) {
    return (
      <section className="py-10 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <SubHeading
            tagline="FAQ"
            title="Frequently Asked Questions"
            description="Find answers to common questions about our healthcare platform and services."
          />
          <div className="max-w-3xl mx-auto mt-12 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-16 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const qaItems = homeData?.qa || [];

  const toggleQA = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-10 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <SubHeading
          tagline="FAQ"
          title="Frequently Asked Questions"
          description="Find answers to common questions about our healthcare platform and services."
        />

        <div className="max-w-3xl mx-auto mt-12">
          {qaItems.map((item, index) => (
            <div
              key={item.id || index}
              className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
            >
              <button
                onClick={() => toggleQA(index)}
                className="w-full flex items-center justify-between py-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-primary dark:text-white pr-4">
                  {item.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-accent flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-accent flex-shrink-0" />
                )}
              </button>

              {openIndex === index && (
                <div className="pb-6">
                  <p className="text-secondary dark:text-gray-300 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QASection;
