import API from "./axios";

export interface Patient {
  _id: string;
  patientName: string;
  age: number;
  gender: string;
  mobileNumber: string;
  status:
    | "Pending"
    | "Completed"
    | "Cancelled";
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PatientsResponse {
  data: Patient[];
  pagination: Pagination;
}

export const getPatients = async (
  page = 1,
  limit = 10
): Promise<PatientsResponse> => {
  const response = await API.get(
    `/patient?page=${page}&limit=${limit}`
  );

  return response.data;
};