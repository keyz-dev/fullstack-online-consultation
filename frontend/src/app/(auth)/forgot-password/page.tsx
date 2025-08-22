"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input, Button } from "../../../components/ui";
import { useAuth } from "../../../contexts/AuthContext";

const ForgotPasswordPage = () => {
  const { forgotPassword, loading, authError, setAuthError } = useAuth();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    try {
      await forgotPassword({ email });
      setSuccess(true);
    } catch (error) {
      // Error is handled by the context
    }
  };

  if (success) {
    return (
      <div className="min-h-fit flex items-center justify-center py-8">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Check Your Email
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                We&apos;ve sent a password reset link to your email
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-fit flex items-center justify-center py-8">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Forgot Password
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Enter your email to receive a reset link
            </p>
          </div>

          {authError && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 mb-6">
              <p className="text-sm text-red-600 dark:text-red-400 text-center">
                {authError}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={email}
              onChangeHandler={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />

            <Button
              type="submit"
              additionalClasses="w-full primarybtn"
              isLoading={loading}
            >
              Send Reset Link
            </Button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium"
              >
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
