import React, { useState } from "react";
import ContactModal from "./ContactModal";
import { Input, PhoneInput } from "./index";
import { Trash2, Plus } from "lucide-react";

interface ContactField {
  id: string;
  label: string;
  type: string;
  value: string;
}

interface ContactType {
  id: string;
  label: string;
  type: string;
}

interface ContactInfoProps {
  contactFields: ContactField[];
  setContactFields: (fields: ContactField[]) => void;
  contactTypes: ContactType[];
  errors?: Record<string, any>;
}

const ContactInfo: React.FC<ContactInfoProps> = ({
  contactFields,
  setContactFields,
  contactTypes,
  errors,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if all contact types are used
  const usedContactTypes = contactFields.map((field) => field.label);
  const hasAvailableTypes = contactTypes.some(
    (contactType) => !usedContactTypes.includes(contactType.label)
  );

  const handleContactFieldChange = (index: number, value: string) => {
    setContactFields(
      contactFields.map((field, i) =>
        i === index ? { ...field, value } : field
      )
    );
  };

  const handleAddContactField = (contactType: ContactType) => {
    setContactFields([
      ...contactFields,
      {
        id: contactType.id,
        label: contactType.label,
        type: contactType.type,
        value: "",
      },
    ]);
  };

  const removeContactField = (index: number) => {
    setContactFields(contactFields.filter((_, i) => i !== index));
  };

  return (
    <>
      <section className="">
        <div className="space-y-4 sm:space-y-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dynamic Contact Fields */}
          {contactFields.map((field, index) => {
            const isPhoneField =
              field.type === "tel" ||
              field.label.toLowerCase().includes("phone") ||
              field.label.toLowerCase().includes("whatsapp");

            return (
              <div key={index} className="relative">
                {isPhoneField ? (
                  <PhoneInput
                    label={field.label}
                    name={`contact-${field.id}`}
                    value={field.value}
                    error={errors?.contactFields?.[index]?.value}
                    onChangeHandler={(e) =>
                      handleContactFieldChange(index, e.target.value)
                    }
                    placeholder={`Enter your ${
                      field?.label?.toLowerCase() || "phone number"
                    }`}
                  />
                ) : (
                  <Input
                    label={field.label}
                    name={`contact-${field.id}`}
                    type={field.type}
                    value={field.value}
                    error={errors?.contactFields?.[index]?.value}
                    onChangeHandler={(e) =>
                      handleContactFieldChange(index, e.target.value)
                    }
                    placeholder={`Enter your ${
                      field?.label?.toLowerCase() || "contact information"
                    }`}
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeContactField(index)}
                  className="absolute top-2/3 -translate-y-1/2 right-3 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors z-10 flex items-center justify-center w-6 h-6 cursor-pointer"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            );
          })}

          {/* Add Contact Information Button */}
          {hasAvailableTypes ? (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors mb-4 sm:mb-6 cursor-pointer text-sm"
            >
              <Plus size={14} className="mr-1" />
              Add Contact Information
            </button>
          ) : (
            <div className="text-center py-2 mb-4 sm:mb-6">
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                All contact types have been added
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                Remove existing ones to add different types
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddContactField}
        contactTypes={contactTypes}
        usedContactTypes={usedContactTypes}
      />
    </>
  );
};

export default ContactInfo;
