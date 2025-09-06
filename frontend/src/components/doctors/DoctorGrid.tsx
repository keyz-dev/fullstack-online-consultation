import React from "react";
import { useDoctor } from "../../contexts/DoctorContext";
import DoctorCard from "./DoctorCard";
import { Button, Loader } from "../ui";

const DoctorGrid: React.FC = () => {
  const { doctors, loading, error, hasMore, pagination, handleLoadMore } =
    useDoctor();

  if (loading && doctors.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-gray-900">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-md mb-4"></div>
              <div className="space-y-2">
                <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-1/2"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-2/3"></div>
              </div>
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
            Error Loading Doctors
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button
            onClickHandler={() => window.location.reload()}
            additionalClasses="primarybtn"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
            No Doctors Found
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your search criteria or browse all available doctors.
          </p>
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-2xl">👨‍⚕️</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-gray-900">
      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {doctors.length} of {pagination.total} doctors
        </p>
      </div>

      {/* Doctors Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-8 text-center flex justify-center">
          <Button
            onClickHandler={handleLoadMore}
            isDisabled={loading}
            additionalClasses="primarybtn"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 mr-2" />
                Loading...
              </>
            ) : (
              "Load More Doctors"
            )}
          </Button>
        </div>
      )}

      {/* Loading indicator for load more */}
      {loading && doctors.length > 0 && (
        <div className="mt-8 text-center">
          <Loader className="w-8 h-8 mx-auto text-accent" />
        </div>
      )}

      {/* End of results */}
      {!hasMore && doctors.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You&apos;ve reached the end of the results
          </p>
        </div>
      )}
    </div>
  );
};

export default DoctorGrid;
