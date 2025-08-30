import React from 'react';
import { Send } from 'lucide-react';
import Button from '../ui/Button';

interface ChatMessage {
  roomId: string;
  consultationId: string;
  message: string;
  timestamp: string;
  senderRole: string;
  sent: boolean;
}

interface ChatPanelProps {
  chatMessages: ChatMessage[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  sendMessage: () => void;
  userRole: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  chatMessages,
  newMessage,
  setNewMessage,
  sendMessage,
  userRole,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.sent
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <p className="text-sm">{msg.message}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 resize-none border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            rows={2}
          />
          <Button
            onClickHandler={sendMessage}
            additionalClasses="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
