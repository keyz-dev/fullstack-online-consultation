import React, { useState } from "react";
import { Button, Input, TextArea, FileUploader } from "@/components/ui";
import { Save, User, Mail, Calendar, MapPin, Upload } from "lucide-react";

interface AdminProfileEditProps {
  user: any;
}

const AdminProfileEdit: React.FC<AdminProfileEditProps> = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    gender: user?.gender || "",
    dob: user?.dob ? user.dob.split("T")[0] : "",
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      country: user?.address?.country || "",
      postalCode: user?.address?.postalCode || "",
    },
    bio: user?.bio || "",
  });

  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
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

  const handleAddressChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (formData.dob) {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      if (dobDate > today) {
        newErrors.dob = "Date of birth cannot be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      console.log("Updating profile:", { ...formData, avatar });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (file: File) => {
    setAvatar(file);
  };

  return (
    <div className="p-3 md:p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Edit Profile Information
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img
                src={
                  user?.avatar ||
                  "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
                }
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer">
                <Upload size={16} className="text-white" />
              </div>
            </div>
            <FileUploader
              onChange={handleAvatarChange}
              accept="image/*"
              text="Upload new avatar"
              className="max-w-xs"
            />
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              value={formData.name}
              onChangeHandler={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
              required
              icon={<User size={16} />}
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChangeHandler={(e) =>
                handleInputChange("email", e.target.value)
              }
              error={errors.email}
              required
              icon={<Mail size={16} />}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <Input
              label="Date of Birth"
              type="date"
              value={formData.dob}
              onChangeHandler={(e) => handleInputChange("dob", e.target.value)}
              error={errors.dob}
              icon={<Calendar size={16} />}
            />
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <MapPin size={20} />
              Address Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Street Address"
                value={formData.address.street}
                onChangeHandler={(e) =>
                  handleAddressChange("street", e.target.value)
                }
              />

              <Input
                label="City"
                value={formData.address.city}
                onChangeHandler={(e) =>
                  handleAddressChange("city", e.target.value)
                }
              />

              <Input
                label="State/Province"
                value={formData.address.state}
                onChangeHandler={(e) =>
                  handleAddressChange("state", e.target.value)
                }
              />

              <Input
                label="Country"
                value={formData.address.country}
                onChangeHandler={(e) =>
                  handleAddressChange("country", e.target.value)
                }
              />

              <Input
                label="Postal Code"
                value={formData.address.postalCode}
                onChangeHandler={(e) =>
                  handleAddressChange("postalCode", e.target.value)
                }
              />
            </div>
          </div>

          {/* Bio */}
          <TextArea
            label="Bio"
            value={formData.bio}
            onChangeHandler={(e) => handleInputChange("bio", e.target.value)}
            placeholder="Tell us about yourself..."
            rows={4}
          />

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              leadingIcon={<Save size={20} />}
              text={loading ? "Updating..." : "Save Changes"}
              isDisabled={loading}
            />
          </div>
        </form>
      </div>

      {/* Account Information (Read-only) */}
      <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Account Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
              User ID
            </label>
            <p className="text-gray-900 dark:text-white mt-1">{user?.id}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
              Role
            </label>
            <p className="text-gray-900 dark:text-white mt-1 capitalize">
              {user?.role}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
              Member Since
            </label>
            <p className="text-gray-900 dark:text-white mt-1">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
              Last Updated
            </label>
            <p className="text-gray-900 dark:text-white mt-1">
              {user?.updatedAt
                ? new Date(user.updatedAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileEdit;
