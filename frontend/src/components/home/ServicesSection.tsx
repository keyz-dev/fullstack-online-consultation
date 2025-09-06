import React from "react";
import Image from "next/image";
import { useHome } from "../../contexts";
import { SubHeading } from "../ui";

const ServicesSection = () => {
  const { homeData, loading } = useHome();

  if (loading) {
    return (
      <section className="py-10 bg-light_bg dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <SubHeading
            tagline="Our Services"
            title="Comprehensive Healthcare Solutions"
            description="Discover our comprehensive healthcare solutions designed to meet your needs."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const services = homeData?.services || [
    {
      name: "Video Consultation",
      description:
        "A secure online platform allowing patients to interact with healthcare providers via real-time video, enabling face-to-face consultations from the comfort of home.",
      image: "/images/services/consultation.jpg",
    },
    {
      name: "Book Appointment",
      description:
        "An easy-to-use scheduling system that allows users(patients and doctors) to schedule, reschedule, or cancel appointments, complete with calendar integration.",
      image: "/images/services/appointment.jpg",
    },
    {
      name: "Manage Notifications",
      description:
        "Automated notifications via email or SMS to remind patients of upcoming appointments, follow-ups, and important health updates, ensuring they stay informed and engaged.",
      image: "/images/services/notification.jpg",
    },
  ];

  return (
    <section className="py-10 bg-light_bg dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <SubHeading
          tagline="Our Services"
          title="Comprehensive Healthcare Solutions"
          description="Discover our comprehensive healthcare solutions designed to meet your needs."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative h-48 rounded-t-lg overflow-hidden">
                {service.image && service.image !== "" ? (
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    onError={(e) => {
                      console.log("Image failed to load:", service.image);
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-accent/20 flex items-center justify-center">
                    <span className="text-accent text-4xl font-bold">
                      {service.name?.charAt(0) || "S"}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-primary dark:text-white mb-3">
                  {service.name}
                </h3>
                <p className="text-secondary dark:text-gray-300 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
