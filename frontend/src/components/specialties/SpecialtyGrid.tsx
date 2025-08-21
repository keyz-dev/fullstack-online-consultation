import React from "react";
import SpecialtyCard from "./SpecialtyCard";
import { Specialty } from "../../api/home";
import { Button, Loader } from "../ui";

interface SpecialtyGridProps {
  specialties: Specialty[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  onLoadMore: () => void;
}

const SpecialtyGrid: React.FC<SpecialtyGridProps> = ({
  specialties,
  loading,
  error,
  hasMore,
  onLoadMore,
}) => {
  if (loading && specialties.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-gray-900">
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="text-red-500 text-lg font-medium mb-2">
            Error Loading Specialties
          </div>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (specialties.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
            No Specialties Found
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search criteria or browse all specialties.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-gray-900">
      {/* Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {specialties.map((specialty) => (
          <SpecialtyCard key={specialty.id} specialty={specialty} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-8 text-center flex justify-center">
          <Button
            onClickHandler={onLoadMore}
            isDisabled={loading}
            additionalClasses="primarybtn"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 mr-2" />
                Loading...
              </>
            ) : (
              "Load More Specialties"
            )}
          </Button>
        </div>
      )}

      {/* Loading indicator for load more */}
      {loading && specialties.length > 0 && (
        <div className="mt-8 text-center">
          <Loader className="w-8 h-8 mx-auto text-accent" />
        </div>
      )}
    </div>
  );
};

export default SpecialtyGrid;
