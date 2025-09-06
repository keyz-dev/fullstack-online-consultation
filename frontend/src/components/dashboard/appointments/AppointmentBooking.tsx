"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { consultationsAPI } from "@/api/consultations";
import { doctorsAPI } from "@/api/doctors";
import { specialtiesAPI } from "@/api/specialties";
import { Doctor, Specialty, TimeSlot } from "@/types";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Clock,
  User,
  Video,
  Phone,
  MessageSquare,
  MapPin,
  Search,
  Star,
  Award,
} from "lucide-react";
import { format, addDays, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";

interface AppointmentBookingProps {
  onBookingComplete?: (appointment: unknown) => void;
  onCancel?: () => void;
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  onBookingComplete,
  onCancel,
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedType, setSelectedType] = useState<
    "video_call" | "voice_call" | "chat" | "in_person"
  >("video_call");
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Load specialties
  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const response = await specialtiesAPI.getSpecialties();
        setSpecialties(response.specialties);
      } catch (error) {
        console.error("Error loading specialties:", error);
        toast.error("Failed to load specialties");
      }
    };
    loadSpecialties();
  }, []);

  // Load doctors when specialty changes
  useEffect(() => {
    const loadDoctors = async () => {
      if (!selectedSpecialty) {
        setDoctors([]);
        return;
      }

      try {
        const response = await doctorsAPI.getDoctors({
          filters: { specialtyId: selectedSpecialty },
        });
        setDoctors(response.doctors);
      } catch (error) {
        console.error("Error loading doctors:", error);
        toast.error("Failed to load doctors");
      }
    };
    loadDoctors();
  }, [selectedSpecialty]);

  // Load available slots when doctor and date change
  useEffect(() => {
    const loadAvailableSlots = async () => {
      if (!selectedDoctor || !selectedDate) {
        setAvailableSlots([]);
        return;
      }

      try {
        const dateString = format(selectedDate, "yyyy-MM-dd");
        const slots = await consultationsAPI.getAvailableSlots(
          selectedDoctor.id,
          dateString,
          selectedType
        );
        setAvailableSlots(slots);
      } catch (error) {
        console.error("Error loading available slots:", error);
        toast.error("Failed to load available time slots");
      }
    };
    loadAvailableSlots();
  }, [selectedDoctor, selectedDate, selectedType]);

  // Filter doctors based on search query
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle booking
  const handleBooking = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast.error("Please complete all required fields");
      return;
    }

    try {
      setLoading(true);

      // Combine date and time
      const [hours, minutes] = selectedTime.split(":");
      const scheduledAt = new Date(selectedDate);
      scheduledAt.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const appointment = await consultationsAPI.createConsultation({
        doctorId: selectedDoctor.id,
        scheduledAt: scheduledAt.toISOString(),
        type: selectedType,
        symptoms,
        notes,
      });

      toast.success("Appointment booked successfully!");
      onBookingComplete?.(appointment);
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  // Get consultation type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video_call":
        return <Video className="w-4 h-4" />;
      case "voice_call":
        return <Phone className="w-4 h-4" />;
      case "chat":
        return <MessageSquare className="w-4 h-4" />;
      case "in_person":
        return <MapPin className="w-4 h-4" />;
      default:
        return <Video className="w-4 h-4" />;
    }
  };

  // Get consultation type label
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "video_call":
        return "Video Call";
      case "voice_call":
        return "Voice Call";
      case "chat":
        return "Chat";
      case "in_person":
        return "In Person";
      default:
        return "Video Call";
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
          Book Appointment
        </CardTitle>
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div
              key={stepNumber}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                step >= stepNumber
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
              )}
            >
              {stepNumber}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step 1: Select Specialty */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Select Specialty
            </h3>
            <Select
              value={selectedSpecialty}
              onValueChange={setSelectedSpecialty}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a specialty" />
              </SelectTrigger>
              <SelectContent>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty.id} value={specialty.id}>
                    {specialty.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!selectedSpecialty}>
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Select Doctor */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Select Doctor
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search doctors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="grid gap-4 max-h-96 overflow-y-auto">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className={cn(
                    "p-4 border rounded-lg cursor-pointer transition-colors",
                    selectedDoctor?.id === doctor.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                  )}
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Dr. {doctor.user.firstName} {doctor.user.lastName}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {doctor.specialty?.name}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                            {doctor.rating || "N/A"}
                          </span>
                        </div>
                        {doctor.experience && (
                          <Badge variant="secondary" className="text-xs">
                            {doctor.experience} years
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)} disabled={!selectedDoctor}>
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Select Date, Time & Type */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Select Date, Time & Consultation Type
            </h3>

            {/* Consultation Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Consultation Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(
                  ["video_call", "voice_call", "chat", "in_person"] as const
                ).map((type) => (
                  <div
                    key={type}
                    className={cn(
                      "p-3 border rounded-lg cursor-pointer transition-colors",
                      selectedType === type
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                    )}
                    onClick={() => setSelectedType(type)}
                  >
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(type)}
                      <span className="text-sm font-medium">
                        {getTypeLabel(type)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < startOfDay(new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Selection */}
            {selectedDate && availableSlots.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Time
                </label>
                <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot.startTime}
                      variant={
                        selectedTime === slot.startTime ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedTime(slot.startTime)}
                      disabled={!slot.available}
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {slot.startTime}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                onClick={() => setStep(4)}
                disabled={!selectedDate || !selectedTime}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Symptoms & Notes */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Symptoms & Notes
            </h3>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Symptoms (optional)
              </label>
              <Input
                placeholder="Enter your symptoms..."
                value={symptoms.join(", ")}
                onChange={(e) =>
                  setSymptoms(
                    e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Additional Notes (optional)
              </label>
              <Textarea
                placeholder="Any additional information you'd like to share..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>

            {/* Booking Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Booking Summary
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>
                  <strong>Doctor:</strong> Dr. {selectedDoctor?.user.firstName}{" "}
                  {selectedDoctor?.user.lastName}
                </p>
                <p>
                  <strong>Specialty:</strong> {selectedDoctor?.specialty?.name}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {selectedDate ? format(selectedDate, "PPP") : "Not selected"}
                </p>
                <p>
                  <strong>Time:</strong> {selectedTime || "Not selected"}
                </p>
                <p>
                  <strong>Type:</strong> {getTypeLabel(selectedType)}
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button
                onClick={handleBooking}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Booking..." : "Book Appointment"}
              </Button>
            </div>
          </div>
        )}

        {/* Cancel Button */}
        <div className="flex justify-center">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentBooking;
