import React from "react";
import { Clock, Calendar, DollarSign } from "lucide-react";
import { TimeSlot } from "@/hooks/useTimeSlotFilters";

interface NextBookableSlotProps {
  slot: TimeSlot;
  onSelect: (slot: TimeSlot) => void;
  formatDate: (date: string) => string;
  formatTime: (time: string) => string;
}

const NextBookableSlot: React.FC<NextBookableSlotProps> = ({
  slot,
  onSelect,
  formatDate,
  formatTime,
}) => {
  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-accent rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-accent rounded-full">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              Next Available Slot
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-200">
              Recommended for quick booking
            </p>
          </div>
        </div>
        <button
          onClick={() => onSelect(slot)}
          className="btn primarybtn min-h-fit min-w-fit"
        >
          Book Now
        </button>
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div className="flex items-center gap-2 text-accent dark:text-blue-200">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(slot.date)}</span>
        </div>
        <div className="flex items-center gap-2 text-accent dark:text-blue-200">
          <Clock className="w-4 h-4" />
          <span>
            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-accent dark:text-blue-200">
          <DollarSign className="w-4 h-4" />
          <span className="font-medium">{slot.consultationFee} XAF</span>
        </div>
      </div>
    </div>
  );
};

export default NextBookableSlot;
