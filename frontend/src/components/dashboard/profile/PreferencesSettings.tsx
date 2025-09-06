import React, { useState } from "react";
import { UserPreferences } from "@/hooks/useProfile";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label,
  Input,
  Badge,
  Alert,
  AlertDescription,
} from "@/components/ui";

interface PreferencesSettingsProps {
  onPreferencesUpdate: (preferences: UserPreferences) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  currentPreferences?: UserPreferences;
}

const PreferencesSettings: React.FC<PreferencesSettingsProps> = ({
  onPreferencesUpdate,
  loading = false,
  error = null,
  currentPreferences,
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    notifications: {
      email: currentPreferences?.notifications?.email ?? true,
      push: currentPreferences?.notifications?.push ?? true,
      sms: currentPreferences?.notifications?.sms ?? false,
    },
    privacy: {
      profileVisibility:
        currentPreferences?.privacy?.profileVisibility ?? "public",
      showEmail: currentPreferences?.privacy?.showEmail ?? false,
      showPhone: currentPreferences?.privacy?.showPhone ?? false,
    },
    theme: currentPreferences?.theme ?? "auto",
    language: currentPreferences?.language ?? "en",
    timezone: currentPreferences?.timezone ?? "UTC",
  });

  const handleNotificationChange = async (
    key: keyof typeof preferences.notifications,
    value: boolean
  ) => {
    const newPreferences = {
      ...preferences,
      notifications: {
        ...preferences.notifications,
        [key]: value,
      },
    };
    setPreferences(newPreferences);

    try {
      await onPreferencesUpdate(newPreferences);
    } catch (error) {
      // Revert on error
      setPreferences((prev) => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [key]: !value,
        },
      }));
    }
  };

  const handlePrivacyChange = async (
    key: keyof typeof preferences.privacy,
    value: unknown
  ) => {
    const newPreferences = {
      ...preferences,
      privacy: {
        ...preferences.privacy,
        [key]: value,
      },
    };
    setPreferences(newPreferences);

    try {
      await onPreferencesUpdate(newPreferences);
    } catch (error) {
      // Revert on error
      setPreferences((prev) => ({
        ...prev,
        privacy: {
          ...prev.privacy,
          [key]: preferences.privacy[key],
        },
      }));
    }
  };

  const handleGeneralChange = async (
    key: keyof UserPreferences,
    value: unknown
  ) => {
    const newPreferences = {
      ...preferences,
      [key]: value,
    };
    setPreferences(newPreferences);

    try {
      await onPreferencesUpdate(newPreferences);
    } catch (error) {
      // Revert on error
      setPreferences((prev) => ({
        ...prev,
        [key]: preferences[key as keyof UserPreferences],
      }));
    }
  };

  const getVisibilityDescription = (visibility: string) => {
    switch (visibility) {
      case "public":
        return "Your profile is visible to everyone";
      case "private":
        return "Your profile is only visible to you";
      case "friends":
        return "Your profile is visible to your connections only";
      default:
        return "";
    }
  };

  const languages = [
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
    { code: "es", name: "Español" },
    { code: "de", name: "Deutsch" },
    { code: "it", name: "Italiano" },
    { code: "pt", name: "Português" },
    { code: "ru", name: "Русский" },
    { code: "zh", name: "中文" },
    { code: "ja", name: "日本語" },
    { code: "ko", name: "한국어" },
  ];

  const timezones = [
    { value: "UTC", label: "UTC (Coordinated Universal Time)" },
    { value: "EST", label: "EST (Eastern Standard Time)" },
    { value: "CST", label: "CST (Central Standard Time)" },
    { value: "MST", label: "MST (Mountain Standard Time)" },
    { value: "PST", label: "PST (Pacific Standard Time)" },
    { value: "GMT", label: "GMT (Greenwich Mean Time)" },
    { value: "CET", label: "CET (Central European Time)" },
    { value: "EET", label: "EET (Eastern European Time)" },
    { value: "IST", label: "IST (Indian Standard Time)" },
    { value: "JST", label: "JST (Japan Standard Time)" },
  ];

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Notification Preferences */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Notifications
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receive notifications via email
              </p>
            </div>
            <Switch
              checked={preferences.notifications.email}
              onCheckedChange={(checked) =>
                handleNotificationChange("email", checked)
              }
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Push Notifications
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receive notifications in your browser
              </p>
            </div>
            <Switch
              checked={preferences.notifications.push}
              onCheckedChange={(checked) =>
                handleNotificationChange("push", checked)
              }
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                SMS Notifications
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receive notifications via SMS (if phone number is provided)
              </p>
            </div>
            <Switch
              checked={preferences.notifications.sms}
              onCheckedChange={(checked) =>
                handleNotificationChange("sms", checked)
              }
              disabled={loading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Preferences */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Privacy Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Profile Visibility
            </Label>
            <Select
              value={preferences.privacy.profileVisibility}
              onValueChange={(value) =>
                handlePrivacyChange("profileVisibility", value)
              }
              disabled={loading}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="friends">Friends Only</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {getVisibilityDescription(preferences.privacy.profileVisibility)}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Show Email Address
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Allow others to see your email address
              </p>
            </div>
            <Switch
              checked={preferences.privacy.showEmail}
              onCheckedChange={(checked) =>
                handlePrivacyChange("showEmail", checked)
              }
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Show Phone Number
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Allow others to see your phone number
              </p>
            </div>
            <Switch
              checked={preferences.privacy.showPhone}
              onCheckedChange={(checked) =>
                handlePrivacyChange("showPhone", checked)
              }
              disabled={loading}
            />
          </div>
        </CardContent>
      </Card>

      {/* General Preferences */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            General Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Theme
            </Label>
            <Select
              value={preferences.theme}
              onValueChange={(value) => handleGeneralChange("theme", value)}
              disabled={loading}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto (System)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Choose your preferred theme appearance
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Language
            </Label>
            <Select
              value={preferences.language}
              onValueChange={(value) => handleGeneralChange("language", value)}
              disabled={loading}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Choose your preferred language
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Timezone
            </Label>
            <Select
              value={preferences.timezone}
              onValueChange={(value) => handleGeneralChange("timezone", value)}
              disabled={loading}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Set your local timezone for accurate time display
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Data Usage Preferences */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Data Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Analytics
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Help us improve by sharing anonymous usage data
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              Always Anonymous
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Personalization
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Allow personalized content and recommendations
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              Enabled
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Information */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
            About Your Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>
              • Your preferences are saved automatically when you make changes
            </li>
            <li>• Notification settings can be changed at any time</li>
            <li>• Privacy settings affect how others see your profile</li>
            <li>• Theme changes apply immediately to your interface</li>
            <li>• Language and timezone settings affect date/time display</li>
            <li>• You can reset all preferences to default at any time</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreferencesSettings;
