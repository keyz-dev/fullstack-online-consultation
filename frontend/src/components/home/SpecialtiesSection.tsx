import React from "react";
import { useHome } from "../../contexts";
import { ChevronRight } from "lucide-react";
import { SubHeading, Button } from "../ui";
import { useRouter } from "next/navigation";

const SpecialtiesSection = () => {
  const { homeData, loading } = useHome();
  const router = useRouter();

  if (loading) {
    return (
      <section className="w-screen bg-slate-100 dark:bg-gray-900">
        <section className="container py-10 flex flex-col gap-5">
          <SubHeading
            tagline="Our Specialties"
            title="Medical Specialties"
            description="Find the right specialist for your healthcare needs"
          />
          <p className="text-center text-secondary dark:text-gray-300 text-sm md:w-[40%] mx-auto">
            More than 200 Doctors trained doctors on DrogCine providing video
            consultancy and easy appointment
          </p>
          <div className="w-full grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-32 rounded-md"></div>
              </div>
            ))}
          </div>
        </section>
      </section>
    );
  }

  const specialties = homeData?.specialties || [];

  const handleViewMore = () => {
    router.push("/specialties");
  };

  return (
    <section className="w-screen bg-slate-100 dark:bg-gray-900">
      <section className="container py-10 flex flex-col gap-5">
        <SubHeading
          tagline="Our Specialties"
          title="Medical Specialties"
          description="More than 200 Doctors trained doctors on DrogCine providing video
          consultancy and easy appointment"
        />

        <div className="flex w-full items-center justify-between">
          <h2 className="text-lg font-medium text-primary dark:text-white">
            Topping Specialties
          </h2>
          <Button
            onClickHandler={handleViewMore}
            additionalClasses="border border-line_clr dark:border-white text-secondary"
            text="VIEW MORE"
            trailingIcon={
              <ChevronRight className="w-4 h-4 text-secondary dark:text-gray-300 hover:text-white" />
            }
          />
        </div>

        <section className="w-full grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {specialties.length > 0 ? (
            specialties.map((specialty) => (
              <div
                key={specialty.id}
                className="w-full p-4 flex flex-col justify-center items-center border-2 border-transparent hover:border-accent hover:shadow-lg rounded-md bg-white dark:bg-gray-800 cursor-pointer transition-all duration-200"
                onClick={() =>
                  router.push(`/doctors?specialty=${specialty.id}`)
                }
              >
                {/* Icon */}
                <div className="w-[60px] h-[60px] flex items-center justify-center mb-4">
                  {specialty.icon ? (
                    <img
                      src={specialty.icon}
                      alt={specialty.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-accent/10 rounded-full flex items-center justify-center">
                      <span className="text-accent text-2xl font-bold">
                        {specialty.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-lg text-center font-semibold text-primary dark:text-white mb-2">
                  {specialty.name}
                </h2>

                {/* Doctor Count */}
                <p className="text-sm text-center text-secondary dark:text-gray-300">
                  {specialty.doctorCount || 0}{" "}
                  <span className="underline p-2">Doctors</span> &gt;
                </p>
              </div>
            ))
          ) : (
            <div className="w-full col-span-5 h-[100px] flex items-center justify-center text-secondary dark:text-gray-400">
              There are no specialties available
            </div>
          )}
        </section>
      </section>
    </section>
  );
};

export default SpecialtiesSection;
