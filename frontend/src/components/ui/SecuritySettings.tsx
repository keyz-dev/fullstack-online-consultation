import React, { useState } from "react";
import { PasswordUpdateData } from "@/hooks/useProfile";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Alert,
  AlertDescription,
  Switch,
  Badge,
} from "@/components/ui";

interface SecuritySettingsProps {
  onPasswordUpdate: (data: PasswordUpdateData) => Promise<void>;
  onPreferencesUpdate: (preferences: unknown) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  user?: {
    emailVerified: boolean;
    authProvider: string;
  };
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  onPasswordUpdate,
  onPreferencesUpdate,
  loading = false,
  error = null,
  user,
}) => {
  const [passwordData, setPasswordData] = useState<PasswordUpdateData>({
    oldPassword: "",
    newPassword: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [securityPreferences, setSecurityPreferences] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: 30,
  });

  const handlePasswordChange = (
    field: keyof PasswordUpdateData,
    value: string
  ) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setPasswordError(null);
    setPasswordSuccess(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (passwordData.newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return;
    }

    try {
      await onPasswordUpdate(passwordData);
      setPasswordSuccess(true);
      setPasswordData({ oldPassword: "", newPassword: "" });
      setConfirmPassword("");
      setPasswordError(null);
    } catch (error) {
      // Error is handled by the parent component
    }
  };

  const handlePreferenceChange = async (key: string, value: unknown) => {
    const newPreferences = {
      ...securityPreferences,
      [key]: value,
    };
    setSecurityPreferences(newPreferences);

    try {
      await onPreferencesUpdate({
        security: newPreferences,
      });
    } catch (error) {
      // Revert on error
      setSecurityPreferences((prev) => ({
        ...prev,
        [key]: !value,
      }));
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: "", color: "" };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    switch (score) {
      case 0:
      case 1:
        return {
          score,
          label: "Very Weak",
          color: "text-red-600 dark:text-red-400",
        };
      case 2:
        return {
          score,
          label: "Weak",
          color: "text-orange-600 dark:text-orange-400",
        };
      case 3:
        return {
          score,
          label: "Fair",
          color: "text-yellow-600 dark:text-yellow-400",
        };
      case 4:
        return {
          score,
          label: "Good",
          color: "text-blue-600 dark:text-blue-400",
        };
      case 5:
        return {
          score,
          label: "Strong",
          color: "text-green-600 dark:text-green-400",
        };
      default:
        return { score, label: "", color: "" };
    }
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Account Security Status */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Account Security Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Verification
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.emailVerified
                  ? "Your email is verified"
                  : "Please verify your email address"}
              </p>
            </div>
            <Badge variant={user?.emailVerified ? "default" : "secondary"}>
              {user?.emailVerified ? "Verified" : "Not Verified"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Authentication Method
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.authProvider === "local"
                  ? "Email and Password"
                  : `${user?.authProvider} OAuth`}
              </p>
            </div>
            <Badge variant="outline" className="capitalize">
              {user?.authProvider}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Password Change */}
      {user?.authProvider === "local" && (
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {passwordError && (
                <Alert variant="destructive">
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}

              {passwordSuccess && (
                <Alert>
                  <AlertDescription>
                    Password updated successfully!
                  </AlertDescription>
                </Alert>
              )}

              <div>
                <Label
                  htmlFor="oldPassword"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Current Password
                </Label>
                <Input
                  id="oldPassword"
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    handlePasswordChange("oldPassword", e.target.value)
                  }
                  placeholder="Enter your current password"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label
                  htmlFor="newPassword"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    handlePasswordChange("newPassword", e.target.value)
                  }
                  placeholder="Enter your new password"
                  className="mt-1"
                  required
                />
                {passwordData.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-2 w-8 rounded ${
                              level <= passwordStrength.score
                                ? passwordStrength.color.replace("text-", "bg-")
                                : "bg-gray-200 dark:bg-gray-700"
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-sm ${passwordStrength.color}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="mt-1"
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={
                    loading ||
                    !passwordData.oldPassword ||
                    !passwordData.newPassword ||
                    !confirmPassword
                  }
                  className="px-6"
                >
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Security Preferences */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Security Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Two-Factor Authentication
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              checked={securityPreferences.twoFactorAuth}
              onCheckedChange={(checked) =>
                handlePreferenceChange("twoFactorAuth", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Login Notifications
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Get notified when someone logs into your account
              </p>
            </div>
            <Switch
              checked={securityPreferences.loginNotifications}
              onCheckedChange={(checked) =>
                handlePreferenceChange("loginNotifications", checked)
              }
            />
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Session Timeout (minutes)
            </h4>
            <div className="flex items-center space-x-4">
              <Input
                type="number"
                min="5"
                max="1440"
                value={securityPreferences.sessionTimeout}
                onChange={(e) =>
                  handlePreferenceChange(
                    "sessionTimeout",
                    parseInt(e.target.value)
                  )
                }
                className="w-24"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                After {securityPreferences.sessionTimeout} minutes of inactivity
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
            Security Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>• Use a strong, unique password for your account</li>
            <li>• Enable two-factor authentication for extra security</li>
            <li>• Never share your login credentials with anyone</li>
            <li>• Log out from shared devices</li>
            <li>• Keep your email address updated and verified</li>
            <li>• Report any suspicious activity immediately</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
