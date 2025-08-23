import React from "react";
import { ModalWrapper, Button } from "@/components/ui";
import { User } from "@/api/users";
import {
  X,
  Phone,
  Mail,
  MessageSquare,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";

interface UserContactModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserContactModal: React.FC<UserContactModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  if (!user) return null;

  const getContactInfo = () => {
    if (user.patient?.contactInfo) return user.patient.contactInfo;
    if (user.doctor?.contactInfo) return user.doctor.contactInfo;
    if (user.pharmacy?.contactInfo) return user.pharmacy.contactInfo;
    return null;
  };

  const contactInfo = getContactInfo();

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(`${field} copied to clipboard`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handlePhoneCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, "_blank");
  };

  const handleWhatsApp = (phoneNumber: string) => {
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanNumber}`, "_blank");
  };

  const handleTelegram = (username: string) => {
    const cleanUsername = username.startsWith("@")
      ? username.slice(1)
      : username;
    window.open(`https://t.me/${cleanUsername}`, "_blank");
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`, "_blank");
  };

  const contactMethods = [
    {
      type: "email",
      label: "Email",
      value: user.email,
      icon: Mail,
      action: () => handleEmail(user.email),
      actionLabel: "Send Email",
      canCopy: true,
    },
    ...(contactInfo?.phone
      ? [
          {
            type: "phone",
            label: "Phone",
            value: contactInfo.phone,
            icon: Phone,
            action: () => handlePhoneCall(contactInfo.phone),
            actionLabel: "Call",
            canCopy: true,
          },
        ]
      : []),
    ...(contactInfo?.whatsapp
      ? [
          {
            type: "whatsapp",
            label: "WhatsApp",
            value: contactInfo.whatsapp,
            icon: MessageSquare,
            action: () => handleWhatsApp(contactInfo.whatsapp),
            actionLabel: "Open WhatsApp",
            canCopy: true,
          },
        ]
      : []),
    ...(contactInfo?.telegram
      ? [
          {
            type: "telegram",
            label: "Telegram",
            value: contactInfo.telegram,
            icon: MessageSquare,
            action: () => handleTelegram(contactInfo.telegram),
            actionLabel: "Open Telegram",
            canCopy: true,
          },
        ]
      : []),
  ];

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Contact {user.name}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Contact Methods */}
        <div className="space-y-4">
          {contactMethods.length > 0 ? (
            contactMethods.map((method) => (
              <div
                key={method.type}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <method.icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {method.label}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {method.value}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {method.canCopy && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(method.value, method.label)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {copiedField === method.label ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={method.action}
                    className="flex items-center space-x-1"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>{method.actionLabel}</span>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No contact information available for this user.
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                You can still contact them via email: {user.email}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default UserContactModal;
