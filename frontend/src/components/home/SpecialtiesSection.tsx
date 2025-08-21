import React from "react";
import Image from "next/image";
import { useHome } from "../../contexts";
import { SubHeading } from "../ui";

const SpecialtiesSection = () => {
  const { homeData, loading } = useHome();

  if (loading) {
    return (
      <section className="py-10 bg-light_bg dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <SubHeading
            tagline="Medical Specialties"
            title="Expert Care in Every Field"
            description="Our doctors specialize in various medical fields to provide comprehensive healthcare."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg mb-3"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const specialties = homeData?.specialties || [];

  return (
    <section className="py-10 bg-light_bg dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <SubHeading
          tagline="Medical Specialties"
          title="Expert Care in Every Field"
          description="Our doctors specialize in various medical fields to provide comprehensive healthcare."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
          {specialties.map((specialty, index) => (
            <div
              key={specialty.id || index}
              className="group cursor-pointer hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-center mb-4">
                  {specialty.icon ? (
                    <div className="relative w-16 h-16">
                      <Image
                        src={specialty.icon}
                        alt={specialty.name}
                        fill
                        className="object-contain"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                      <span className="text-accent text-2xl font-bold">
                        {specialty.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-primary dark:text-white text-center mb-2 group-hover:text-accent transition-colors duration-300">
                  {specialty.name}
                </h3>
                {specialty.description && (
                  <p className="text-sm text-secondary dark:text-gray-300 text-center leading-relaxed">
                    {specialty.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialtiesSection;
