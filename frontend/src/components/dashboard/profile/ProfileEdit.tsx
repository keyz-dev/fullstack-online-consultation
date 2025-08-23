import React, { useState, useRef, ChangeEvent } from "react";
import { UserProfile, ProfileUpdateData } from "@/hooks/useProfile";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TextArea,
  Avatar,
  Badge,
  Alert,
  AlertDescription,
  AddressInput,
} from "@/components/ui";
import { Address } from "@/api";

interface ProfileEditProps {
  user: UserProfile | null;
  onUpdate: (data: ProfileUpdateData) => Promise<void>;
  onAvatarUpdate: (file: File) => Promise<void>;
  onAvatarDelete: () => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({
  user,
  onUpdate,
  onAvatarUpdate,
  onAvatarDelete,
  loading = false,
  error = null,
}) => {
  const [formData, setFormData] = useState<ProfileUpdateData>({
    name: user?.name || "",
    email: user?.email || "",
    gender: user?.gender || undefined,
    dob: user?.dob ? user.dob.split("T")[0] : "",
    address: user?.address || {
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
    bio: user?.doctor?.bio || user?.pharmacy?.description || "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    field: keyof ProfileUpdateData,
    value: string | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (address: Address) => {
    setFormData((prev) => ({
      ...prev,
      address,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty values
    const updateData: ProfileUpdateData = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        updateData[key as keyof ProfileUpdateData] = value;
      }
    });

    await onUpdate(updateData);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    try {
      setAvatarLoading(true);
      await onAvatarUpdate(avatarFile);
      setAvatarFile(null);
      setAvatarPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Failed to upload avatar:", error);
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleAvatarRemove = async () => {
    try {
      setAvatarLoading(true);
      await onAvatarDelete();
      setAvatarFile(null);
      setAvatarPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Failed to remove avatar:", error);
    } finally {
      setAvatarLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Profile Picture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <Avatar
                src={avatarPreview || user.avatar}
                alt={user.name}
                size="lg"
                className="h-24 w-24"
              />
              <div className="flex-1 space-y-4">
                <div>
                  <Label
                    htmlFor="avatar"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Upload new picture
                  </Label>
                  <Input
                    ref={fileInputRef}
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChangeHandler={handleAvatarChange}
                  />
                </div>
                <div className="flex space-x-3">
                  {avatarFile && (
                    <Button
                      type="button"
                      onClickHandler={handleAvatarUpload}
                      isDisabled={avatarLoading}
                    >
                      {avatarLoading ? "Uploading..." : "Upload"}
                    </Button>
                  )}
                  {user.avatar && (
                    <Button
                      type="button"
                      onClickHandler={handleAvatarRemove}
                      isDisabled={avatarLoading}
                    >
                      {avatarLoading ? "Removing..." : "Remove"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChangeHandler={(e) =>
                    handleInputChange("name", e.target.value)
                  }
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChangeHandler={(e) =>
                    handleInputChange("email", e.target.value)
                  }
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Label
                  htmlFor="gender"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Gender
                </Label>
                <Select
                  value={formData.gender || ""}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    handleInputChange("gender", e.target.value)
                  }
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "other", label: "Other" },
                  ]}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  htmlFor="dob"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Date of Birth
                </Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChangeHandler={(e) =>
                    handleInputChange("dob", e.target.value)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AddressInput
              value={
                formData.address || {
                  street: "",
                  city: "",
                  state: "",
                  country: "",
                  postalCode: "",
                }
              }
              onChange={handleAddressChange}
            />
          </CardContent>
        </Card>

        {/* Role-specific Information */}
        {(user.role === "doctor" || user.role === "pharmacy") && (
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                {user.role === "doctor"
                  ? "Professional Bio"
                  : "Pharmacy Description"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label
                  htmlFor="bio"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {user.role === "doctor" ? "Professional Bio" : "Description"}
                </Label>
                <TextArea
                  id="bio"
                  value={formData.bio}
                  onChangeHandler={(e) =>
                    handleInputChange("bio", e.target.value)
                  }
                  placeholder={
                    user.role === "doctor"
                      ? "Tell patients about your experience, specialties, and approach to care..."
                      : "Describe your pharmacy services, specialties, and what makes you unique..."
                  }
                  rows={4}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="px-6">
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
