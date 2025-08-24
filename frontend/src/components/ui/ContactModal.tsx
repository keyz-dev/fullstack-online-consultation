import React from "react";
import { X } from "lucide-react";

interface ContactType {
  id: string;
  label: string;
  type: string;
}

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (contactType: ContactType) => void;
  contactTypes: ContactType[];
  usedContactTypes?: string[];
}

const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  contactTypes,
  usedContactTypes = [],
}) => {
  const handleContactTypeSelect = (contactType: ContactType) => {
    onAdd(contactType);
    onClose();
  };

  // Filter out already used contact types
  const availableContactTypes = contactTypes.filter(
    (contactType) => !usedContactTypes.includes(contactType.label)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Add Contact Information
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="space-y-2">
          {availableContactTypes.length > 0 ? (
            availableContactTypes.map((contact) => (
              <button
                key={contact.id}
                onClick={() => handleContactTypeSelect(contact)}
                className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 text-gray-900 dark:text-white"
              >
                {contact.label}
              </button>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                All contact types have been added.
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                Remove existing ones to add different types.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
