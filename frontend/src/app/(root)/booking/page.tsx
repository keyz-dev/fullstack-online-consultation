"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { BookingProvider, useBooking } from "@/contexts/BookingContext";
import { SymptomProvider } from "@/contexts/SymptomContext";
import { BaseSpecialtyProvider } from "@/contexts/BaseSpecialtyContext";
import { DoctorProvider } from "@/contexts/DoctorContext";
import { useAuth } from "@/contexts/AuthContext";
import { useBookingIntent } from "@/hooks/useBookingIntent";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import BookingProgress from "@/components/booking/BookingProgress";
import SymptomSelector from "@/components/booking/SymptomSelector";
import DoctorSelector from "@/components/booking/DoctorSelector";
import TimeSlotSelector from "@/components/booking/TimeSlotSelector";
import DetailsEntry from "@/components/booking/DetailsEntry";
import ConsultationTypeSelector from "@/components/booking/ConsultationTypeSelector";
import PaymentForm from "@/components/booking/PaymentForm";
import Loader from "@/components/ui/Loader";
import { Button } from "@/components/ui";

// Main booking page component
const BookingPageContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { state, dispatch, nextStep, prevStep, canProceedToNextStep } =
    useBooking();
  const { getBookingIntent, clearBookingIntent } = useBookingIntent();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Check authentication
  useEffect(() => {
    // Wait for auth loading to complete
    if (authLoading) return;

    if (!user) {
      toast.error("Please log in to book an appointment");
      router.push("/login");
      return;
    }

    if (user?.role !== "patient") {
      toast.error("Only patients can book appointments");
      router.push("/");
      return;
    }
  }, [user, authLoading, router]);

  // Initialize from URL parameters or booking intent
  useEffect(() => {
    if (!user || user?.role !== "patient") return;

    const intent = getBookingIntent();
    const doctorId = searchParams.get("doctorId");
    const symptomId = searchParams.get("symptomId");
    const specialtyId = searchParams.get("specialtyId");
    const timeSlotId = searchParams.get("timeSlotId");
    const consultationType = searchParams.get("consultationType") as
      | "online"
      | "physical"
      | null;
    const symptomIds =
      searchParams.get("symptomIds")?.split(",").map(Number) || [];
    const notes = searchParams.get("notes") || "";

    // Initialize booking state from intent or URL params
    const initialData: Record<string, unknown> = {};

    if (intent) {
      // Use booking intent data
      if (intent.doctorId) initialData.doctorId = intent.doctorId;
      if (intent.symptomId) initialData.symptomId = intent.symptomId;
      if (intent.specialtyId) initialData.specialtyId = intent.specialtyId;
      if (intent.timeSlotId) initialData.timeSlotId = intent.timeSlotId;
      if (intent.consultationType)
        initialData.consultationType = intent.consultationType;
      if (intent.symptomIds?.length) initialData.symptomIds = intent.symptomIds;
      if (intent.notes) initialData.notes = intent.notes;
    } else {
      // Use URL parameters
      if (doctorId) initialData.doctorId = doctorId;
      if (symptomId) initialData.symptomId = symptomId;
      if (specialtyId) initialData.specialtyId = specialtyId;
      if (timeSlotId) initialData.timeSlotId = timeSlotId;
      if (consultationType) initialData.consultationType = consultationType;
      if (symptomIds.length) initialData.symptomIds = symptomIds;
      if (notes) initialData.notes = notes;
    }

    if (Object.keys(initialData).length > 0) {
      // Only initialize if we don't have any existing data or if we're starting fresh
      const hasExistingData =
        state.doctorId || state.specialtyId || state.symptomIds.length > 0;

      if (!hasExistingData) {
        dispatch({ type: "INITIALIZE_FROM_INTENT", payload: initialData });
        // Clear the booking intent after using it
        clearBookingIntent();
      }
    }
  }, [
    user,
    searchParams,
    getBookingIntent,
    clearBookingIntent,
    dispatch,
    state.doctorId,
    state.specialtyId,
    state.symptomIds.length,
  ]);

  // Handle step navigation
  const handleNext = () => {
    if (canProceedToNextStep()) {
      // Mark current step as completed
      dispatch({
        type: "SET_STEP_COMPLETED",
        payload: { stepIndex: state.currentStep, completed: true },
      });
      nextStep();
    } else {
      toast.error("Please complete the current step before proceeding");
    }
  };

  const handlePrevious = () => {
    prevStep();
  };

  // Render current step component
  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 0:
        return <SymptomSelector />;
      case 1:
        return <DoctorSelector />;
      case 2:
        return <TimeSlotSelector />;
      case 3:
        return <DetailsEntry />;
      case 4:
        return <ConsultationTypeSelector />;
      case 5:
        return <PaymentForm />;
      default:
        return <div>Invalid step</div>;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!user || user?.role !== "patient") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-4xl mx-auto">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Book Appointment
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Follow the steps below to schedule your consultation
          </p>
        </div>

        {/* Progress Bar */}
        <BookingProgress />

        {/* Step Content */}
        <div className="mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            {renderCurrentStep()}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <Button
            onClickHandler={handlePrevious}
            isDisabled={state.currentStep === 0}
            additionalClasses="outlinebtn"
          >
            Previous
          </Button>

          {state.currentStep < state.steps.length - 1 && (
            <Button
              onClickHandler={handleNext}
              isDisabled={!canProceedToNextStep()}
              additionalClasses="secondarybtn"
            >
              Next
            </Button>
          )}
        </div>

        {/* Error Display */}
        {state.error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{state.error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Wrapper component with providers
const BookingPage: React.FC = () => {
  return (
    <SymptomProvider>
      <BaseSpecialtyProvider>
        <DoctorProvider>
          <BookingProvider>
            <BookingPageContent />
          </BookingProvider>
        </DoctorProvider>
      </BaseSpecialtyProvider>
    </SymptomProvider>
  );
};

export default BookingPage;
