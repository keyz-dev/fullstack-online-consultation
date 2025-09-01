"use client";

import React from "react";
import { Button, TextArea } from "@/components/ui";
import { MessageSquare, FileText } from "lucide-react";

interface ChatMessage {
  roomId: string;
  consultationId: string;
  message: string;
  timestamp: string;
  senderRole: string;
  sent: boolean;
}

interface SimpleSidePanelProps {
  showNotes: boolean;
  showChat: boolean;
  userRole: "doctor" | "patient";
  chatMessages: ChatMessage[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  sendMessage: () => void;
  notes: string;
  setNotes: (notes: string) => void;
  setShowNotes: (show: boolean) => void;
  setShowChat: (show: boolean) => void;
  onSaveNotes?: () => void;
}

const SimpleSidePanel: React.FC<SimpleSidePanelProps> = ({
  showNotes,
  showChat,
  userRole,
  chatMessages,
  newMessage,
  setNewMessage,
  sendMessage,
  notes,
  setNotes,
  setShowNotes,
  setShowChat,
  onSaveNotes,
}) => {
  const showSidePanel = showNotes || showChat;

  if (!showSidePanel) return null;

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Panel Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {userRole === "doctor" && (
          <button
            onClick={() => {
              setShowNotes(true);
              setShowChat(false);
            }}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              showNotes && !showChat
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" 
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Notes
          </button>
        )}
        <button
          onClick={() => {
            setShowChat(true);
            setShowNotes(false);
          }}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            showChat && !showNotes
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" 
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <MessageSquare className="w-4 h-4 inline mr-2" />
          Chat
        </button>
      </div>

      {/* Notes Panel */}
      {showNotes && userRole === "doctor" && (
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900 dark:text-white">
              Consultation Notes
            </h3>
            {onSaveNotes && (
              <button
                onClick={onSaveNotes}
                className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-md transition-colors"
              >
                Save Notes
              </button>
            )}
          </div>
          <div className="flex-1">
            <TextArea
              value={notes}
              onChangeHandler={(e) => setNotes(e.target.value)}
              placeholder="Enter consultation notes, diagnosis, treatment plans..."
              additionalClasses="h-full min-h-[300px] resize-none border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required={false}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Notes are auto-saved every 30 seconds and when the call ends
          </p>
        </div>
      )}

      {/* Chat Panel */}
      {showChat && (
        <div className="flex-1 flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-3">
              {chatMessages.map((msg, index) => (
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
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button
                onClickHandler={sendMessage}
                isDisabled={!newMessage.trim()}
                additionalClasses="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                text="Send"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleSidePanel;
