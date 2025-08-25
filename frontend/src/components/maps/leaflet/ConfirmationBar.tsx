import React from "react";
import { MapPin } from "lucide-react";

interface ConfirmationBarProps {
  address: string;
  visible: boolean;
}

const ConfirmationBar: React.FC<ConfirmationBarProps> = ({
  address,
  visible,
}) => {
  if (!visible || !address) return null;

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
      <div className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 max-w-sm">
        <MapPin className="h-4 w-4 flex-shrink-0" />
        <span className="text-sm font-medium truncate">{address}</span>
      </div>
    </div>
  );
};

export default ConfirmationBar;
