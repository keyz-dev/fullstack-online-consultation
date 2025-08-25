"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  authAPI,
  User,
  AdminRegisterRequest,
  PatientRegisterRequest,
  DoctorRegisterRequest,
  PharmacyRegisterRequest,
  InitiateRegistrationRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from "../api";
import { useGoogleLogin } from "@react-oauth/google";
import { extractErrorMessage } from "../utils/extractError";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authError: string | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; user: User }>;
  registerAdmin: (
    userData: AdminRegisterRequest
  ) => Promise<{ success: boolean; user: User }>;
  registerPatient: (
    userData: PatientRegisterRequest
  ) => Promise<{ success: boolean; user: User }>;
  registerDoctor: (
    userData: DoctorRegisterRequest
  ) => Promise<{ success: boolean; user: User }>;
  registerPharmacy: (
    userData: PharmacyRegisterRequest
  ) => Promise<{ success: boolean; user: User }>;
  initiateRegistration: (
    userData: InitiateRegistrationRequest,
    role: "doctor" | "pharmacy"
  ) => Promise<{ success: boolean; user: User }>;
  handleGoogleLogin: () => void;
  handleGoogleSignUp: (
    role:
      | "doctor"
      | "pharmacy"
      | "patient"
      | "admin"
      | "incomplete_doctor"
      | "incomplete_pharmacy"
  ) => () => void;
  forgotPassword: (
    emailData: ForgotPasswordRequest
  ) => Promise<{ success: boolean; message: string }>;
  resetPassword: (
    resetData: ResetPasswordRequest
  ) => Promise<{ success: boolean; message: string }>;
  verifyEmail: (
    verifyData: VerifyEmailRequest
  ) => Promise<{ success: boolean; message: string; user: User }>;
  logout: () => void;
  setAuthError: (error: string | null) => void;
  clearError: () => void;
  setUserAndToken: (user: User, token: string) => void;
  invalidateToken: () => void;
  redirectBasedOnRole: (user: User) => void;
  updateUser: (user: User) => void;
  verifyToken: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  // Helper methods
  const invalidateToken = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
    }
    setUser(null);
    setToken(null);
  };

  const setUserAndToken = (userData: User, userToken: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", userToken);
      localStorage.setItem("userData", JSON.stringify(userData));
    }
    setUser(userData);
    setToken(userToken);
  };

  const redirectBasedOnRole = (userData: User) => {
    // Check for registration context first (for new registrations)
    const context = sessionStorage.getItem("registrationContext");
    if (context) {
      const { type, returnUrl, returnStep, visitedSteps } = JSON.parse(context);
      if (type === "doctor" && userData.role === "incomplete_doctor") {
        // Clear the context
        sessionStorage.removeItem("registrationContext");

        // Redirect back to application with step context
        router.push(
          `${returnUrl}?step=${returnStep}&visited=${visitedSteps.join(",")}`
        );
        return;
      }
      if (type === "pharmacy" && userData.role === "incomplete_pharmacy") {
        // Clear the context
        sessionStorage.removeItem("registrationContext");

        // Redirect back to application with step context
        router.push(
          `${returnUrl}?step=${returnStep}&visited=${visitedSteps.join(",")}`
        );
        return;
      }
    }

    // Regular login redirection
    switch (userData.role) {
      // Dashboard users
      case "admin":
        router.push("/admin");
        break;
      case "doctor":
        router.push("/doctor");
        break;
      case "patient":
        router.push("/patient");
        break;
      case "pharmacy":
        router.push("/pharmacy");
        break;

      // Application tracking users
      case "pending_doctor":
        router.push("/doctor/application-status");
        break;
      case "pending_pharmacy":
        router.push("/pharmacy/application-status");
        break;

      // Application form users
      case "incomplete_doctor":
        // Set visited steps for returning users
        sessionStorage.setItem(
          "registrationContext",
          JSON.stringify({
            type: "doctor",
            returnUrl: "/register/doctor",
            returnStep: 3, // Step 3 (Professional Info)
            visitedSteps: [1, 2], // Mark steps 1 & 2 as visited
          })
        );
        router.push("/register/doctor?step=3&visited=1,2");
        break;
      case "incomplete_pharmacy":
        // Set visited steps for returning users
        sessionStorage.setItem(
          "registrationContext",
          JSON.stringify({
            type: "pharmacy",
            returnUrl: "/register/pharmacy",
            returnStep: 3, // Step 3 (Professional Info)
            visitedSteps: [1, 2], // Mark steps 1 & 2 as visited
          })
        );
        router.push("/register/pharmacy?step=3&visited=1,2");
        break;

      default:
        router.push("/");
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("userData", JSON.stringify(updatedUser));
    }
  };

  // Check for existing token on mount
  useEffect(() => {
    const token = authAPI.getToken();
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const data = await authAPI.verifyToken(token);
      if (data.status === "success") {
        setUserAndToken(data.data.user, token);
      } else {
        invalidateToken();
      }
    } catch (error) {
      invalidateToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setAuthError(null);

    try {
      const data = await authAPI.login({ email, password });

      if (data.status === "success") {
        return { success: true, user: data.data.user };
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      setAuthError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerAdmin = async (userData: AdminRegisterRequest) => {
    setLoading(true);
    setAuthError(null);

    try {
      const data = await authAPI.registerAdmin(userData);
      return { success: true, user: data.data.user };
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      setAuthError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerPatient = async (userData: PatientRegisterRequest) => {
    setLoading(true);
    setAuthError(null);

    try {
      const data = await authAPI.registerPatient(userData);
      return { success: true, user: data.data.user };
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      setAuthError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerDoctor = async (userData: DoctorRegisterRequest) => {
    setLoading(true);
    setAuthError(null);

    try {
      const data = await authAPI.registerDoctor(userData);
      return { success: true, user: data.data.user };
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      setAuthError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerPharmacy = async (userData: PharmacyRegisterRequest) => {
    setLoading(true);
    setAuthError(null);

    try {
      const data = await authAPI.registerPharmacy(userData);
      return { success: true, user: data.data.user };
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      setAuthError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const initiateRegistration = async (
    userData: InitiateRegistrationRequest,
    role: "doctor" | "pharmacy"
  ) => {
    setLoading(true);
    setAuthError(null);

    try {
      const data = await authAPI.initiateRegistration(userData, role);
      return { success: true, user: data.data.user };
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      setAuthError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    scope: "profile email openid",
    onSuccess: async (tokenResponse) => {
      const { access_token } = tokenResponse;
      if (access_token) {
        try {
          const response = await authAPI.googleLogin({ access_token });
          if (response.data) {
            const { user, token } = response.data;
            setUserAndToken(user, token || "");
            setAuthError(null);
            redirectBasedOnRole(user);
          }
        } catch (error: unknown) {
          const errorMessage = extractErrorMessage(error as any);
          setAuthError(
            (error as any)?.response?.data?.message ||
              errorMessage ||
              "Google login failed. Please try again."
          );
        }
      }
    },
    onError: (error: unknown) => {
      const errorMessage = extractErrorMessage(error as any);
      setAuthError(
        (error as any)?.message ||
          errorMessage ||
          "Google login failed. Please try again."
      );
    },
  });

  /**
   * Returns a Google sign up handler for the specified role.
   * Usage: handleGoogleSignUp("doctor")();
   */
  const handleGoogleSignUp = (
    role:
      | "doctor"
      | "pharmacy"
      | "patient"
      | "admin"
      | "incomplete_doctor"
      | "incomplete_pharmacy"
  ) =>
    useGoogleLogin({
      scope: "profile email openid",
      onSuccess: async (tokenResponse) => {
        const { access_token } = tokenResponse;
        if (access_token) {
          try {
            const response = await authAPI.googleSignUp({
              access_token,
              role,
            });
            if (response.data) {
              const { user, token } = response.data;
              setUserAndToken(user, token || "");
              setAuthError(null);
              redirectBasedOnRole(user);
            }
          } catch (error: unknown) {
            // Use extractErrorMessage for consistency
            const errorMessage = extractErrorMessage(error);
            setAuthError(
              (error as any)?.response?.data?.message ||
                errorMessage ||
                "Google sign up failed. Please try again."
            );
          }
        }
      },
      onError: (error: unknown) => {
        // Use extractErrorMessage for consistency
        const errorMessage = extractErrorMessage(error);
        setAuthError(
          (error as any)?.message ||
            errorMessage ||
            "Google sign up failed. Please try again."
        );
      },
    });

  const forgotPassword = async (emailData: ForgotPasswordRequest) => {
    setLoading(true);
    setAuthError(null);

    try {
      const data = await authAPI.forgotPassword(emailData);
      return { success: true, message: data.message };
    } catch (error: any) {
      setAuthError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (resetData: ResetPasswordRequest) => {
    setLoading(true);
    setAuthError(null);

    try {
      const data = await authAPI.resetPassword(resetData);
      return { success: true, message: data.message };
    } catch (error: any) {
      setAuthError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (verifyData: VerifyEmailRequest) => {
    setLoading(true);
    setAuthError(null);

    try {
      const data = await authAPI.verifyEmail(verifyData);
      setUserAndToken(data.data.user, data.data.token);

      return { success: true, message: data.message, user: data.data.user };
    } catch (error: any) {
      setAuthError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    invalidateToken();
    router.push("/login");
  };

  const clearError = () => {
    setAuthError(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    authError,
    login,
    registerAdmin,
    registerPatient,
    registerDoctor,
    registerPharmacy,
    initiateRegistration,
    handleGoogleLogin,
    handleGoogleSignUp,
    forgotPassword,
    resetPassword,
    verifyEmail,
    logout,
    setAuthError,
    clearError,
    setUserAndToken,
    invalidateToken,
    redirectBasedOnRole,
    updateUser,
    verifyToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
