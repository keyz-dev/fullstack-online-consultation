import React, { useState, useEffect } from "react";

interface ConnectionStatusProps {
  isConnected: boolean;
  startedAt?: Date | string | null;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  isConnected, 
  startedAt 
}) => {
  const [duration, setDuration] = useState(0);

  // Calculate duration when connected
  useEffect(() => {
    if (!isConnected || !startedAt) {
      setDuration(0);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const startTime = new Date(startedAt);
      const durationSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setDuration(durationSeconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected, startedAt]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute top-4 left-4">
      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
        isConnected 
          ? "bg-green-600 text-white" 
          : "bg-yellow-600 text-white"
      }`}>
        <div className="flex items-center gap-2">
          <span>{isConnected ? "Connected" : "Connecting..."}</span>
          {isConnected && duration > 0 && (
            <>
              <span className="text-gray-300">•</span>
              <span className="font-mono text-xs">
                {formatDuration(duration)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
