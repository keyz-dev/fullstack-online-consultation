import React from 'react';
import Button from '../ui/Button';

interface NotesPanelProps {
  notes: string;
  setNotes: (notes: string) => void;
  saveNotes: () => void;
}

export const NotesPanel: React.FC<NotesPanelProps> = ({
  notes,
  setNotes,
  saveNotes,
}) => {
  return (
    <div className="flex-1 flex flex-col">
      {/* Notes Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Consultation Notes
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Private notes (only visible to you)
        </p>
      </div>

      {/* Notes Content */}
      <div className="flex-1 p-4">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add your consultation notes here..."
          className="w-full h-full resize-none border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Save Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          onClickHandler={saveNotes}
          additionalClasses="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
          text="Save Notes"
        />
      </div>
    </div>
  );
};
