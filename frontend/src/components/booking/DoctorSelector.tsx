import React, { useState, useEffect } from "react";
import { useBooking } from "@/contexts/BookingContext";
import { useDoctor } from "@/contexts/DoctorContext";
import { Doctor } from "@/types";
import { Search, Star, MapPin, Clock } from "lucide-react";
import Loader from "@/components/ui/Loader";

const DoctorSelector: React.FC = () => {
  const { state, dispatch } = useBooking();
  const {
    doctors,
    loading,
    error,
    fetchDoctors,
    handleSearch,
    handleFilterChange,
  } = useDoctor();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Initialize with symptoms/specialty filters if available
  useEffect(() => {
    const filters: unknown = {};

    if (state.symptomIds?.length) {
      filters.symptomIds = state.symptomIds;
    }
    if (state.specialtyId) {
      filters.specialtyId = state.specialtyId;
    }

    if (Object.keys(filters).length > 0) {
      handleFilterChange(filters);
    }

    fetchDoctors();
  }, [state.symptomIds, state.specialtyId, fetchDoctors, handleFilterChange]);

  // Initialize selected doctor from booking context
  useEffect(() => {
    if (state.doctor && state.doctorId) {
      setSelectedDoctor(state.doctor);
    }
  }, [state.doctor, state.doctorId]);

  // Update search when searchTerm changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        handleSearch(searchTerm);
      } else {
        fetchDoctors();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, handleSearch, fetchDoctors]);

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    dispatch({
      type: "UPDATE_STEP_DATA",
      payload: {
        stepIndex: 1,
        data: { doctorId: doctor.id, doctor: doctor },
      },
    });
    // Mark step as completed when doctor is selected
    dispatch({
      type: "SET_STEP_COMPLETED",
      payload: { stepIndex: 1, completed: true },
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Choose Your Doctor
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Select a doctor based on your symptoms and preferences.
      </p>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search doctors by name, specialty, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 outline-none rounded-xs focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Filters
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => handleFilterChange({ experience: "asc" })}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <Filter className="w-4 h-4" />
          Experience
        </button>
        <button
          onClick={() => handleFilterChange({ rating: "desc" })}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <Star className="w-4 h-4" />
          Rating
        </button>
        <button
          onClick={() => handleFilterChange({ consultationFee: "asc" })}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Price
        </button>
      </div> */}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Doctors List */}
      {!loading && !error && (
        <div className="space-y-4">
          {doctors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No doctors found matching your criteria.
              </p>
            </div>
          ) : (
            doctors.map((doctor) => (
              <div
                key={doctor.id}
                onClick={() => handleDoctorSelect(doctor)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedDoctor?.id === doctor.id
                    ? "border-primary bg-primary/5 dark:bg-primary/10"
                    : "border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Doctor Avatar */}
                  <div className="flex-shrink-0">
                    <img
                      src={doctor.user.avatar || "/images/default-avatar.png"}
                      alt={doctor.user.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>

                  {/* Doctor Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Dr. {doctor.user.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {doctor.specialties?.map((s) => s.name).join(", ")}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">
                          {doctor.averageRating?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {typeof doctor.clinicAddress === "string"
                            ? doctor.clinicAddress
                            : doctor.clinicAddress?.fullAddress ||
                              doctor.clinicAddress?.city ||
                              "Location not specified"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{doctor.experience} years experience</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{doctor.consultationFee} XAF/consultation</span>
                      </div>
                    </div>

                    {doctor.bio && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {doctor.bio}
                      </p>
                    )}
                  </div>
                </div>

                {/* Selection Indicator */}
                {selectedDoctor?.id === doctor.id && (
                  <div className="mt-3 flex items-center gap-2 text-primary">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm font-medium">Selected</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorSelector;
