import React, { useState } from "react";
import { useHome } from "../../contexts";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import SubHeading from "../ui/SubHeading";

const QASection = () => {
  const { homeData, loading } = useHome();
  const [openItemId, setOpenItemId] = useState<number | null>(null);

  if (loading) {
    return (
      <section className="w-screen bg-slate-100 dark:bg-gray-900">
        <section className="container py-10 flex flex-col gap-5">
          <SubHeading
            tagline="FAQs"
            title="Frequently Asked Questions"
            description="Find answers to common questions about our healthcare platform and services."
          />
          <p className="text-center text-secondary dark:text-gray-300 text-sm md:w-[40%] mx-auto">
            Most of our users ask these questions
          </p>
          <div className="w-full grid gap-3 grid-cols-1 md:grid-cols-2 pt-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-20 rounded-md"></div>
              </div>
            ))}
          </div>
        </section>
      </section>
    );
  }

  const qaItems = homeData?.qa || [];

  const toggleQA = (itemId: number) => {
    setOpenItemId(openItemId === itemId ? null : itemId);
  };

  return (
    <section className="w-screen bg-slate-100 dark:bg-gray-900">
      <section className="container py-10 flex flex-col gap-5">
        <SubHeading
          tagline="FAQs"
          title="Frequently Asked Questions"
          description="Find answers to common questions about our healthcare platform and services."
        />
        <p className="text-center text-secondary dark:text-gray-300 text-sm md:w-[40%] mx-auto">
          Most of our users ask these questions
        </p>

        <div className="w-full grid gap-3 grid-cols-1 md:grid-cols-2 pt-5">
          {qaItems.length > 0 ? (
            qaItems.map((item) => (
              <div
                key={`qa-item-${item.id}`}
                className="flex flex-col px-3 py-2 border border-gray-200 dark:border-gray-700 gap-1 rounded-md bg-white dark:bg-gray-800"
              >
                <button
                  onClick={() => toggleQA(item.id)}
                  className="flex w-full text-primary dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 rounded-md p-2"
                >
                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="w-[30px] h-[30px] font-bold inline-flex border border-accent/20 rounded-full justify-center items-center bg-accent/10 text-accent flex-shrink-0">
                        <HelpCircle className="w-3 h-3" />
                      </span>
                      <p className="text-left text-base font-medium leading-relaxed">
                        {item.question}
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      {openItemId === item.id ? (
                        <ChevronUp className="w-5 h-5 text-accent transition-transform duration-200" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-accent transition-transform duration-200" />
                      )}
                    </div>
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openItemId === item.id
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="w-full text-left text-base text-secondary dark:text-gray-300 pb-2 px-2">
                    <span className="leading-relaxed">{item.answer}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full col-span-1 md:col-span-2 h-[100px] flex items-center justify-center text-secondary dark:text-gray-400">
              There are no Questions to answer available
            </div>
          )}
        </div>
      </section>
    </section>
  );
};

export default QASection;
