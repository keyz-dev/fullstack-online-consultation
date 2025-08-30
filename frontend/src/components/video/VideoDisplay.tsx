import React from "react";

interface VideoDisplayProps {
  localVideoRef: React.RefObject<HTMLVideoElement> | null;
  remoteVideoRef: React.RefObject<HTMLVideoElement> | null;
}

export const VideoDisplay: React.FC<VideoDisplayProps> = ({
  localVideoRef,
  remoteVideoRef,
}) => {
  return (
    <div className="flex-1 relative">
      {/* Remote Video */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover bg-gray-800"
      />

      {/* Local Video (Picture-in-Picture) */}
      <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};
