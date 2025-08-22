import React from "react";
import { ModalWrapper, Button } from "@/components/ui";
import { X, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  message?: string;
  itemName?: string;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  message = "Are you sure you want to delete this item?",
  itemName,
  loading = false,
  confirmText = "Delete",
  cancelText = "Cancel",
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      toast.success("Item deleted successfully");
    } catch (error) {
      console.error("Delete operation failed:", error);
      toast.error("Failed to delete item");
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper>
      <div className="p-6 w-full max-w-md relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          disabled={loading}
        >
          <X size={24} />
        </button>

        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {message}
            {itemName && (
              <span className="font-semibold text-gray-900 dark:text-white">
                {" "}
                &quot;{itemName}&quot;
              </span>
            )}
            ? This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            onClickHandler={handleClose}
            isDisabled={loading}
            additionalClasses="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
            text={cancelText}
          />
          <Button
            onClickHandler={handleConfirm}
            additionalClasses="dangerbtn"
            loading={loading}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white"
            text={confirmText}
          />
        </div>
      </div>
    </ModalWrapper>
  );
};

export default DeleteModal;
