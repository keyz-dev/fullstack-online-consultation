import React from "react";

interface ModalWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 top-0 w-screen z-50 flex justify-center items-center overflow-y-auto backdrop-blur-sm"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="absolute min-h-[calc(100vh-6rem)] bottom-0 w-screen bg-white dark:bg-gray-900 grid place-items-center overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default ModalWrapper;
