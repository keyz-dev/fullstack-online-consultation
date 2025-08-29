"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Mail,
  MessageSquare,
  Phone,
  Clock,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface NotificationSettings {
  email: {
    dayBefore: boolean;
    twoHours: boolean;
    thirtyMinutes: boolean;
    appointmentUpdates: boolean;
  };
  sms: {
    dayBefore: boolean;
    twoHours: boolean;
    thirtyMinutes: boolean;
    appointmentUpdates: boolean;
  };
  push: {
    dayBefore: boolean;
    twoHours: boolean;
    thirtyMinutes: boolean;
    appointmentUpdates: boolean;
  };
  general: {
    marketingEmails: boolean;
    systemAnnouncements: boolean;
    appointmentReminders: boolean;
  };
}

const NotificationPreferences: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      dayBefore: true,
      twoHours: true,
      thirtyMinutes: false,
      appointmentUpdates: true,
    },
    sms: {
      dayBefore: true,
      twoHours: false,
      thirtyMinutes: true,
      appointmentUpdates: true,
    },
    push: {
      dayBefore: true,
      twoHours: true,
      thirtyMinutes: true,
      appointmentUpdates: true,
    },
    general: {
      marketingEmails: false,
      systemAnnouncements: true,
      appointmentReminders: true,
    },
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleToggle = (
    category: keyof NotificationSettings,
    setting: string,
    value: boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: API call to save notification preferences
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save notification preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  const NotificationToggle = ({
    label,
    description,
    checked,
    onChange,
    icon: Icon,
  }: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    icon: React.ElementType;
  }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <div className="flex items-center space-x-3">
        <Icon size={20} className="text-gray-500 dark:text-gray-400" />
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            {label}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell size={24} className="text-blue-600 dark:text-blue-400" />
            Notification Preferences
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Choose how and when you want to receive appointment reminders and
            updates.
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* Email Notifications */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Mail size={20} className="text-green-600 dark:text-green-400" />
              Email Notifications
            </h3>
            <div className="space-y-1">
              <NotificationToggle
                icon={Calendar}
                label="Day Before Reminder"
                description="Get an email reminder 24 hours before your appointment"
                checked={settings.email.dayBefore}
                onChange={(checked) =>
                  handleToggle("email", "dayBefore", checked)
                }
              />
              <NotificationToggle
                icon={Clock}
                label="2 Hour Reminder"
                description="Get an email reminder 2 hours before your appointment"
                checked={settings.email.twoHours}
                onChange={(checked) =>
                  handleToggle("email", "twoHours", checked)
                }
              />
              <NotificationToggle
                icon={Clock}
                label="30 Minute Reminder"
                description="Get an email reminder 30 minutes before your appointment"
                checked={settings.email.thirtyMinutes}
                onChange={(checked) =>
                  handleToggle("email", "thirtyMinutes", checked)
                }
              />
              <NotificationToggle
                icon={Bell}
                label="Appointment Updates"
                description="Get notified about appointment changes, cancellations, etc."
                checked={settings.email.appointmentUpdates}
                onChange={(checked) =>
                  handleToggle("email", "appointmentUpdates", checked)
                }
              />
            </div>
          </div>

          {/* SMS Notifications */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MessageSquare
                size={20}
                className="text-blue-600 dark:text-blue-400"
              />
              SMS Notifications
            </h3>
            <div className="space-y-1">
              <NotificationToggle
                icon={Calendar}
                label="Day Before Reminder"
                description="Get an SMS reminder 24 hours before your appointment"
                checked={settings.sms.dayBefore}
                onChange={(checked) =>
                  handleToggle("sms", "dayBefore", checked)
                }
              />
              <NotificationToggle
                icon={Clock}
                label="2 Hour Reminder"
                description="Get an SMS reminder 2 hours before your appointment"
                checked={settings.sms.twoHours}
                onChange={(checked) => handleToggle("sms", "twoHours", checked)}
              />
              <NotificationToggle
                icon={Clock}
                label="30 Minute Reminder"
                description="Get an SMS reminder 30 minutes before your appointment"
                checked={settings.sms.thirtyMinutes}
                onChange={(checked) =>
                  handleToggle("sms", "thirtyMinutes", checked)
                }
              />
              <NotificationToggle
                icon={Bell}
                label="Appointment Updates"
                description="Get SMS notifications about appointment changes"
                checked={settings.sms.appointmentUpdates}
                onChange={(checked) =>
                  handleToggle("sms", "appointmentUpdates", checked)
                }
              />
            </div>
          </div>

          {/* Push Notifications */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Phone
                size={20}
                className="text-purple-600 dark:text-purple-400"
              />
              Push Notifications
            </h3>
            <div className="space-y-1">
              <NotificationToggle
                icon={Calendar}
                label="Day Before Reminder"
                description="Get a push notification 24 hours before your appointment"
                checked={settings.push.dayBefore}
                onChange={(checked) =>
                  handleToggle("push", "dayBefore", checked)
                }
              />
              <NotificationToggle
                icon={Clock}
                label="2 Hour Reminder"
                description="Get a push notification 2 hours before your appointment"
                checked={settings.push.twoHours}
                onChange={(checked) =>
                  handleToggle("push", "twoHours", checked)
                }
              />
              <NotificationToggle
                icon={Clock}
                label="30 Minute Reminder"
                description="Get a push notification 30 minutes before your appointment"
                checked={settings.push.thirtyMinutes}
                onChange={(checked) =>
                  handleToggle("push", "thirtyMinutes", checked)
                }
              />
              <NotificationToggle
                icon={Bell}
                label="Appointment Updates"
                description="Get push notifications about appointment changes"
                checked={settings.push.appointmentUpdates}
                onChange={(checked) =>
                  handleToggle("push", "appointmentUpdates", checked)
                }
              />
            </div>
          </div>

          {/* General Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              General Settings
            </h3>
            <div className="space-y-1">
              <NotificationToggle
                icon={Bell}
                label="System Announcements"
                description="Get notified about platform updates and maintenance"
                checked={settings.general.systemAnnouncements}
                onChange={(checked) =>
                  handleToggle("general", "systemAnnouncements", checked)
                }
              />
              <NotificationToggle
                icon={Mail}
                label="Marketing Emails"
                description="Receive promotional emails and health tips"
                checked={settings.general.marketingEmails}
                onChange={(checked) =>
                  handleToggle("general", "marketingEmails", checked)
                }
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              saved
                ? "bg-green-600 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Saving..." : saved ? "Saved!" : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;
