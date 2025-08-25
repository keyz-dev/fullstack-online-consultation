import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui";

interface GoogleSignupButtonProps {
  role:
    | "doctor"
    | "pharmacy"
    | "patient"
    | "admin"
    | "incomplete_doctor"
    | "incomplete_pharmacy";
  buttonText?: string;
  className?: string;
  fullWidth?: boolean;
}

const GoogleSignupButton: React.FC<GoogleSignupButtonProps> = ({
  role,
  buttonText = "Continue with Google",
  className = "",
  fullWidth = false,
}) => {
  const { handleGoogleSignUp } = useAuth();

  // Get the Google signup handler for the specific role
  const googleSignupHandler = handleGoogleSignUp(role);

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <Button
      type="button"
      onClickHandler={googleSignupHandler}
      additionalClasses={`${widthClass} flex items-center justify-center border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${className}`}
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google"
        className="w-5 h-5 mr-2"
      />
      {buttonText}
    </Button>
  );
};

export default GoogleSignupButton;
