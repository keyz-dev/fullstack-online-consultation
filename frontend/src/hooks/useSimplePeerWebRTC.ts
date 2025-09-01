import { useState, useRef, useEffect, useCallback } from 'react';
import Peer from 'simple-peer';
import { useSocketContext } from '@/contexts';

interface UseSimplePeerWebRTCProps {
  roomId: string;
  consultationId: string;
  userRole: 'doctor' | 'patient';
  onCallEnd: () => void;
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
}

interface CallState {
  calling: boolean;
  isInitiator: boolean;
  from?: number;
  name?: string;
  signal?: any;
}

export const useSimplePeerWebRTC = ({ 
  roomId, 
  consultationId, 
  userRole, 
  onCallEnd,
  onChatMessage
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
        console.log('🎥 Getting media stream...');
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
          console.log('✅ Local video stream set');
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

    console.log('🔌 Setting up Simple Peer socket listeners...');

    // Handle incoming call
    const handleIncomingCall = (data: { 
      signal: any; 
      from: number; 
      name: string; 
      roomId: string;
      consultationId: string;
    }) => {
      console.log('📞 Incoming call from:', data.from);
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
    const handleCallAccepted = (data: { signal: any; from: number; name: string }) => {
      console.log('✅ Call accepted by:', data.from);
      setCallAccepted(true);
      setIsConnected(true);
      
      if (peerRef.current) {
        peerRef.current.signal(data.signal);
      }
    };

    // Handle call ended
    const handleCallEnded = () => {
      console.log('📞 Call ended by remote user');
      leaveCall();
    };

    // Handle user joined room
    const handleUserJoined = (data: { userId: number; name: string; roomId: string }) => {
      console.log('👥 User joined room:', data.userId, 'Current role:', userRole);
      setRemoteUserId(data.userId);
      
      // Only doctor initiates call, and only if not already calling
      if (userRole === 'doctor' && stream && !call.calling && !callAccepted) {
        console.log('👨‍⚕️ Doctor initiating call to patient:', data.userId);
        setTimeout(() => {
          // Double check we're not already in a call
          if (!call.calling && !callAccepted) {
            callUser(data.userId, data.name);
          } else {
            console.log('⚠️ Call already in progress, skipping initiation');
          }
        }, 1000);
      } else {
        console.log('ℹ️ Not initiating call:', {
          isDoctor: userRole === 'doctor',
          hasStream: !!stream,
          alreadyCalling: call.calling,
          callAccepted: callAccepted
        });
      }
    };

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
      console.log('💬 Chat message received:', data);
      // This will be handled by the component that uses this hook
      // We'll expose it through a callback
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
    console.log('🏠 Joined room:', roomId);

    return () => {
      console.log('🧹 Cleaning up socket listeners');
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
      console.log('❌ No stream available to make call');
      return;
    }

    console.log('📞 Calling user:', userId);
    setCall({ calling: true, isInitiator: true });

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream
    });

    peer.on('signal', (data) => {
      console.log('📤 Sending call signal to:', userId);
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
      console.log('🎥 Received remote stream');
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
        console.log('✅ Remote video stream set');
      }
    });

    peer.on('connect', () => {
      console.log('✅ Peer connection established');
      setIsConnected(true);
    });

    peer.on('close', () => {
      console.log('📞 Peer connection closed');
      setIsConnected(false);
    });

    peer.on('error', (error) => {
      console.error('❌ Peer connection error:', error);
    });

    peerRef.current = peer;
  }, [stream, socket, userRole, roomId, consultationId]);

  // Answer call function
  const answerCall = useCallback(() => {
    if (!stream || !call.signal) {
      console.log('❌ Cannot answer call - no stream or signal');
      return;
    }

    console.log('📞 Answering call from:', call.from);
    setCallAccepted(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream
    });

    peer.on('signal', (data) => {
      console.log('📤 Sending answer signal to:', call.from);
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
      console.log('🎥 Received remote stream');
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
        console.log('✅ Remote video stream set');
      }
    });

    peer.on('connect', () => {
      console.log('✅ Peer connection established');
      setIsConnected(true);
    });

    peer.on('close', () => {
      console.log('📞 Peer connection closed');
      setIsConnected(false);
    });

    peer.on('error', (error) => {
      console.error('❌ Peer connection error:', error);
    });

    peer.signal(call.signal);
    peerRef.current = peer;
  }, [stream, call, socket, userRole, roomId, consultationId]);

  // Leave call function
  const leaveCall = useCallback(() => {
    console.log('📞 Leaving call...');
    
    // Prevent multiple calls to leaveCall
    if (callEnded) {
      console.log('⚠️ Call already ended, skipping cleanup');
      return;
    }
    
    setCallEnded(true);
    setCallAccepted(false);
    setIsConnected(false);
    setCall({ calling: false, isInitiator: false });
    
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    // Clear remote video
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    // Only emit end event if we haven't already ended
    if (socket && !callEnded) {
      console.log('📤 Emitting call end event');
      socket.emit('video:end-call', { roomId, consultationId });
    }

    // Call onCallEnd only once
    setTimeout(() => {
      onCallEnd();
    }, 100);
  }, [socket, roomId, consultationId, onCallEnd, callEnded]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        console.log('📹 Video toggled:', videoTrack.enabled);
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
        console.log('🎤 Audio toggled:', audioTrack.enabled);
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

    console.log('💬 Sending chat message:', chatData);
    socket.emit('video:simple-peer-chat', chatData);
  }, [socket, roomId, consultationId, userRole]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('🧹 Cleaning up Simple Peer WebRTC...');
      
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
          console.log(`🛑 Stopped ${track.kind} track`);
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
