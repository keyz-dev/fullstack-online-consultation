import React from 'react';
import { ChatPanel } from './ChatPanel';
import { NotesPanel } from './NotesPanel';

interface ChatMessage {
  roomId: string;
  consultationId: string;
  message: string;
  timestamp: string;
  senderRole: string;
  sent: boolean;
}

interface SidePanelProps {
  showNotes: boolean;
  showChat: boolean;
  userRole: string;
  chatMessages: ChatMessage[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  sendMessage: () => void;
  notes: string;
  setNotes: (notes: string) => void;
  saveNotes: () => void;
  setShowNotes: (show: boolean) => void;
  setShowChat: (show: boolean) => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  showNotes,
  showChat,
  userRole,
  chatMessages,
  newMessage,
  setNewMessage,
  sendMessage,
  notes,
  setNotes,
  saveNotes,
  setShowNotes,
  setShowChat,
}) => {
  if (!showNotes && !showChat) return null;

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
              showNotes
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-b-2 border-blue-500"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Notes
          </button>
        )}
        <button
          onClick={() => {
            setShowChat(true);
            setShowNotes(false);
          }}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            showChat
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-b-2 border-blue-500"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Chat
        </button>
      </div>

      {/* Panel Content */}
      {showChat && (
        <ChatPanel
          chatMessages={chatMessages}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessage={sendMessage}
          userRole={userRole}
        />
      )}

      {showNotes && userRole === "doctor" && (
        <NotesPanel
          notes={notes}
          setNotes={setNotes}
          saveNotes={saveNotes}
        />
      )}
    </div>
  );
};
