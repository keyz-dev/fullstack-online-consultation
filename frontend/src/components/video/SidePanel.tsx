import React from 'react';
import { ChatPanel } from './ChatPanel';
import { NotesPanel } from './NotesPanel';
import { FileSharePanel } from './FileSharePanel';
import { QuickActionsPanel } from './QuickActionsPanel';

interface ChatMessage {
  roomId: string;
  consultationId: string;
  message: string;
  timestamp: string;
  senderRole: string;
  sent: boolean;
}

interface SharedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

interface SidePanelProps {
  showNotes: boolean;
  showChat: boolean;
  showFiles: boolean;
  showActions: boolean;
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
  setShowFiles: (show: boolean) => void;
  setShowActions: (show: boolean) => void;
  // File sharing props
  sharedFiles: SharedFile[];
  onFileUpload: (files: FileList) => void;
  onFileRemove: (fileId: string) => void;
  isUploading: boolean;
  // Quick actions props
  patientInfo?: any;
  onWritePrescription: () => void;
  onViewHistory: () => void;
  onEmergencyCall: () => void;
  onTakeScreenshot: () => void;
  onToggleRecording: () => void;
  isRecording: boolean;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  showNotes,
  showChat,
  showFiles,
  showActions,
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
  setShowFiles,
  setShowActions,
  sharedFiles,
  onFileUpload,
  onFileRemove,
  isUploading,
  patientInfo,
  onWritePrescription,
  onViewHistory,
  onEmergencyCall,
  onTakeScreenshot,
  onToggleRecording,
  isRecording,
}) => {
  if (!showNotes && !showChat && !showFiles && !showActions) return null;

  return (
    <div className="w-full sm:w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Panel Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => {
            setShowChat(true);
            setShowNotes(false);
            setShowFiles(false);
            setShowActions(false);
          }}
          className={`flex-1 px-3 py-3 text-xs font-medium ${
            showChat
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-b-2 border-blue-500"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Chat
        </button>
        
        <button
          onClick={() => {
            setShowFiles(true);
            setShowChat(false);
            setShowNotes(false);
            setShowActions(false);
          }}
          className={`flex-1 px-3 py-3 text-xs font-medium ${
            showFiles
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-b-2 border-blue-500"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Files
        </button>

        {userRole === "doctor" && (
          <button
            onClick={() => {
              setShowNotes(true);
              setShowChat(false);
              setShowFiles(false);
              setShowActions(false);
            }}
            className={`flex-1 px-3 py-3 text-xs font-medium ${
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
            setShowActions(true);
            setShowChat(false);
            setShowNotes(false);
            setShowFiles(false);
          }}
          className={`flex-1 px-3 py-3 text-xs font-medium ${
            showActions
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-b-2 border-blue-500"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Actions
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

      {showFiles && (
        <FileSharePanel
          sharedFiles={sharedFiles}
          onFileUpload={onFileUpload}
          onFileRemove={onFileRemove}
          userRole={userRole}
          isUploading={isUploading}
        />
      )}

      {showNotes && userRole === "doctor" && (
        <NotesPanel
          notes={notes}
          setNotes={setNotes}
          saveNotes={saveNotes}
        />
      )}

      {showActions && (
        <QuickActionsPanel
          userRole={userRole}
          patientInfo={patientInfo}
          onWritePrescription={onWritePrescription}
          onViewHistory={onViewHistory}
          onEmergencyCall={onEmergencyCall}
          onTakeScreenshot={onTakeScreenshot}
          onToggleRecording={onToggleRecording}
          isRecording={isRecording}
        />
      )}
    </div>
  );
};
