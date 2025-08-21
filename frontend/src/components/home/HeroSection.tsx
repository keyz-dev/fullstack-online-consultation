import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui";

const HeroSection = () => {
  const handleBookAppointment = () => {
    // Add your booking logic here
    console.log("Book appointment clicked");
  };

  return (
    <section className="relative h-[80vh] bg-light_bg dark:bg-gray-900 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-accent-light rounded-full opacity-30"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-orange-200 rounded-full opacity-30"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-accent-light rounded-full opacity-40"></div>
        <div className="absolute bottom-40 right-10 w-12 h-12 bg-orange-100 rounded-full opacity-40"></div>
      </div>

      <div className="container mx-auto px-4 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8 flex flex-col gap-5 items-center sm:items-start  text-center lg:text-left relative z-20">
            <div className="text-[42px] flex flex-col items-center text-center sm:items-start sm:text-left sm:text-[64px] sm:leading-[70px]">
              <h1 className="font-custom text-primary">
                <p>
                  Our{" "}
                  <span className="text-accent font-semibold font-hero">
                    HealthCare
                  </span>{" "}
                  <br />
                  Solutions Meet <br />
                  <span className="text-accent font-semibold font-hero">
                    Every
                  </span>{" "}
                  Need
                </p>
              </h1>
              <p className="text-secondary mt-10 text-sm w-[90%] md:w-[65%]">
                With a team of experienced healthcare professionals and
                cutting-edge technology, we strive to empower individuals with
                accessible, quality medical care.
              </p>
            </div>

            <Button
              additionalClasses="primarybtn max-w-fit"
              trailingIcon={<ArrowRight size={14} />}
              onClickHandler={handleBookAppointment}
            >
              BOOK APPOINTMENT
            </Button>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-6 bg-white dark:bg-accent2 rounded-xs p-4">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                  100+
                </div>
                <div className="text-sm md:text-base text-secondary dark:text-gray-300 font-medium">
                  Expert Doctor
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                  1,000+
                </div>
                <div className="text-sm md:text-base text-secondary dark:text-gray-300 font-medium">
                  Patients Served
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                  72%
                </div>
                <div className="text-sm md:text-base text-secondary dark:text-gray-300 font-medium">
                  Satisfactory Rate
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="relative hidden lg:block">
            <div className="relative w-full h-[500px] lg:h-[600px]">
              <Image
                src="/images/hero/div.png"
                alt="Healthcare professionals"
                fill
                className="object-contain"
                priority
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              />
            </div>

            {/* Floating elements for visual interest */}
            <div className="absolute top-10 right-10 w-16 h-16 bg-accent-light rounded-full opacity-60 animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-20 left-10 w-12 h-12 bg-orange-100 rounded-full opacity-60 animate-pulse delay-1000 pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
