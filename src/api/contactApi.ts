import axios from "../api/axios.ts";

export interface ContactDto {
  fullName: string;
  email: string;
  mobileNumber: string;
  subject: string;
  message: string;
}

export interface Contact {
  _id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  subject: string;
  message: string;
  status?: "Unread" | "Replied";
  createdAt: string;
  updatedAt: string;
}

export interface ContactResponse {
  success: boolean;
  message?: string;
  data: Contact[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// CREATE CONTACT
export const createContact = async (
  data: ContactDto
) => {
  const response = await axios.post(
    "/contact",
    data
  );

  return response.data;
};

// GET CONTACTS WITH PAGINATION
export const getContacts = async (
  page: number = 1,
  limit: number = 10
): Promise<ContactResponse> => {

  const response = await axios.get<ContactResponse>(
    "/contact",
    {
      params: {
        page,
        limit,
      },
    }
  );

  return response.data;
};