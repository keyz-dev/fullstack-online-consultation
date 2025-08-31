"use client";

import React, { useEffect, useState } from "react";

type FadeInContainerProps = {
  children: React.ReactNode;
  className?: string;
};

const FadeInContainer: React.FC<FadeInContainerProps> = ({
  children,
  className = "",
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in after mount
    const timeout = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`
        transition-opacity duration-500 ease-out
        ${visible ? "opacity-100" : "opacity-0"}
        bg-white dark:bg-gray-900
        text-gray-900 dark:text-white
        ${className}
      `}
      data-testid="fade-in-container"
    >
      {children}
    </div>
  );
};

export default FadeInContainer;