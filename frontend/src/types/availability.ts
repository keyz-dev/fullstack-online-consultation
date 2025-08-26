export interface Availability {
  id?: number;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  consultationDuration: number; // 15-120 minutes
  consultationType: "online" | "physical" | "both";
  consultationFee: number;
  maxPatients?: number;
  isAvailable?: boolean;
  isInvalidated?: boolean;
  invalidationReason?: string;
  invalidatedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAvailabilityRequest {
  availabilities: Availability[];
}

export interface UpdateAvailabilityRequest {
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  consultationDuration?: number;
  consultationType?: "online" | "physical" | "both";
  consultationFee?: number;
  maxPatients?: number;
  isAvailable?: boolean;
}

export interface TimeSlot {
  id: number;
  doctorAvailabilityId: number;
  startTime: string;
  endTime: string;
  date: string;
  isBooked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorAvailabilityWithSlots extends Availability {
  timeSlots?: TimeSlot[];
  doctor?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface DaySchedule {
  dayOfWeek: number;
  dayName: string;
  availabilities: Availability[];
  isSelected?: boolean;
}

export interface WeekSchedule {
  [dayOfWeek: number]: DaySchedule;
}

export interface TimeBlock {
  id: string;
  startTime: string;
  endTime: string;
  consultationDuration: number;
  consultationType: "online" | "physical" | "both";
  consultationFee: number;
  maxPatients?: number;
  isEditing?: boolean;
}

export interface ScheduleTemplate {
  id: string;
  name: string;
  description?: string;
  availabilities: Availability[];
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilityStats {
  totalAvailabilities: number;
  activeAvailabilities: number;
  totalTimeSlots: number;
  bookedTimeSlots: number;
  weeklyHours: number;
  monthlyEarnings: number;
}

export interface ConsultationTypeConfig {
  value: "online" | "physical" | "both";
  label: string;
  icon: string;
  color: string;
  description: string;
}

export interface DurationOption {
  value: number;
  label: string;
  description: string;
}

export interface TimeRange {
  start: string;
  end: string;
  duration: number;
}

export interface ScheduleValidationError {
  field: string;
  message: string;
  availabilityIndex?: number;
}

export interface ScheduleValidationResult {
  isValid: boolean;
  errors: ScheduleValidationError[];
}
