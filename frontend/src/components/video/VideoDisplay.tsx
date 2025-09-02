"use client";

import React, { useEffect } from "react";
import { ConnectionStatus } from "./ConnectionStatus";

interface VideoDisplayProps {
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>;
  isConnected: boolean;
  startedAt?: Date | string | null;
  children?: React.ReactNode;
}

const VideoDisplay: React.FC<VideoDisplayProps> = ({
  localVideoRef,
  remoteVideoRef,
  isConnected,
  startedAt,
  children,
}) => {
  // Debug video streams
  useEffect(() => {
    const checkStreams = () => {
      if (localVideoRef.current?.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
      }
      if (remoteVideoRef.current?.srcObject) {
        const stream = remoteVideoRef.current.srcObject as MediaStream;
      } else {
        console.log("❌ Remote video has no stream");
      }
    };

    // Check immediately and then every 5 seconds (reduced spam)
    checkStreams();
    const interval = setInterval(checkStreams, 5000);
    return () => clearInterval(interval);
  }, [localVideoRef, remoteVideoRef]);

  // Cleanup video elements when connection status changes
  useEffect(() => {
    if (!isConnected) {
      
      // Clear remote video when disconnected
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
      
      // Note: Don't clear local video here as it might still be needed for reconnection
      // Local video cleanup is handled in the useSimplePeerWebRTC hook
    }
  }, [isConnected, remoteVideoRef]);

  return (
    <div className="flex-1 relative h-full">
      {/* Remote Video */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover bg-gray-800"
        onError={(e) => {
          const video = e.target as HTMLVideoElement;
          console.error("❌ Video error details:", {
            error: video.error,
            networkState: video.networkState,
            readyState: video.readyState,
            src: video.src,
            srcObject: video.srcObject
          });
        }}
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

      {/* Connection Status */}
      <ConnectionStatus isConnected={isConnected} startedAt={startedAt} />

      {/* Render any overlay controls */}
      {children}
    </div>
  );
};

export default VideoDisplay;