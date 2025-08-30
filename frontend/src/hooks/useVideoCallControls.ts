import { useState, useCallback, useRef } from 'react';

export const useVideoCallControls = () => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const localStreamRef = useRef<MediaStream | null>(null);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  }, []);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  }, []);

  // Toggle screen share
  const toggleScreenShare = useCallback(async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        
        // Replace video track with screen share
        if (localStreamRef.current && localStreamRef.current.getVideoTracks()[0]) {
          const videoTrack = localStreamRef.current.getVideoTracks()[0];
          localStreamRef.current.removeTrack(videoTrack);
          localStreamRef.current.addTrack(screenStream.getVideoTracks()[0]);
        }
        
        setIsScreenSharing(true);
      } else {
        // Switch back to camera
        const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        if (localStreamRef.current && localStreamRef.current.getVideoTracks()[0]) {
          const screenTrack = localStreamRef.current.getVideoTracks()[0];
          localStreamRef.current.removeTrack(screenTrack);
          localStreamRef.current.addTrack(cameraStream.getVideoTracks()[0]);
        }
        
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
    }
  }, [isScreenSharing]);

  return {
    isAudioEnabled,
    isVideoEnabled,
    isScreenSharing,
    showChat,
    showNotes,
    setShowChat,
    setShowNotes,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    localStreamRef,
  };
};
