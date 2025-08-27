import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui";
import { useAuth } from "../../contexts/AuthContext";
import { useBookingIntent } from "../../hooks/useBookingIntent";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const HeroSection = () => {
  const { user } = useAuth();
  const { setBookingIntent } = useBookingIntent();
  const router = useRouter();

  const handleBookAppointment = () => {
    if (!user) {
      // Set booking intent and redirect to login
      setBookingIntent({
        type: "global",
      });
      router.push("/login");
      return;
    }

    if (user?.role !== "patient") {
      // Show error or redirect appropriately
      toast.error("Only patients can book appointments for now");
      return;
    }

    // User is authenticated patient, redirect to booking
    router.push("/booking");
  };

  return (
    <section
      className="relative h-[80vh] bg-light_bg dark:bg-gray-900 overflow-hidden bg-cover"
      style={{ backgroundImage: `url(/images/hero/bg.png)` }}
    >
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
