import { useState, useRef, useEffect, useCallback } from 'react';
import Peer from 'simple-peer';
import { useSocketContext } from '@/contexts';

interface UseSimplePeerWebRTCProps {
  roomId: string;
  consultationId: string;
  userRole: 'doctor' | 'patient';
  onCallEnd: (notes?: string) => void;
  onChatMessage?: (data: {
    roomId: string;
    consultationId: string;
    message: string;
    timestamp: string;
    senderRole: string;
    fromUserId: number;
    fromName: string;
    sent: boolean;
  }) => void;
  notes?: string; // Add notes parameter
}

interface CallState {
  calling: boolean;
  isInitiator: boolean;
  from?: number;
  name?: string;
  signal?: unknown;
}

export const useSimplePeerWebRTC = ({ 
  roomId, 
  consultationId, 
  userRole, 
  onCallEnd,
  onChatMessage,
  notes
}: UseSimplePeerWebRTCProps) => {
  // States
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [call, setCall] = useState<CallState>({ calling: false, isInitiator: false });
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [remoteUserId, setRemoteUserId] = useState<number | null>(null);
  
  // Video controls
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer.Instance | null>(null);

  const { socket } = useSocketContext();

  // Initialize media stream
  useEffect(() => {
    const getMediaStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280, max: 1920 },
            height: { ideal: 720, max: 1080 },
            frameRate: { ideal: 30, max: 60 },
            facingMode: 'user'
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            channelCount: 2,
            sampleRate: 48000
          }
        });

        setStream(mediaStream);
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }
        
      } catch (error) {
        console.error('❌ Error getting media stream:', error);
      }
    };

    getMediaStream();
  }, []);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;


    // Handle incoming call
    const handleIncomingCall = (data: { 
      signal: unknown; 
      from: number; 
      name: string; 
      roomId: string;
      consultationId: string;
    }) => {
      setCall({
        calling: true,
        isInitiator: false,
        from: data.from,
        name: data.name,
        signal: data.signal
      });
      setRemoteUserId(data.from);
    };

    // Handle call accepted
    const handleCallAccepted = (data: { signal: unknown; from: number; name: string }) => {
      setCallAccepted(true);
      setIsConnected(true);
      
      if (peerRef.current) {
        peerRef.current.signal(data.signal);
      }
    };

    // Handle call ended
    const handleCallEnded = () => {
      leaveCall();
    };

    // Handle user joined room
    const handleUserJoined = (data: { userId: number; name: string; roomId: string }) => {
      setRemoteUserId(data.userId);
      
      // Only doctor initiates call, and only if not already calling
      if (userRole === 'doctor' && stream && !call.calling && !callAccepted) {
        setTimeout(() => {
          // Double check we're not already in a call
          if (!call.calling && !callAccepted) {
            callUser(data.userId, data.name);
          } else {
          }
        }, 1000);
      }     };

    // Handle chat messages
    const handleChatMessage = (data: {
      roomId: string;
      consultationId: string;
      message: string;
      timestamp: string;
      senderRole: string;
      fromUserId: number;
      fromName: string;
      sent: boolean;
    }) => {
      if (onChatMessage) {
        onChatMessage(data);
      }
    };

    // Register socket events
    socket.on('video:call-user', handleIncomingCall);
    socket.on('video:call-accepted', handleCallAccepted);
    socket.on('video:call-ended', handleCallEnded);
    socket.on('video:user-joined', handleUserJoined);
    socket.on('video:simple-peer-chat', handleChatMessage);

    // Join room
    socket.emit('video:join-room', { roomId, consultationId });

    return () => {
      socket.off('video:call-user', handleIncomingCall);
      socket.off('video:call-accepted', handleCallAccepted);
      socket.off('video:call-ended', handleCallEnded);
      socket.off('video:user-joined', handleUserJoined);
      socket.off('video:simple-peer-chat', handleChatMessage);
    };
  }, [socket, stream, userRole, roomId, consultationId]);

  // Call user function
  const callUser = useCallback((userId: number, userName: string) => {
    if (!stream) {
      return;
    }

    setCall({ calling: true, isInitiator: true });

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream
    });

    peer.on('signal', (data) => {
      if (socket) {
        socket.emit('video:call-user', {
          userToCall: userId,
          signalData: data,
          from: socket.id, // Use socket ID as identifier
          name: userRole === 'doctor' ? 'Doctor' : 'Patient',
          roomId,
          consultationId
        });
      }
    });

    peer.on('stream', (remoteStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });

    peer.on('connect', () => {
      setIsConnected(true);
    });

    peer.on('close', () => {
      setIsConnected(false);
    });

    peer.on('error', (error) => {
    });

    peerRef.current = peer;
  }, [stream, socket, userRole, roomId, consultationId]);

  // Answer call function
  const answerCall = useCallback(() => {
    if (!stream || !call.signal) {
      return;
    }

    setCallAccepted(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream
    });

    peer.on('signal', (data) => {
      if (socket && call.from) {
        socket.emit('video:answer-call', {
          signal: data,
          to: call.from,
          name: userRole === 'doctor' ? 'Doctor' : 'Patient',
          roomId,
          consultationId
        });
      }
    });

    peer.on('stream', (remoteStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });

    peer.on('connect', () => {
      setIsConnected(true);
    });

    peer.on('close', () => {
      setIsConnected(false);
    });

    peer.on('error', (error) => {
    });

    peer.signal(call.signal);
    peerRef.current = peer;
  }, [stream, call, socket, userRole, roomId, consultationId]);

  // Leave call function
  const leaveCall = useCallback(() => {
    // Prevent multiple calls to leaveCall
    if (callEnded) {
      return;
    }
    
    setCallEnded(true);
    setCallAccepted(false);
    setIsConnected(false);
    setCall({ calling: false, isInitiator: false });
    
    // Clean up peer connection
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    // Clear remote video
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    // Clear local video
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    // Stop all media tracks and clear stream
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
    }

    // Only emit end event if we haven't already ended
    if (socket && !callEnded) {
      socket.emit('video:end-call', { roomId, consultationId });
    }

    // Call onCallEnd only once
    setTimeout(() => {
      onCallEnd(notes);
    }, 100);
  }, [socket, roomId, consultationId, onCallEnd, callEnded, notes, stream]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  }, [stream]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  }, [stream]);

  // Send chat message function
  const sendChatMessage = useCallback((message: string) => {
    if (!socket || !message.trim()) return;

    const chatData = {
      roomId,
      consultationId,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      senderRole: userRole
    };

    socket.emit('video:simple-peer-chat', chatData);
  }, [socket, roomId, consultationId, userRole]);

  // Cleanup when call ends
  useEffect(() => {
    if (callEnded) {
      
      // Clear video elements
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    }
  }, [callEnded]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, [stream]);

  return {
    // States
    stream,
    call,
    callAccepted,
    callEnded,
    isConnected,
    remoteUserId,
    isVideoEnabled,
    isAudioEnabled,
    
    // Refs
    localVideoRef,
    remoteVideoRef,
    
    // Functions
    callUser,
    answerCall,
    leaveCall,
    toggleVideo,
    toggleAudio,
    sendChatMessage
  };
};
