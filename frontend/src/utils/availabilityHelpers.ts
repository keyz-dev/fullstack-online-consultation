import {
  Availability,
  TimeBlock,
  ScheduleValidationResult,
  ScheduleValidationError,
} from "@/types/availability";

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export const DAY_SHORT_NAMES = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

export const CONSULTATION_TYPES = [
  {
    value: "online",
    label: "Online",
    icon: "🌐",
    color: "bg-blue-500",
    description: "Video/voice consultations",
  },
  {
    value: "physical",
    label: "Physical",
    icon: "🏥",
    color: "bg-green-500",
    description: "In-person consultations",
  },
  {
    value: "both",
    label: "Both",
    icon: "🔄",
    color: "bg-purple-500",
    description: "Online and physical",
  },
] as const;

export const DURATION_OPTIONS = [
  { value: 15, label: "15 min", description: "Quick consultation" },
  { value: 30, label: "30 min", description: "Standard consultation" },
  { value: 45, label: "45 min", description: "Extended consultation" },
  { value: 60, label: "1 hour", description: "Comprehensive consultation" },
  { value: 90, label: "1.5 hours", description: "Detailed consultation" },
  { value: 120, label: "2 hours", description: "Full session" },
] as const;

// Time utilities
export const timeUtils = {
  // Convert time string to minutes since midnight
  timeToMinutes: (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  },

  // Convert minutes since midnight to time string
  minutesToTime: (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  },

  // Check if two time ranges overlap
  isTimeOverlap: (
    start1: string,
    end1: string,
    start2: string,
    end2: string
  ): boolean => {
    const s1 = timeUtils.timeToMinutes(start1);
    const e1 = timeUtils.timeToMinutes(end1);
    const s2 = timeUtils.timeToMinutes(start2);
    const e2 = timeUtils.timeToMinutes(end2);

    return s1 < e2 && s2 < e1;
  },

  // Generate time slots within a time range
  generateTimeSlots: (
    startTime: string,
    endTime: string,
    duration: number
  ): string[] => {
    const slots: string[] = [];
    let currentTime = timeUtils.timeToMinutes(startTime);
    const endMinutes = timeUtils.timeToMinutes(endTime);

    while (currentTime + duration <= endMinutes) {
      slots.push(timeUtils.minutesToTime(currentTime));
      currentTime += duration;
    }

    return slots;
  },

  // Format time for display
  formatTime: (time: string): string => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  },

  // Get time difference in minutes
  getTimeDifference: (startTime: string, endTime: string): number => {
    return (
      timeUtils.timeToMinutes(endTime) - timeUtils.timeToMinutes(startTime)
    );
  },
};

// Validation utilities
export const validationUtils = {
  // Validate a single availability
  validateAvailability: (
    availability: Availability,
    index: number
  ): ScheduleValidationError[] => {
    const errors: ScheduleValidationError[] = [];

    // Required fields
    if (availability.dayOfWeek < 0 || availability.dayOfWeek > 6) {
      errors.push({
        field: "dayOfWeek",
        message: "Day of week must be between 0 and 6",
        availabilityIndex: index,
      });
    }

    if (
      !availability.startTime ||
      !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(availability.startTime)
    ) {
      errors.push({
        field: "startTime",
        message: "Start time must be in HH:MM format",
        availabilityIndex: index,
      });
    }

    if (
      !availability.endTime ||
      !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(availability.endTime)
    ) {
      errors.push({
        field: "endTime",
        message: "End time must be in HH:MM format",
        availabilityIndex: index,
      });
    }

    // Time validation
    if (availability.startTime && availability.endTime) {
      if (
        timeUtils.timeToMinutes(availability.startTime) >=
        timeUtils.timeToMinutes(availability.endTime)
      ) {
        errors.push({
          field: "endTime",
          message: "End time must be after start time",
          availabilityIndex: index,
        });
      }
    }

    // Duration validation
    if (
      availability.consultationDuration < 15 ||
      availability.consultationDuration > 120
    ) {
      errors.push({
        field: "consultationDuration",
        message: "Consultation duration must be between 15 and 120 minutes",
        availabilityIndex: index,
      });
    }

    // Fee validation
    if (availability.consultationFee < 0) {
      errors.push({
        field: "consultationFee",
        message: "Consultation fee cannot be negative",
        availabilityIndex: index,
      });
    }

    // Max patients validation
    if (availability.maxPatients && availability.maxPatients < 1) {
      errors.push({
        field: "maxPatients",
        message: "Max patients must be at least 1",
        availabilityIndex: index,
      });
    }

    return errors;
  },

  // Validate a single time block
  validateTimeBlock: (
    timeBlock: Partial<TimeBlock>
  ): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    // Required fields
    if (!timeBlock.startTime) {
      errors.startTime = "Start time is required";
    } else if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeBlock.startTime)) {
      errors.startTime = "Start time must be in HH:MM format";
    }

    if (!timeBlock.endTime) {
      errors.endTime = "End time is required";
    } else if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeBlock.endTime)) {
      errors.endTime = "End time must be in HH:MM format";
    }

    // Time validation
    if (timeBlock.startTime && timeBlock.endTime) {
      if (
        timeUtils.timeToMinutes(timeBlock.startTime) >=
        timeUtils.timeToMinutes(timeBlock.endTime)
      ) {
        errors.endTime = "End time must be after start time";
      }
    }

    // Duration validation
    if (
      timeBlock.consultationDuration &&
      (timeBlock.consultationDuration < 15 ||
        timeBlock.consultationDuration > 120)
    ) {
      errors.consultationDuration =
        "Consultation duration must be between 15 and 120 minutes";
    }

    // Fee validation
    if (timeBlock.consultationFee && timeBlock.consultationFee < 0) {
      errors.consultationFee = "Consultation fee cannot be negative";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  // Check for time conflicts with existing availabilities
  checkTimeConflict: (
    timeBlock: Partial<TimeBlock>,
    existingAvailabilities: Availability[]
  ): string | null => {
    if (!timeBlock.startTime || !timeBlock.endTime) return null;

    for (const availability of existingAvailabilities) {
      const start1 = timeUtils.timeToMinutes(timeBlock.startTime);
      const end1 = timeUtils.timeToMinutes(timeBlock.endTime);
      const start2 = timeUtils.timeToMinutes(availability.startTime);
      const end2 = timeUtils.timeToMinutes(availability.endTime);

      if (start1 < end2 && start2 < end1) {
        const dayNames = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        return `Time conflict with existing session on ${
          dayNames[availability.dayOfWeek]
        }`;
      }
    }

    return null;
  },

  // Validate multiple availabilities
  validateAvailabilities: (
    availabilities: Availability[]
  ): ScheduleValidationResult => {
    const errors: ScheduleValidationError[] = [];

    // Validate each availability
    availabilities.forEach((availability, index) => {
      const availabilityErrors = validationUtils.validateAvailability(
        availability,
        index
      );
      errors.push(...availabilityErrors);
    });

    // Check for overlapping times on the same day
    const dayGroups = availabilities.reduce((acc, av) => {
      if (!acc[av.dayOfWeek]) acc[av.dayOfWeek] = [];
      acc[av.dayOfWeek].push(av);
      return acc;
    }, {} as Record<number, Availability[]>);

    Object.entries(dayGroups).forEach(([dayOfWeek, dayAvailabilities]) => {
      if (dayAvailabilities.length > 1) {
        for (let i = 0; i < dayAvailabilities.length; i++) {
          for (let j = i + 1; j < dayAvailabilities.length; j++) {
            const av1 = dayAvailabilities[i];
            const av2 = dayAvailabilities[j];

            if (
              timeUtils.isTimeOverlap(
                av1.startTime,
                av1.endTime,
                av2.startTime,
                av2.endTime
              )
            ) {
              errors.push({
                field: "timeOverlap",
                message: `Overlapping times found for ${
                  DAY_NAMES[parseInt(dayOfWeek)]
                }: ${av1.startTime}-${av1.endTime} and ${av2.startTime}-${
                  av2.endTime
                }`,
                availabilityIndex: i,
              });
            }
          }
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

// Schedule utilities
export const scheduleUtils = {
  // Group availabilities by day
  groupByDay: (availabilities: Availability[]) => {
    return availabilities.reduce((acc, availability) => {
      if (!acc[availability.dayOfWeek]) {
        acc[availability.dayOfWeek] = [];
      }
      acc[availability.dayOfWeek].push(availability);
      return acc;
    }, {} as Record<number, Availability[]>);
  },

  // Create a week schedule object
  createWeekSchedule: (availabilities: Availability[]) => {
    const weekSchedule: Record<
      number,
      { dayOfWeek: number; dayName: string; availabilities: Availability[] }
    > = {};

    DAY_NAMES.forEach((dayName, index) => {
      weekSchedule[index] = {
        dayOfWeek: index,
        dayName,
        availabilities: availabilities.filter((av) => av.dayOfWeek === index),
      };
    });

    return weekSchedule;
  },

  // Calculate total hours per week
  calculateWeeklyHours: (availabilities: Availability[]): number => {
    return availabilities.reduce((total, av) => {
      const hours = timeUtils.getTimeDifference(av.startTime, av.endTime) / 60;
      return total + hours;
    }, 0);
  },

  // Calculate potential earnings per week
  calculateWeeklyEarnings: (availabilities: Availability[]): number => {
    return availabilities.reduce((total, av) => {
      const slots = Math.floor(
        timeUtils.getTimeDifference(av.startTime, av.endTime) /
          av.consultationDuration
      );
      return total + slots * av.consultationFee;
    }, 0);
  },

  // Convert TimeBlock to Availability
  timeBlockToAvailability: (
    timeBlock: TimeBlock,
    dayOfWeek: number
  ): Availability => {
    return {
      dayOfWeek,
      startTime: timeBlock.startTime,
      endTime: timeBlock.endTime,
      consultationDuration: timeBlock.consultationDuration,
      consultationType: timeBlock.consultationType,
      consultationFee: timeBlock.consultationFee,
      maxPatients: timeBlock.maxPatients,
    };
  },

  // Convert Availability to TimeBlock
  availabilityToTimeBlock: (availability: Availability): TimeBlock => {
    return {
      id: availability.id?.toString() || crypto.randomUUID(),
      startTime: availability.startTime,
      endTime: availability.endTime,
      consultationDuration: availability.consultationDuration,
      consultationType: availability.consultationType,
      consultationFee: availability.consultationFee,
      maxPatients: availability.maxPatients,
    };
  },
};

// UI utilities
export const uiUtils = {
  // Get consultation type color
  getConsultationTypeColor: (type: "online" | "physical" | "both"): string => {
    const config = CONSULTATION_TYPES.find((t) => t.value === type);
    return config?.color || "bg-gray-500";
  },

  // Get consultation type icon
  getConsultationTypeIcon: (type: "online" | "physical" | "both"): string => {
    const config = CONSULTATION_TYPES.find((t) => t.value === type);
    return config?.icon || "📋";
  },

  // Get duration label
  getDurationLabel: (duration: number): string => {
    const option = DURATION_OPTIONS.find((d) => d.value === duration);
    return option?.label || `${duration} min`;
  },

  // Format currency
  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(amount);
  },

  // Get day name
  getDayName: (dayOfWeek: number): string => {
    return DAY_NAMES[dayOfWeek] || "Unknown";
  },

  // Get short day name
  getShortDayName: (dayOfWeek: number): string => {
    return DAY_SHORT_NAMES[dayOfWeek] || "Unknown";
  },
};
