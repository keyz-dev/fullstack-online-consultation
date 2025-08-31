import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, Square } from 'lucide-react';

interface ConsultationTimerProps {
  startTime: Date;
  isActive: boolean;
  onPause?: () => void;
  onResume?: () => void;
  onStop?: () => void;
  userRole: string;
}

export const ConsultationTimer: React.FC<ConsultationTimerProps> = ({
  startTime,
  isActive,
  onPause,
  onResume,
  onStop,
  userRole,
}) => {
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      if (!isPaused) {
        setElapsed(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isActive, isPaused]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePause = () => {
    setIsPaused(true);
    onPause?.();
  };

  const handleResume = () => {
    setIsPaused(false);
    onResume?.();
  };

  const getTimerColor = () => {
    if (elapsed < 900) return 'text-green-600 dark:text-green-400'; // < 15 min
    if (elapsed < 1800) return 'text-yellow-600 dark:text-yellow-400'; // < 30 min
    return 'text-red-600 dark:text-red-400'; // > 30 min
  };

  return (
    <div className="flex items-center space-x-3 bg-gray-800/80 backdrop-blur-sm rounded-lg px-4 py-2">
      <Clock className="w-5 h-5 text-gray-300" />
      
      <div className="flex items-center space-x-2">
        <span className={`font-mono text-lg font-semibold ${getTimerColor()}`}>
          {formatTime(elapsed)}
        </span>
        
        {isPaused && (
          <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded">
            PAUSED
          </span>
        )}
      </div>

      {/* Timer Controls (Doctor only) */}
      {userRole === 'doctor' && (
        <div className="flex items-center space-x-1">
          {!isPaused ? (
            <button
              onClick={handlePause}
              className="p-1 text-gray-300 hover:text-yellow-400 transition-colors"
              title="Pause timer"
            >
              <Pause className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleResume}
              className="p-1 text-gray-300 hover:text-green-400 transition-colors"
              title="Resume timer"
            >
              <Play className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={onStop}
            className="p-1 text-gray-300 hover:text-red-400 transition-colors"
            title="End consultation"
          >
            <Square className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
