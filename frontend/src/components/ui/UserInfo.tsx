import React from "react";
import Image from "next/image";
import { UserInfoProps } from "@/types";

const UserInfo: React.FC<UserInfoProps> = ({ user, placeholder }) => {
  const imagePlaceholder =
    placeholder ||
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541";

  return (
    <div className="flex items-center">
      <div className="relative h-8 w-8 rounded-full overflow-hidden">
        <Image
          src={user?.avatar || imagePlaceholder}
          alt={user?.name || "User"}
          fill
          className="object-cover"
          sizes="32px"
        />
      </div>
      <div className="ml-3">
        <div className="text-sm font-medium text-primary">
          {user?.name || "N/A"}
        </div>
        <div className="text-sm text-gray-500">{user?.email || ""}</div>
      </div>
    </div>
  );
};

export default UserInfo;
