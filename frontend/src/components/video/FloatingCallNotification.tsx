'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, PhoneOff, User, Clock, Video, Stethoscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';

interface IncomingCallData {
  consultationId: string;
  roomId: string;
  doctorName: string;
  doctorSpecialty: string;
  appointmentDate: string;
  appointmentTime: string;
  patientName: string;
}

interface FloatingCallNotificationProps {
  isVisible: boolean;
  callData: IncomingCallData | null;
  onAccept: (roomId: string, consultationId: string) => void;
  onDecline: () => void;
}

export const FloatingCallNotification: React.FC<FloatingCallNotificationProps> = ({
  isVisible,
  callData,
  onAccept,
  onDecline,
}) => {
  const [ringDuration, setRingDuration] = useState(0);
  const [audioStatus, setAudioStatus] = useState<'loading' | 'ready' | 'fallback' | 'blocked'>('loading');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize ringtone audio
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        // Create audio element for ringtone
        const audio = new Audio();
        
        // Set up error handling before setting src
        audio.addEventListener('error', (e) => {
          console.error('❌ Ringtone audio failed to load:', e);
          console.error('❌ Audio error details:', {
            error: audio.error,
            networkState: audio.networkState,
            readyState: audio.readyState,
            src: audio.src
          });
          
          // Try fallback with data URL beep sound
          createBeepTone();
        });
        
        // Set up success handler
        audio.addEventListener('canplaythrough', () => {
          setAudioStatus('ready');
        });
        
        audio.addEventListener('loadeddata', () => {
        });
        
        // Configure audio
        audio.loop = true;
        audio.volume = 0.7;
        audio.preload = 'auto';
        
        // Set source
        audio.src = "/sounds/incoming-call.mp3";
        
        // Try to load the audio
        audio.load();
        
        audioRef.current = audio;
        
      } catch (error) {
        console.error('❌ Failed to initialize audio:', error);
        createBeepTone();
      }
    };

    // Create a simple beep tone as fallback
    const createBeepTone = () => {
      try {
        // Create a simple beep using Web Audio API
        const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        
        const createBeep = () => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
        };
        
        // Create a mock audio object that plays beeps
        const mockAudio = {
          play: () => {
            createBeep();
            return Promise.resolve();
          },
          pause: () => {},
          currentTime: 0,
          loop: true,
          volume: 0.7,
          _ringtoneInterval: null as NodeJS.Timeout | null
        };
        audioRef.current = mockAudio as unknown as HTMLAudioElement;
        
        console.log('✅ Fallback beep tone created');
        setAudioStatus('fallback');
      } catch (error) {
        console.error('❌ Failed to create beep tone:', error);
        audioRef.current = null;
      }
    };

    initializeAudio();

    return () => {
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        } catch (e) {
          console.log('Audio cleanup error (expected):', e);
        }
        audioRef.current = null;
      }
    };
  }, []);

  const stopRingtone = useCallback(() => {
    if (audioRef.current) {
      try {
        // Clear any ringtone interval
        const audioWithInterval = audioRef.current as HTMLAudioElement & { _ringtoneInterval?: NodeJS.Timeout | null };
        if (audioWithInterval._ringtoneInterval) {
          clearInterval(audioWithInterval._ringtoneInterval);
          audioWithInterval._ringtoneInterval = null;
        }
        
        // Stop the audio
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        console.log('🔇 Ringtone stopped');
      } catch (error) {
        console.log('Ringtone stop error (expected):', error);
      }
    }
  }, []);

  // Handle ringtone when call comes in
  useEffect(() => {
    if (isVisible && callData && audioRef.current) {
      console.log('🔔 Starting ringtone for incoming call...');
      
      // Start ringtone with comprehensive error handling
      const startRingtone = async () => {
        try {
          // Create a repeating interval for beep sounds if using fallback
          let ringtoneInterval: NodeJS.Timeout | null = null;
          
          const playPromise = audioRef.current!.play();
          
          if (playPromise !== undefined) {
            await playPromise;
            console.log('✅ Ringtone started successfully');
          } else {
            // For our custom beep tone, set up interval
            ringtoneInterval = setInterval(() => {
              if (audioRef.current && isVisible) {
                audioRef.current.play().catch(console.error);
              }
            }, 1000); // Beep every second
          }
          
          // Store interval for cleanup
          const audioWithInterval = audioRef.current as HTMLAudioElement & { _ringtoneInterval?: NodeJS.Timeout | null };
          audioWithInterval._ringtoneInterval = ringtoneInterval;
          
        } catch (error) {
          console.log('🔔 Ringtone autoplay prevented:', error);
          
          // Enhanced fallback: Try multiple approaches
          const tryPlayOnInteraction = () => {
            if (audioRef.current) {
              audioRef.current.play().then(() => {
                console.log('✅ Ringtone started after user interaction');
              }).catch(console.error);
            }
          };
          
          // Try on various user interactions
          const interactionEvents = ['click', 'keydown', 'touchstart', 'mousedown'];
          const cleanup = () => {
            interactionEvents.forEach(event => {
              document.removeEventListener(event, tryPlayOnInteraction);
            });
          };
          
          interactionEvents.forEach(event => {
            document.addEventListener(event, () => {
              tryPlayOnInteraction();
              cleanup();
            }, { once: true });
          });
          
          // Also try a visual notification since audio is blocked
          console.log('🔔 Audio blocked - relying on visual notification');
          setAudioStatus('blocked');
        }
      };
      
      startRingtone();
    } else {
      stopRingtone();
    }

    return () => {
      stopRingtone();
    };
  }, [isVisible, callData, stopRingtone]);

  // Ring timer
  useEffect(() => {
    if (!isVisible) {
      setRingDuration(0);
      return;
    }

    const interval = setInterval(() => {
      setRingDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible]);

  // Auto-decline after 60 seconds
  useEffect(() => {
    if (ringDuration >= 60) {
      stopRingtone();
      onDecline();
    }
  }, [ringDuration, onDecline, stopRingtone]);

  // Handle accept with ringtone stop
  const handleAccept = useCallback(() => {
    if (!callData) return;
    stopRingtone();
    onAccept(callData.roomId, callData.consultationId);
  }, [callData, onAccept, stopRingtone]);

  // Handle decline with ringtone stop
  const handleDecline = useCallback(() => {
    stopRingtone();
    onDecline();
  }, [onDecline, stopRingtone]);

  const formatRingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!callData) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100, y: -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-4 left-4 z-50 w-80 max-w-[calc(100vw-2rem)] sm:max-w-sm"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header with pulsing animation */}
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              <div className="relative flex items-center space-x-2">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">Incoming Video Call</p>
                  <div className="flex items-center justify-between">
                    <p className="text-white/80 text-xs flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatRingTime(ringDuration)}
                    </p>
                    {audioStatus === 'blocked' && (
                      <p className="text-yellow-300 text-xs">🔇 Click to enable sound</p>
                    )}
                    {audioStatus === 'fallback' && (
                      <p className="text-blue-300 text-xs">🔔 Beep tone</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                    Dr. {callData.doctorName}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs flex items-center">
                    <Stethoscope className="w-3 h-3 mr-1" />
                    {callData.doctorSpecialty}
                  </p>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Scheduled Appointment</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {callData.appointmentDate} at {callData.appointmentTime}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button
                  onClickHandler={handleAccept}
                  additionalClasses="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 text-sm font-medium"
                >
                  <Phone className="w-4 h-4" />
                  <span>Accept</span>
                </Button>
                
                <Button
                  onClickHandler={handleDecline}
                  additionalClasses="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 text-sm font-medium"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>Decline</span>
                </Button>
              </div>

              {/* Auto-decline warning */}
              {ringDuration > 45 && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-orange-600 dark:text-orange-400 text-center mt-2"
                >
                  Call will end in {60 - ringDuration} seconds
                </motion.p>
              )}
            </div>
          </div>

          {/* Subtle glow effect */}
          <div className="absolute inset-0 -z-10 bg-green-400/20 blur-xl rounded-xl animate-pulse"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
