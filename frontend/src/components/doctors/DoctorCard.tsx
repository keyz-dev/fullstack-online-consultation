import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star, MapPin, Clock, ArrowRight } from "lucide-react";
import { Doctor } from "../../api/doctors";
import { useAuth } from "../../contexts/AuthContext";
import { useBookingIntent } from "../../hooks/useBookingIntent";

interface DoctorCardProps {
  doctor: Doctor;
  className?: string;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, className = "" }) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { setBookingIntent } = useBookingIntent();

  const handleViewProfile = () => {
    router.push(`/doctors/${doctor.id}`);
  };

  const handleBookAppointment = () => {
    if (!isAuthenticated) {
      // Set booking intent with doctor data and redirect to login
      setBookingIntent({
        type: "doctor",
        doctorId: doctor.id,
      });
      router.push("/login");
      return;
    }

    if (user?.role !== "patient") {
      // Show error or redirect appropriately
      console.log("Only patients can book appointments");
      return;
    }

    // User is authenticated patient, redirect to booking with doctor data
    router.push(`/booking?doctorId=${doctor.id}`);
  };

  const getPrimarySpecialty = () => {
    return doctor.specialties[0]?.name || "General Practitioner";
  };

  const formatConsultationFee = (fee: number) => {
    return `${fee.toLocaleString()} XAF`;
  };

  const getRatingDisplay = () => {
    if (!doctor.averageRating || doctor.averageRating === 0) {
      return null;
    }
    return (
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-medium">
          {doctor.averageRating.toFixed(1)}
        </span>
        <span className="text-xs text-gray-500">({doctor.totalReviews})</span>
      </div>
    );
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200 ${className}`}
    >
      {/* Doctor Image */}
      <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
        {doctor.user.avatar ? (
          <Image
            src={doctor.user.avatar}
            alt={doctor.user.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center">
              <span className="text-accent text-2xl font-bold">
                {doctor.user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Specialty Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-accent text-white px-2 py-1 rounded-full text-xs font-medium">
            {getPrimarySpecialty()}
          </span>
        </div>
      </div>

      {/* Doctor Info */}
      <div className="p-4">
        {/* Name and Rating */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-primary dark:text-white line-clamp-1">
            Dr. {doctor.user.name}
          </h3>
          {getRatingDisplay()}
        </div>

        {/* Specialty */}
        <p className="text-sm text-secondary dark:text-gray-300 mb-2">
          {getPrimarySpecialty()}
        </p>

        {/* Experience */}
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-secondary dark:text-gray-300">
            {doctor.experience} Years of Experience
          </span>
        </div>

        {/* Location */}
        {doctor.operationalHospital && (
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-secondary dark:text-gray-300 line-clamp-1">
              {doctor.operationalHospital}
            </span>
          </div>
        )}

        {/* Consultation Fee */}
        <div className="mb-4">
          <span className="text-lg font-semibold text-accent">
            {formatConsultationFee(doctor.consultationFee)}
          </span>
          <span className="text-sm text-secondary dark:text-gray-300 ml-1">
            Fee
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleViewProfile}
            className="flex-1 text-accent text-sm font-medium hover:text-accent/80 transition-colors"
          >
            View Profile
          </button>
          <button
            onClick={handleBookAppointment}
            className="flex-1 bg-accent text-white px-3 py-2 rounded text-sm font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-1"
          >
            Book Appointment
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
