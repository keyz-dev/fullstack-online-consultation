"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  Star,
  Clock,
  Phone,
  Mail,
  Calendar,
  GraduationCap,
  Languages,
  Building,
} from "lucide-react";
import { doctorsApi, Doctor } from "../../../../api/doctors";
import HeroSection from "../../../../components/ui/HeroSection";
import { Button, Loader } from "../../../../components/ui";

const DoctorDetailPage = () => {
  const params = useParams();
  const doctorId = params.id as string;

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const response = await doctorsApi.getDoctorById(parseInt(doctorId));
        setDoctor(response.data);
      } catch (err: unknown) {
        console.error("Error fetching doctor:", err);
        setError(
          err?.response?.data?.message || "Failed to load doctor details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchDoctor();
    }
  }, [doctorId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <Loader className="w-8 h-8 text-accent" />
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg font-medium mb-2">
            {error || "Doctor not found"}
          </div>
          <Button
            onClickHandler={() => window.history.back()}
            additionalClasses="primarybtn"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const formatConsultationFee = (fee: number) => {
    return `${fee.toLocaleString()} XAF`;
  };

  const getRatingDisplay = () => {
    if (!doctor.averageRating || doctor.averageRating === 0) {
      return null;
    }
    return (
      <div className="flex items-center gap-2">
        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        <span className="text-lg font-semibold">
          {doctor.averageRating.toFixed(1)}
        </span>
        <span className="text-sm text-gray-500">
          ({doctor.totalReviews} reviews)
        </span>
      </div>
    );
  };

  const getPrimarySpecialty = () => {
    return doctor.specialties[0]?.name || "General Practitioner";
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section with Doctor's Image as Background */}
      <HeroSection
        title={`Dr. ${doctor.user.name}`}
        subtitle={getPrimarySpecialty()}
        breadcrumbs={["Home", "Doctors", doctor.user.name]}
        backgroundImage={doctor.user.avatar || "/images/hero/doctors.webp"}
      >
        {/* Doctor Stats */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {doctor.experience}
            </div>
            <div className="text-white/80 text-sm">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {formatConsultationFee(doctor.consultationFee)}
            </div>
            <div className="text-white/80 text-sm">Consultation Fee</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {doctor.totalReviews}
            </div>
            <div className="text-white/80 text-sm">Reviews</div>
          </div>
        </div>
      </HeroSection>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Doctor Image and Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
              {/* Doctor Image */}
              <div className="text-center mb-6">
                <div className="relative w-48 h-48 mx-auto mb-4">
                  {doctor.user.avatar ? (
                    <Image
                      src={doctor.user.avatar}
                      alt={doctor.user.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-accent/10 rounded-full flex items-center justify-center">
                      <span className="text-accent text-4xl font-bold">
                        {doctor.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-primary dark:text-white mb-2">
                  Dr. {doctor.user.name}
                </h2>
                <p className="text-secondary dark:text-gray-300 mb-2">
                  {getPrimarySpecialty()}
                </p>
                {getRatingDisplay()}
              </div>

              {/* Quick Stats */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-secondary dark:text-gray-300">
                    {doctor.experience} Years of Experience
                  </span>
                </div>

                {doctor.operationalHospital && (
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-secondary dark:text-gray-300">
                      {doctor.operationalHospital}
                    </span>
                  </div>
                )}

                {doctor.user.phoneNumber && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-secondary dark:text-gray-300">
                      {doctor.user.phoneNumber}
                    </span>
                  </div>
                )}

                {doctor.user.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-secondary dark:text-gray-300">
                      {doctor.user.email}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClickHandler={() => {
                    // TODO: Navigate to booking flow
                    console.log("Book appointment for:", doctor.user.name);
                  }}
                  additionalClasses="primarybtn w-full"
                >
                  Book Appointment
                </Button>
                <Button
                  onClickHandler={() => window.history.back()}
                  additionalClasses="outlinebtn w-full"
                >
                  Back to Doctors
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            {doctor.bio && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-semibold text-primary dark:text-white mb-4">
                  About
                </h3>
                <p className="text-secondary dark:text-gray-300 leading-relaxed">
                  {doctor.bio}
                </p>
              </div>
            )}

            {/* Specialties */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-primary dark:text-white mb-4">
                Specialties
              </h3>
              <div className="flex flex-wrap gap-2">
                {doctor.specialties.map((specialty) => (
                  <span
                    key={specialty.id}
                    className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {specialty.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Education */}
            {doctor.education && doctor.education.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-semibold text-primary dark:text-white mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Education
                </h3>
                <ul className="space-y-2">
                  {doctor.education.map((edu, index) => (
                    <li
                      key={index}
                      className="text-secondary dark:text-gray-300"
                    >
                      • {edu}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Languages */}
            {doctor.languages && doctor.languages.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-semibold text-primary dark:text-white mb-4 flex items-center gap-2">
                  <Languages className="w-5 h-5" />
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {doctor.languages.map((language, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Availability */}
            {doctor.availabilities && doctor.availabilities.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-semibold text-primary dark:text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Availability
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {doctor.availabilities.map((availability) => (
                    <div
                      key={availability.id}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-3"
                    >
                      <div className="font-medium text-primary dark:text-white">
                        {getDayName(availability.dayOfWeek)}
                      </div>
                      <div className="text-sm text-secondary dark:text-gray-300">
                        {availability.startTime} - {availability.endTime}
                      </div>
                      <div className="text-xs text-accent mt-1">
                        {availability.consultationType}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get day name
const getDayName = (dayOfWeek: number): string => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[dayOfWeek] || "Unknown";
};

export default DoctorDetailPage;
