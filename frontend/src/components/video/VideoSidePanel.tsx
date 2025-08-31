"use client";

import React from "react";
import { FileText, MessageSquare } from "lucide-react";
import VideoChat from "./VideoChat";
import VideoNotes from "./VideoNotes";

interface ChatMessage {
  message: string;
  timestamp: string;
  senderRole: string;
  sent: boolean;
}

interface VideoSidePanelProps {
  isVisible: boolean;
  showNotes: boolean;
  showChat: boolean;
  userRole: "doctor" | "patient";
  notes: string;
  chatMessages: ChatMessage[];
  newMessage: string;
  onNotesChange: (notes: string) => void;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onToggleNotes: () => void;
  onToggleChat: () => void;
}

const VideoSidePanel: React.FC<VideoSidePanelProps> = ({
  isVisible,
  showNotes,
  showChat,
  userRole,
  notes,
  chatMessages,
  newMessage,
  onNotesChange,
  onMessageChange,
  onSendMessage,
  onToggleNotes,
  onToggleChat,
}) => {
  if (!isVisible) return null;

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Panel Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {userRole === "doctor" && (
          <button
            onClick={onToggleNotes}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              showNotes 
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" 
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Notes
          </button>
        )}
        <button
          onClick={onToggleChat}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            showChat 
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" 
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <MessageSquare className="w-4 h-4 inline mr-2" />
          Chat
        </button>
      </div>

      {/* Notes Panel */}
      <VideoNotes
        isVisible={showNotes && userRole === "doctor"}
        notes={notes}
        onNotesChange={onNotesChange}
      />

      {/* Chat Panel */}
      <VideoChat
        isVisible={showChat}
        messages={chatMessages}
        newMessage={newMessage}
        onMessageChange={onMessageChange}
        onSendMessage={onSendMessage}
        onToggleChat={onToggleChat}
      />
    </div>
  );
};

export default VideoSidePanel;