import api from "./index";

export interface ContactInformation {
  id: number;
  name: string;
  iconUrl: string;
  inputType: "phone" | "email" | "url" | "text" | "time";
  placeholder: string;
  validationPattern: string | null;
  isRequired: boolean;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactInformationData {
  name: string;
  iconUrl?: string;
  inputType: "phone" | "email" | "url" | "text" | "time";
  placeholder?: string;
  validationPattern?: string;
  isRequired?: boolean;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateContactInformationData
  extends Partial<CreateContactInformationData> {
  id?: number;
}

// Get all active contact information options (public)
export const getContactInformationOptions = async (): Promise<
  ContactInformation[]
> => {
  const response = await api.get("/contactInformation/options");
  return response.data.data;
};

// Admin endpoints
export const getAllContactInformation = async (): Promise<
  ContactInformation[]
> => {
  const response = await api.get("/contactInformation");
  return response.data.data;
};

export const getContactInformationById = async (
  id: number
): Promise<ContactInformation> => {
  const response = await api.get(`/contactInformation/${id}`);
  return response.data.data;
};

export const createContactInformation = async (
  data: CreateContactInformationData
): Promise<ContactInformation> => {
  const response = await api.post("/contactInformation", data);
  return response.data.data;
};

export const updateContactInformation = async (
  id: number,
  data: UpdateContactInformationData
): Promise<ContactInformation> => {
  const response = await api.put(`/contactInformation/${id}`, data);
  return response.data.data;
};

export const deleteContactInformation = async (id: number): Promise<void> => {
  await api.delete(`/contactInformation/${id}`);
};
