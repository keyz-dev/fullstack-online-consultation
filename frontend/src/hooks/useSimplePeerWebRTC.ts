import { useState, useRef, useEffect, useCallback } from 'react';
import Peer from 'simple-peer';
import { useSocketContext } from '@/contexts';

interface UseSimplePeerWebRTCProps {
  roomId: string;
  consultationId: string;
  userRole: 'doctor' | 'patient';
  onCallEnd: () => void;
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
  onCallEnd 
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
      console.log('👥 User joined room:', data.userId);
      setRemoteUserId(data.userId);
      
      // If we're the doctor (initiator), start the call
      if (userRole === 'doctor' && stream) {
        console.log('👨‍⚕️ Doctor initiating call to patient:', data.userId);
        setTimeout(() => {
          callUser(data.userId, data.name);
        }, 1000); // Give time for everything to be ready
      }
    };

    // Register socket events
    socket.on('video:call-user', handleIncomingCall);
    socket.on('video:call-accepted', handleCallAccepted);
    socket.on('video:call-ended', handleCallEnded);
    socket.on('video:user-joined', handleUserJoined);

    // Join room
    socket.emit('video:join-room', { roomId, consultationId });
    console.log('🏠 Joined room:', roomId);

    return () => {
      console.log('🧹 Cleaning up socket listeners');
      socket.off('video:call-user', handleIncomingCall);
      socket.off('video:call-accepted', handleCallAccepted);
      socket.off('video:call-ended', handleCallEnded);
      socket.off('video:user-joined', handleUserJoined);
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

    // Emit call end event
    if (socket) {
      socket.emit('video:end-call', { roomId, consultationId });
    }

    onCallEnd();
  }, [socket, roomId, consultationId, onCallEnd]);

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
    toggleAudio
  };
};
