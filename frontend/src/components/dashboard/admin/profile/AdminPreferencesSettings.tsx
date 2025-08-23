import React, { useState } from "react";
import { Button } from "@/components/ui";
import {
  Bell,
  Mail,
  Settings,
  Moon,
  Sun,
  Globe,
  Eye,
  Shield,
  Users,
  FileText,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";

const AdminPreferencesSettings: React.FC = () => {
  const [preferences, setPreferences] = useState({
    notifications: {
      email: {
        newApplications: true,
        systemAlerts: true,
        weeklyReports: false,
        securityAlerts: true,
      },
      push: {
        newApplications: true,
        systemAlerts: true,
        securityAlerts: true,
      },
      inApp: {
        newApplications: true,
        systemAlerts: true,
        userReports: true,
        securityAlerts: true,
      },
    },
    display: {
      theme: "system", // system, light, dark
      language: "en",
      timezone: "UTC",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",
    },
    system: {
      autoLogout: 30, // minutes
      sessionTimeout: 60, // minutes
      showSensitiveData: false,
      enableAuditLog: true,
      enableBackup: true,
    },
  });

  const [loading, setLoading] = useState(false);

  const handleNotificationChange = (
    category: string,
    type: string,
    value: boolean
  ) => {
    setPreferences((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [category]: {
          ...prev.notifications[category as keyof typeof prev.notifications],
          [type]: value,
        },
      },
    }));
  };

  const handleDisplayChange = (setting: string, value: string) => {
    setPreferences((prev) => ({
      ...prev,
      display: {
        ...prev.display,
        [setting]: value,
      },
    }));
  };

  const handleSystemChange = (setting: string, value: number | boolean) => {
    setPreferences((prev) => ({
      ...prev,
      system: {
        ...prev.system,
        [setting]: value,
      },
    }));
  };

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      console.log("Saving preferences:", preferences);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Preferences saved successfully!");
    } catch (error) {
      console.error("Failed to save preferences:", error);
      alert("Failed to save preferences. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPreferences = () => {
    if (confirm("Are you sure you want to reset all preferences to default?")) {
      setPreferences({
        notifications: {
          email: {
            newApplications: true,
            systemAlerts: true,
            weeklyReports: false,
            securityAlerts: true,
          },
          push: {
            newApplications: true,
            systemAlerts: true,
            securityAlerts: true,
          },
          inApp: {
            newApplications: true,
            systemAlerts: true,
            userReports: true,
            securityAlerts: true,
          },
        },
        display: {
          theme: "system",
          language: "en",
          timezone: "UTC",
          dateFormat: "MM/DD/YYYY",
          timeFormat: "12h",
        },
        system: {
          autoLogout: 30,
          sessionTimeout: 60,
          showSensitiveData: false,
          enableAuditLog: true,
          enableBackup: true,
        },
      });
    }
  };

  return (
    <div className="p-3 md:p-6 space-y-6">
      {/* Notification Preferences */}
      <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Bell size={20} />
          Notification Preferences
        </h3>

        <div className="space-y-6">
          {/* Email Notifications */}
          <div>
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Mail size={16} />
              Email Notifications
            </h4>
            <div className="space-y-3">
              {Object.entries(preferences.notifications.email).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Receive email notifications for{" "}
                        {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          handleNotificationChange(
                            "email",
                            key,
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Push Notifications */}
          <div>
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Bell size={16} />
              Push Notifications
            </h4>
            <div className="space-y-3">
              {Object.entries(preferences.notifications.push).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Receive push notifications for{" "}
                        {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          handleNotificationChange(
                            "push",
                            key,
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Display Preferences */}
      <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Eye size={20} />
          Display Preferences
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Theme
            </label>
            <select
              value={preferences.display.theme}
              onChange={(e) => handleDisplayChange("theme", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language
            </label>
            <select
              value={preferences.display.language}
              onChange={(e) => handleDisplayChange("language", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Timezone
            </label>
            <select
              value={preferences.display.timezone}
              onChange={(e) => handleDisplayChange("timezone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="UTC">UTC</option>
              <option value="EST">Eastern Time</option>
              <option value="PST">Pacific Time</option>
              <option value="GMT">GMT</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date Format
            </label>
            <select
              value={preferences.display.dateFormat}
              onChange={(e) =>
                handleDisplayChange("dateFormat", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>

      {/* System Preferences */}
      <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Settings size={20} />
          System Preferences
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Show Sensitive Data
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Display sensitive information in admin panels
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.system.showSensitiveData}
                onChange={(e) =>
                  handleSystemChange("showSensitiveData", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Enable Audit Log
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Log all administrative actions for security
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.system.enableAuditLog}
                onChange={(e) =>
                  handleSystemChange("enableAuditLog", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Auto Backup
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Automatically backup system data
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.system.enableBackup}
                onChange={(e) =>
                  handleSystemChange("enableBackup", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Auto Logout (minutes)
            </label>
            <input
              type="number"
              min="5"
              max="480"
              value={preferences.system.autoLogout}
              onChange={(e) =>
                handleSystemChange("autoLogout", parseInt(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleResetPreferences}
          text="Reset to Default"
        />

        <Button
          variant="primary"
          onClick={handleSavePreferences}
          loading={loading}
          text={loading ? "Saving..." : "Save Preferences"}
          isDisabled={loading}
        />
      </div>
    </div>
  );
};

export default AdminPreferencesSettings;
