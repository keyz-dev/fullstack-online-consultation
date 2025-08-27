import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

export interface BookingIntent {
  type: "global" | "doctor" | "symptom" | "specialty";
  doctorId?: string;
  symptomId?: string;
  specialtyId?: string;
  timeSlotId?: string;
  consultationType?: "online" | "physical";
  symptomIds?: number[];
  notes?: string;
  timestamp: number;
}

export interface UseBookingIntentReturn {
  setBookingIntent: (intent: Omit<BookingIntent, "timestamp">) => void;
  getBookingIntent: () => BookingIntent | null;
  clearBookingIntent: () => void;
  redirectToBooking: () => void;
  hasBookingIntent: () => boolean;
}

export const useBookingIntent = (): UseBookingIntentReturn => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // Set booking intent in sessionStorage
  const setBookingIntent = useCallback(
    (intent: Omit<BookingIntent, "timestamp">) => {
      const bookingIntent: BookingIntent = {
        ...intent,
        timestamp: Date.now(),
      };

      sessionStorage.setItem("bookingIntent", JSON.stringify(bookingIntent));
      console.log("📝 Booking intent set:", bookingIntent);
    },
    []
  );

  // Get booking intent from sessionStorage
  const getBookingIntent = useCallback((): BookingIntent | null => {
    try {
      const stored = sessionStorage.getItem("bookingIntent");
      if (!stored) return null;

      const intent: BookingIntent = JSON.parse(stored);

      // Check if intent is still valid (not older than 1 hour)
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      if (intent.timestamp < oneHourAgo) {
        sessionStorage.removeItem("bookingIntent");
        return null;
      }

      return intent;
    } catch (error) {
      console.error("Error parsing booking intent:", error);
      sessionStorage.removeItem("bookingIntent");
      return null;
    }
  }, []);

  // Clear booking intent
  const clearBookingIntent = useCallback(() => {
    sessionStorage.removeItem("bookingIntent");
    console.log("🗑️ Booking intent cleared");
  }, []);

  // Check if user has booking intent
  const hasBookingIntent = useCallback((): boolean => {
    return getBookingIntent() !== null;
  }, [getBookingIntent]);

  // Redirect to booking page with intent
  const redirectToBooking = useCallback(() => {
    const intent = getBookingIntent();
    if (!intent) {
      console.log("No booking intent found");
      return;
    }

    // Build query parameters based on intent type
    const params = new URLSearchParams();

    if (intent.doctorId) params.append("doctorId", intent.doctorId);
    if (intent.symptomId) params.append("symptomId", intent.symptomId);
    if (intent.specialtyId) params.append("specialtyId", intent.specialtyId);
    if (intent.timeSlotId) params.append("timeSlotId", intent.timeSlotId);
    if (intent.consultationType)
      params.append("consultationType", intent.consultationType);
    if (intent.symptomIds?.length)
      params.append("symptomIds", intent.symptomIds.join(","));
    if (intent.notes) params.append("notes", intent.notes);

    const queryString = params.toString();
    const bookingUrl = `/booking${queryString ? `?${queryString}` : ""}`;

    console.log("🔄 Redirecting to booking:", bookingUrl);
    router.push(bookingUrl);
  }, [getBookingIntent, router]);

  // Auto-redirect if user is authenticated and has booking intent
  useEffect(() => {
    if (isAuthenticated && user && hasBookingIntent()) {
      console.log("✅ User authenticated with booking intent, redirecting...");
      redirectToBooking();
    }
  }, [isAuthenticated, user, hasBookingIntent, redirectToBooking]);

  return {
    setBookingIntent,
    getBookingIntent,
    clearBookingIntent,
    redirectToBooking,
    hasBookingIntent,
  };
};
