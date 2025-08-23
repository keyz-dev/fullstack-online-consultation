import { useState, useEffect, useCallback } from "react";
import { profileApi } from "@/api/profile";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role:
    | "patient"
    | "doctor"
    | "admin"
    | "pharmacy"
    | "pending_doctor"
    | "pending_pharmacy";
  avatar?: string;
  gender?: "male" | "female" | "other";
  dob?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    fullAddress?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  authProvider: "local" | "google" | "facebook" | "apple";
  isActive: boolean;
  emailVerified: boolean;
  hasPaidApplicationFee: boolean;
  createdAt: string;
  updatedAt: string;
  patient?: {
    id: string;
    bloodGroup?: string;
    allergies?: string[];
    emergencyContact?: {
      name: string;
      phoneNumber: string;
      relationship: string;
    };
    contactInfo?: Array<{
      type: string;
      value: string;
    }>;
    medicalDocuments?: string[];
    insuranceInfo?: {
      provider: string;
      policyNumber: string;
      groupNumber?: string;
    };
    preferredLanguage?: string;
  };
  doctor?: {
    id: string;
    licenseNumber: string;
    experience: number;
    bio?: string;
    education?: string[];
    languages?: string[];
    specialties?: Array<{
      id: string;
      name: string;
      icon?: string;
    }>;
    clinicAddress?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
    };
    operationalHospital?: string;
    contactInfo?: Array<{
      type: string;
      value: string;
    }>;
    consultationFee: number;
    consultationDuration: number;
    paymentMethods?: Array<{
      method: string;
      value: {
        accountNumber: string;
        accountName: string;
        bankName?: string;
        accountType?: string;
      };
    }>;
    isVerified: boolean;
    isActive: boolean;
    averageRating?: number;
    totalReviews?: number;
  };
  pharmacy?: {
    id: string;
    name: string;
    licenseNumber: string;
    description?: string;
    logo?: string;
    images?: string[];
    address: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
    };
    contactInfo?: Array<{
      type: string;
      value: string;
    }>;
    deliveryInfo?: {
      deliveryRadius?: number;
      deliveryFee?: number;
      deliveryTime?: string;
      freeDeliveryThreshold?: number;
    };
    paymentMethods?: Array<{
      method: string;
      value: {
        accountNumber: string;
        accountName: string;
        bankName?: string;
        accountType?: string;
      };
    }>;
    isVerified: boolean;
    isActive: boolean;
    averageRating?: number;
    totalReviews?: number;
  };
}

export interface UserStats {
  memberSince: string;
  lastLogin: string;
  totalUsers?: number;
  totalDoctors?: number;
  totalPharmacies?: number;
  totalPatients?: number;
  totalApplicationsReviewed?: number;
  totalConsultations?: number;
  systemUptime?: number;
  totalOrders?: number;
  totalReviews?: number;
  emailVerified: boolean;
  profileComplete: boolean;
}

export interface ProfileUpdateData {
  name?: string;
  email?: string;
  gender?: "male" | "female" | "other";
  dob?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    fullAddress?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  bio?: string;
}

export interface PasswordUpdateData {
  oldPassword: string;
  newPassword: string;
}

export interface UserPreferences {
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  privacy?: {
    profileVisibility?: "public" | "private" | "friends";
    showEmail?: boolean;
    showPhone?: boolean;
  };
  theme?: "light" | "dark" | "auto";
  language?: string;
  timezone?: string;
}

export const useProfile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await profileApi.getProfile();
      setUser(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch profile");
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user statistics
  const getUserStats = useCallback(async (): Promise<UserStats> => {
    try {
      const response = await profileApi.getUserStats();
      const stats = response.data;
      setUserStats(stats);
      return stats;
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to fetch user statistics"
      );
      console.error("Error fetching user stats:", err);
      throw err;
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (profileData: ProfileUpdateData) => {
    try {
      setUpdating(true);
      setError(null);
      const response = await profileApi.updateProfile(profileData);
      setUser(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
      console.error("Error updating profile:", err);
      throw err;
    } finally {
      setUpdating(false);
    }
  }, []);

  // Update password
  const updatePassword = useCallback(
    async (passwordData: PasswordUpdateData) => {
      try {
        setUpdating(true);
        setError(null);
        const response = await profileApi.updatePassword(passwordData);
        return response.data;
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to update password");
        console.error("Error updating password:", err);
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    []
  );

  // Update avatar
  const updateAvatar = useCallback(
    async (avatarFile: File) => {
      try {
        setUpdating(true);
        setError(null);
        const response = await profileApi.updateAvatar(avatarFile);
        if (user) {
          setUser({ ...user, avatar: response.data.avatar });
        }
        return response.data;
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to update avatar");
        console.error("Error updating avatar:", err);
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    [user]
  );

  // Delete avatar
  const deleteAvatar = useCallback(async () => {
    try {
      setUpdating(true);
      setError(null);
      const response = await profileApi.deleteAvatar();
      if (user) {
        setUser({ ...user, avatar: undefined });
      }
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete avatar");
      console.error("Error deleting avatar:", err);
      throw err;
    } finally {
      setUpdating(false);
    }
  }, [user]);

  // Update preferences
  const updatePreferences = useCallback(
    async (preferences: UserPreferences) => {
      try {
        setUpdating(true);
        setError(null);
        const response = await profileApi.updatePreferences(preferences);
        return response.data;
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to update preferences");
        console.error("Error updating preferences:", err);
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    []
  );

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    user,
    userStats,
    loading,
    error,
    updating,
    fetchProfile,
    getUserStats,
    updateProfile,
    updatePassword,
    updateAvatar,
    deleteAvatar,
    updatePreferences,
    clearError,
  };
};
