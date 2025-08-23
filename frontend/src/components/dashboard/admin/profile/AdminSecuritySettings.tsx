import React, { useState } from "react";
import { Button, Input } from "@/components/ui";
import {
  Lock,
  Eye,
  EyeOff,
  Shield,
  Smartphone,
  Key,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Monitor,
} from "lucide-react";

const AdminSecuritySettings: React.FC = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock data for demonstration
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginHistory] = useState([
    {
      id: 1,
      date: "2024-01-15T10:30:00.000Z",
      ip: "192.168.1.100",
      location: "New York, NY",
      device: "Chrome on Windows",
      status: "success",
    },
    {
      id: 2,
      date: "2024-01-14T15:45:00.000Z",
      ip: "192.168.1.100",
      location: "New York, NY",
      device: "Chrome on Windows",
      status: "success",
    },
    {
      id: 3,
      date: "2024-01-13T09:20:00.000Z",
      ip: "203.0.113.45",
      location: "Unknown",
      device: "Mobile Safari",
      status: "failed",
    },
  ]);

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      console.log("Changing password:", passwordData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      alert("Password changed successfully!");
    } catch (error) {
      console.error("Failed to change password:", error);
      alert("Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorToggle = async () => {
    try {
      // TODO: Replace with actual API call
      setTwoFactorEnabled(!twoFactorEnabled);
      alert(
        twoFactorEnabled
          ? "Two-factor authentication disabled"
          : "Two-factor authentication enabled"
      );
    } catch (error) {
      console.error("Failed to toggle 2FA:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="p-3 md:p-6 space-y-6">
      {/* Password Change */}
      <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Lock size={20} />
          Change Password
        </h3>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="relative">
            <Input
              label="Current Password"
              type={showPasswords.current ? "text" : "password"}
              value={passwordData.currentPassword}
              onChangeHandler={(e) =>
                handlePasswordChange("currentPassword", e.target.value)
              }
              error={errors.currentPassword}
              required
              icon={<Key size={16} />}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("current")}
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="relative">
            <Input
              label="New Password"
              type={showPasswords.new ? "text" : "password"}
              value={passwordData.newPassword}
              onChangeHandler={(e) =>
                handlePasswordChange("newPassword", e.target.value)
              }
              error={errors.newPassword}
              required
              icon={<Lock size={16} />}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("new")}
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="relative">
            <Input
              label="Confirm New Password"
              type={showPasswords.confirm ? "text" : "password"}
              value={passwordData.confirmPassword}
              onChangeHandler={(e) =>
                handlePasswordChange("confirmPassword", e.target.value)
              }
              error={errors.confirmPassword}
              required
              icon={<Lock size={16} />}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              text={loading ? "Changing..." : "Change Password"}
              isDisabled={loading}
            />
          </div>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Smartphone size={20} />
          Two-Factor Authentication
        </h3>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                twoFactorEnabled ? "bg-green-500" : "bg-gray-400"
              }`}
            ></div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {twoFactorEnabled ? "Enabled" : "Disabled"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {twoFactorEnabled
                  ? "Your account is protected with 2FA"
                  : "Add an extra layer of security to your account"}
              </p>
            </div>
          </div>

          <Button
            variant={twoFactorEnabled ? "outline" : "primary"}
            onClick={handleTwoFactorToggle}
            text={twoFactorEnabled ? "Disable" : "Enable"}
          />
        </div>

        {twoFactorEnabled && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <p className="text-sm text-green-700 dark:text-green-300">
                Two-factor authentication is active. Your account is now more
                secure.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Login History */}
      <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Clock size={20} />
          Recent Login Activity
        </h3>

        <div className="space-y-3">
          {loginHistory.map((login) => (
            <div
              key={login.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    login.status === "success" ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {login.device}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {formatDate(login.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {login.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Monitor size={12} />
                      {login.ip}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {login.status === "success" ? (
                  <CheckCircle size={16} className="text-green-500" />
                ) : (
                  <AlertTriangle size={16} className="text-red-500" />
                )}
                <span
                  className={`text-xs font-medium ${
                    login.status === "success"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {login.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <Button
            variant="outline"
            text="View All Activity"
            onClick={() => alert("View all activity feature coming soon!")}
          />
        </div>
      </div>

      {/* Security Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Shield size={20} />
          Security Recommendations
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
            <Shield size={16} className="text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Enable Two-Factor Authentication
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Add an extra layer of security to protect your admin account.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <AlertTriangle size={16} className="text-yellow-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                Use Strong Passwords
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                Ensure your password is at least 8 characters long with a mix of
                letters, numbers, and symbols.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
            <CheckCircle size={16} className="text-green-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                Monitor Login Activity
              </p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                Regularly check your login history for any suspicious activity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSecuritySettings;
