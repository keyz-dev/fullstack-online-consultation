import React from "react";
import { ArrowRight, Stethoscope, Users, Clock, Shield } from "lucide-react";
import { Button, SubHeading } from "../ui";
import { useRouter } from "next/navigation";

const DoctorLinkSection = () => {
  const router = useRouter();
  const benefits = [
    {
      icon: <Users className="w-6 h-6 text-accent" />,
      title: "Reach More Patients",
      description: "Connect with patients nationwide and expand your practice.",
    },
    {
      icon: <Clock className="w-6 h-6 text-accent" />,
      title: "Flexible Schedule",
      description: "Set your own hours and work from anywhere.",
    },
    {
      icon: <Shield className="w-6 h-6 text-accent" />,
      title: "Secure Platform",
      description: "HIPAA-compliant platform with advanced security measures.",
    },
  ];

  return (
    <section className="py-10 bg-accent dark:bg-accent2">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <SubHeading
              tagline="Join Our Platform"
              title="Become a Doctor"
              description="Join our network of healthcare professionals and start providing quality care to patients nationwide."
            />

            <div className="space-y-6 mt-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-white/20 rounded-full p-2 flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-white/80">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Button
                additionalClasses="primarybtn bg-white text-accent"
                trailingIcon={<ArrowRight size={16} />}
                onClickHandler={() => router.push("/register/doctor")}
                text="JOIN AS DOCTOR"
              />
            </div>
          </div>

          <div className="relative">
            <div className="bg-white/10 rounded-lg p-8 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-white/20 rounded-full p-3">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Why Choose Us?
                  </h3>
                  <p className="text-white/80">
                    Join thousands of doctors already on our platform
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Active Doctors</span>
                  <span className="text-white font-bold">500+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Patients Served</span>
                  <span className="text-white font-bold">10,000+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Satisfaction Rate</span>
                  <span className="text-white font-bold">98%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorLinkSection;
