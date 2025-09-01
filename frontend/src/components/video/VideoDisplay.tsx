"use client";

import React, { useEffect } from "react";
import { ConnectionStatus } from "./ConnectionStatus";

interface VideoDisplayProps {
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>;
  isConnected: boolean;
  children?: React.ReactNode;
}

const VideoDisplay: React.FC<VideoDisplayProps> = ({
  localVideoRef,
  remoteVideoRef,
  isConnected,
  children,
}) => {
  // Debug video streams
  useEffect(() => {
    const checkStreams = () => {
      if (localVideoRef.current?.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        console.log("🎥 Local video has stream:", stream.getTracks().length, "tracks");
      } else {
        console.log("❌ Local video has no stream");
      }

      if (remoteVideoRef.current?.srcObject) {
        const stream = remoteVideoRef.current.srcObject as MediaStream;
        console.log("🎥 Remote video has stream:", stream.getTracks().length, "tracks");
      } else {
        console.log("❌ Remote video has no stream");
      }
    };

    // Check immediately and then every 2 seconds
    checkStreams();
    const interval = setInterval(checkStreams, 2000);
    return () => clearInterval(interval);
  }, [localVideoRef, remoteVideoRef]);

  return (
    <div className="flex-1 relative">
      {/* Remote Video */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover bg-gray-800"
        onLoadedMetadata={() => console.log("🎥 Remote video metadata loaded")}
        onCanPlay={() => console.log("🎥 Remote video can play")}
      />
      
      {/* Local Video (Picture-in-Picture) */}
      <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          onLoadedMetadata={() => console.log("🎥 Local video metadata loaded")}
          onCanPlay={() => console.log("🎥 Local video can play")}
        />
      </div>

      {/* Connection Status */}
      <ConnectionStatus isConnected={isConnected} />

      {/* Render any overlay controls */}
      {children}
    </div>
  );
};

export default VideoDisplay;