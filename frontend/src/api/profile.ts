import api from "./index";

// Profile management API
export const profileApi = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get("/profile/profile");
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData: any) => {
    const response = await api.put("/profile/profile", profileData);
    return response.data;
  },

  // Update user password
  updatePassword: async (passwordData: any) => {
    const response = await api.put("/profile/password", passwordData);
    return response.data;
  },

  // Update user avatar
  updateAvatar: async (avatarFile: File) => {
    const formData = new FormData();
    formData.append("avatar", avatarFile);

    const response = await api.put("/profile/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Delete user avatar
  deleteAvatar: async () => {
    const response = await api.delete("/profile/avatar");
    return response.data;
  },

  // Get user statistics
  getUserStats: async () => {
    const response = await api.get("/profile/stats");
    return response.data;
  },

  // Update user preferences
  updatePreferences: async (preferences: any) => {
    const response = await api.put("/profile/preferences", { preferences });
    return response.data;
  },
};
