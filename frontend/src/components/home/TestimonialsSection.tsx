import React from "react";
import Image from "next/image";
import { useHome } from "../../contexts";
import { Star } from "lucide-react";
import SubHeading from "../ui/SubHeading";

const TestimonialsSection = () => {
  const { homeData, loading } = useHome();

  if (loading) {
    return (
      <section className="py-10 bg-light_bg dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <SubHeading
            tagline="Testimonials"
            title="What Our Patients Say"
            description="Read what our patients have to say about their experience with our healthcare platform."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const testimonials = homeData?.testimonials || [];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section className="py-10 bg-light_bg dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <SubHeading
          tagline="Testimonials"
          title="What Our Patients Say"
          description="Read what our patients have to say about their experience with our healthcare platform."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id || index}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="flex mr-2">
                  {renderStars(testimonial.rating)}
                </div>
                <span className="text-sm text-secondary dark:text-gray-300">
                  {testimonial.rating}/5
                </span>
              </div>

              <p className="text-secondary dark:text-gray-300 mb-4 leading-relaxed">
                "{testimonial.message}"
              </p>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center mr-3">
                  <span className="text-accent font-bold text-sm">
                    {testimonial.user?.name?.charAt(0) || "P"}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-primary dark:text-white">
                    {testimonial.user?.name || "Patient"}
                  </h4>
                  <p className="text-sm text-secondary dark:text-gray-300">
                    {testimonial.user?.role || "Patient"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
