import React from "react";

interface ConnectionStatusProps {
  isConnected: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected }) => {
  return (
    <div className="absolute top-4 left-4">
      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
        isConnected 
          ? "bg-green-600 text-white" 
          : "bg-yellow-600 text-white"
      }`}>
        {isConnected ? "Connected" : "Connecting..."}
      </div>
    </div>
  );
};
