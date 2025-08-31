"use client";

import React from "react";
import { Button } from "@/components/ui";
import { MessageSquare } from "lucide-react";

interface ChatMessage {
  message: string;
  timestamp: string;
  senderRole: string;
  sent: boolean;
}

interface VideoChatProps {
  isVisible: boolean;
  messages: ChatMessage[];
  newMessage: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onToggleChat: () => void;
}

const VideoChat: React.FC<VideoChatProps> = ({
  isVisible,
  messages,
  newMessage,
  onMessageChange,
  onSendMessage,
  onToggleChat,
}) => {
  if (!isVisible) return null;

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                  msg.sent
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                }`}
              >
                <p>{msg.message}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button
            onClickHandler={onSendMessage}
            isDisabled={!newMessage.trim()}
            additionalClasses="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
            text="Send"
          />
        </div>
      </div>
    </div>
  );
};

export default VideoChat;