import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  fallback?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, size = "md", fallback, ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
      xl: "h-16 w-16",
    };

    const getInitials = (name: string) => {
      return name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-block rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src ? (
          <Image
            src={src}
            alt={alt || "Avatar"}
            fill
            className="object-cover"
            sizes={sizeClasses[size]}
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 font-medium text-sm">
            {fallback ? getInitials(fallback) : "U"}
          </div>
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export default Avatar;
