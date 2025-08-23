import React from "react";
import Image from "next/image";
import { useHome } from "../../contexts";
import { SubHeading } from "../ui";

const SymptomsSection = () => {
  const { homeData, loading } = useHome();

  if (loading) {
    return (
      <section className="py-10 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <SubHeading
            tagline="Common Symptoms"
            title="What Are You Experiencing?"
            description="Find the right specialist for your symptoms and get the care you need."
          />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-20 rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const symptoms = homeData?.symptoms || [];
  return (
    <section className="py-10 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <SubHeading
          tagline="Common Symptoms"
          title="What Are You Experiencing?"
          description="Find the right specialist for your symptoms and get the care you need."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-12">
          {symptoms.map((symptom, index) => (
            <div
              key={symptom.id || index}
              className="group cursor-pointer hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="bg-light_bg dark:bg-gray-800 rounded-lg p-4 text-center hover:bg-accent-light dark:hover:bg-accent/20 transition-colors duration-300">
                {symptom.iconUrl ? (
                  <div className="relative w-12 h-12 mx-auto mb-3">
                    <Image
                      src={symptom.iconUrl}
                      alt={symptom.name}
                      fill
                      className="object-contain"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 mx-auto mb-3 bg-accent/20 rounded-full flex items-center justify-center">
                    <span className="text-accent text-xl font-bold">
                      {symptom.name.charAt(0)}
                    </span>
                  </div>
                )}
                <h3 className="text-sm font-semibold text-primary dark:text-white group-hover:text-accent transition-colors duration-300">
                  {symptom.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SymptomsSection;
