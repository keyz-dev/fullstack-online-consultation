import React from "react";
import { Loader } from "../ui";

const DoctorGrid: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-gray-900">
      <div className="text-center">
        <div className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
          🚧 Coming Soon
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Our comprehensive doctor directory is under development. You'll soon
          be able to browse, search, and connect with healthcare professionals.
        </p>

        {/* Placeholder Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-md"></div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Loader className="w-8 h-8 mx-auto text-accent" />
        </div>
      </div>
    </div>
  );
};

export default DoctorGrid;
