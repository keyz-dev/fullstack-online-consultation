"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Logo } from "../../../components/ui";
import { useAuth } from "../../../contexts/AuthContext";
import { CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

const CODE_LENGTH = 6;
const REDIRECT_DELAY = 1200; // 1.2 seconds delay

const VerifyAccountPage = () => {
  const { verifyEmail, loading, authError, setAuthError, redirectBasedOnRole } =
    useAuth();
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const [email, setEmail] = useState("");
  const [from, setFrom] = useState("");
  const [isLoadingEmail, setIsLoadingEmail] = useState(true);
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null); // null: default, true: valid, false: invalid
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const fromParam = searchParams.get("from");

    if (emailParam) {
      setEmail(emailParam);
      setFrom(fromParam || "");
    } else {
      router.push("/login");
    }
    setIsLoadingEmail(false);
  }, [searchParams, router]);

  // Redirect if no email is found
  useEffect(() => {
    if (!email && !isLoadingEmail) {
      router.push("/login");
    }
  }, [email, isLoadingEmail, router]);

  if (!email) {
    return null;
  }

  // Check if all code entries are filled
  const isCodeComplete = code.every((digit) => digit !== "");

  // Handle input change for each code box
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (!val) return;
    const newCode = [...code];
    newCode[idx] = val[0];
    setCode(newCode);
    setIsValid(null); // Reset validation state on new input
    // Move to next input
    if (idx < CODE_LENGTH - 1 && val) {
      const nextInput = document.getElementById(
        `code-input-${idx + 1}`
      ) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, CODE_LENGTH);
    if (pastedData.length === 0) return;

    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);
    setIsValid(null); // Reset validation state on paste

    // Focus the next empty input or the last input
    const nextEmptyIndex = newCode.findIndex((digit) => !digit);
    const focusIndex = nextEmptyIndex === -1 ? CODE_LENGTH - 1 : nextEmptyIndex;
    const focusInput = document.getElementById(
      `code-input-${focusIndex}`
    ) as HTMLInputElement;
    if (focusInput) focusInput.focus();
  };

  // Handle backspace to move to previous input
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      const prevInput = document.getElementById(
        `code-input-${idx - 1}`
      ) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  };

  // Submit code
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAuthError("");
    try {
      const codeStr = code.join("");
      const res = await verifyEmail({ email, code: codeStr });

      if (res.success) {
        setIsValid(true);
        setShowSuccess(true);

        console.log("This is res: ", res);

        // Delay redirection to show success state
        setTimeout(() => {
          redirectBasedOnRole(res.user);
        }, REDIRECT_DELAY);
      } else {
        setIsValid(false);
        setError("Verification failed");
      }
    } catch (err: unknown) {
      setIsValid(false);
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Verification failed. Please try again."
      );
    }
  };

  // Resend code
  const handleResend = async () => {
    setError("");
    setIsValid(null);
    try {
      // TODO: Implement resendVerification in AuthContext
      toast.success("A new code has been sent to your email.");
    } catch {
      toast.error("Failed to resend code. Please try again later.");
    }
  };

  // Get input styling based on validation state
  const getInputStyle = () => {
    if (isValid === null) {
      return "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500";
    }
    return isValid
      ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
      : "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300";
  };

  if (isLoadingEmail) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center bg-white dark:bg-gray-900">
        <div className="max-w-md w-full p-8 flex flex-col items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-white dark:bg-gray-900">
      <div className="max-w-md w-full p-8 flex flex-col items-center">
        {/* Logo */}
        <div className="mb-4">
          <Logo />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-2 text-gray-900 dark:text-white">
          Verify Your Account
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
          Enter the code sent to{" "}
          <span className="font-medium text-gray-900 dark:text-white">
            {email.replace(/(.{2}).+(@.+)/, "$1*****$2")}
          </span>
        </p>
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center"
        >
          <div className="flex gap-3 mb-4">
            {code.map((digit, idx) => (
              <input
                key={idx}
                id={`code-input-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className={`w-12 h-12 text-2xl text-center border-2 rounded-sm focus:outline-none transition-all duration-200 ${getInputStyle()}`}
                value={digit}
                onChange={(e) => handleChange(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onPaste={handlePaste}
                autoFocus={idx === 0}
                disabled={showSuccess}
              />
            ))}
          </div>
          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm mb-2">
              {error}
            </p>
          )}
          {showSuccess && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2 animate-fade-in">
              <CheckCircle2 className="w-5 h-5" />
              <span>Verification successful! Redirecting...</span>
            </div>
          )}
          <div className="mb-6 text-center text-gray-500 dark:text-gray-400 text-sm">
            Didn&apos;t receive the email?{" "}
            <button
              type="button"
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
              onClick={handleResend}
              disabled={loading || showSuccess}
            >
              Click to resend
            </button>
          </div>
          <div className="flex w-full gap-5 justify-center">
            <Button
              type="button"
              additionalClasses="w-32 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClickHandler={() => router.back()}
              isDisabled={loading || showSuccess}
            >
              Back
            </Button>
            <Button
              type="submit"
              additionalClasses={`w-32 ${
                isCodeComplete
                  ? "primarybtn"
                  : "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
              }`}
              isLoading={loading}
              isDisabled={loading || showSuccess || !isCodeComplete}
            >
              Verify
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyAccountPage;
