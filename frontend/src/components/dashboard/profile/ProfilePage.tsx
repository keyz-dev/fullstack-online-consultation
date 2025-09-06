import React, { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { TabGroup, FadeInContainer } from "@/components/ui";
import ProfileOverview from "./ProfileOverview";
import ProfileEdit from "./ProfileEdit";
import SecuritySettings from "../../ui/SecuritySettings";
import PreferencesSettings from "./PreferencesSettings";
import ProfileStats from "./ProfileStats";

const ProfilePage: React.FC = () => {
  const {
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
  } = useProfile();

  const [activeTab, setActiveTab] = useState("overview");
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (!userStats) {
        setStatsLoading(true);
        try {
          await getUserStats();
        } catch (error) {
          console.error("Failed to fetch user stats:", error);
        } finally {
          setStatsLoading(false);
        }
      }
    };

    fetchStats();
  }, [getUserStats, userStats]);

  const handleProfileUpdate = async (data: unknown) => {
    try {
      await updateProfile(data);
      // Refresh stats after profile update
      await getUserStats();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleAvatarUpdate = async (file: File) => {
    try {
      await updateAvatar(file);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleAvatarDelete = async () => {
    try {
      await deleteAvatar();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handlePasswordUpdate = async (data: unknown) => {
    try {
      await updatePassword(data);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handlePreferencesUpdate = async (preferences: unknown) => {
    try {
      await updatePreferences(preferences);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: "👤",
      component: (
        <ProfileOverview
          user={user}
          stats={userStats}
          loading={loading || statsLoading}
        />
      ),
    },
    {
      id: "edit",
      label: "Edit Profile",
      icon: "✏️",
      component: (
        <ProfileEdit
          user={user}
          onUpdate={handleProfileUpdate}
          onAvatarUpdate={handleAvatarUpdate}
          onAvatarDelete={handleAvatarDelete}
          loading={updating}
          error={error}
        />
      ),
    },
    {
      id: "security",
      label: "Security",
      icon: "🔒",
      component: (
        <SecuritySettings
          onPasswordUpdate={handlePasswordUpdate}
          onPreferencesUpdate={handlePreferencesUpdate}
          loading={updating}
          error={error}
          user={user}
        />
      ),
    },
    {
      id: "preferences",
      label: "Preferences",
      icon: "⚙️",
      component: (
        <PreferencesSettings
          onPreferencesUpdate={handlePreferencesUpdate}
          loading={updating}
          error={error}
          currentPreferences={user?.preferences}
        />
      ),
    },
    {
      id: "stats",
      label: "Activity",
      icon: "📊",
      component: <ProfileStats stats={userStats} loading={statsLoading} />,
    },
  ];

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <FadeInContainer delay={200} duration={600}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </FadeInContainer>

      {error && (
        <FadeInContainer delay={300} duration={600}>
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-red-800 dark:text-red-200">{error}</p>
              <button
                onClick={clearError}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
              >
                ✕
              </button>
            </div>
          </div>
        </FadeInContainer>
      )}

      <FadeInContainer delay={400} duration={600}>
        <TabGroup
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="bg-white dark:bg-gray-800 rounded-sm shadow-sm border border-gray-200 dark:border-gray-700"
        />
      </FadeInContainer>
    </div>
  );
};

export default ProfilePage;
