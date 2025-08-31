import React from 'react';
import { Wifi, WifiOff, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface ConnectionStatusProps {
  connectionState: RTCPeerConnectionState;
  isConnected: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  connectionState,
  isConnected,
}) => {
  const getStatusConfig = () => {
    switch (connectionState) {
      case 'connected':
        return {
          icon: <CheckCircle className="w-4 h-4 text-green-400" />,
          text: 'Connected',
          bgColor: 'bg-green-900/30',
          textColor: 'text-green-300',
        };
      case 'connecting':
        return {
          icon: <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />,
          text: 'Connecting...',
          bgColor: 'bg-yellow-900/30',
          textColor: 'text-yellow-300',
        };
      case 'disconnected':
        return {
          icon: <WifiOff className="w-4 h-4 text-orange-400" />,
          text: 'Reconnecting...',
          bgColor: 'bg-orange-900/30',
          textColor: 'text-orange-300',
        };
      case 'failed':
        return {
          icon: <XCircle className="w-4 h-4 text-red-400" />,
          text: 'Connection Failed',
          bgColor: 'bg-red-900/30',
          textColor: 'text-red-300',
        };
      default:
        return {
          icon: <Wifi className="w-4 h-4 text-gray-400" />,
          text: 'Initializing...',
          bgColor: 'bg-gray-900/30',
          textColor: 'text-gray-300',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg backdrop-blur-sm ${config.bgColor}`}>
      {config.icon}
      <span className={`text-sm font-medium ${config.textColor}`}>
        {config.text}
      </span>
    </div>
  );
};
