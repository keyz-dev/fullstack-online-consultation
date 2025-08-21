import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Specialty } from "../../api/home";

interface SpecialtyCardProps {
  specialty: Specialty;
  className?: string;
}

const SpecialtyCard: React.FC<SpecialtyCardProps> = ({
  specialty,
  className = "",
}) => {
  const router = useRouter();

  const handleCardClick = () => {
    // Navigate to doctors page with specialty filter
    router.push(`/doctors?specialty=${specialty.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`w-full p-4 flex flex-col justify-center items-center border-2 border-transparent hover:border-accent hover:shadow-lg rounded-md bg-white dark:bg-gray-800 cursor-pointer transition-all duration-200 ${className}`}
    >
      {/* Icon */}
      <div className="w-[60px] h-[60px] flex items-center justify-center mb-4">
        {specialty.icon ? (
          <Image
            src={specialty.icon}
            alt={specialty.name}
            width={60}
            height={60}
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

      {/* Description */}
      {specialty.description && (
        <p className="text-sm text-center text-secondary dark:text-gray-300 h-auto sm:min-h-[70px] mb-3">
          {specialty.description}
        </p>
      )}

      {/* Doctor Count */}
      <p className="text-sm text-center text-secondary dark:text-gray-300 cursor-pointer">
        {specialty.doctorCount || 0}{" "}
        <span className="underline p-2">Doctors</span> &gt;
      </p>
    </div>
  );
};

export default SpecialtyCard;
