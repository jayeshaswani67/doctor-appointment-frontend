import API from "./axios";

export interface Appointment {
  _id: string;
  patientName: string;
  mobileNumber: string;
  appointmentDate: string;
  time: string;
  status: "Pending" | "Completed" | "Cancelled";
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CreateAppointmentData {
  patientName: string;
  mobileNumber: string;
  appointmentDate: string;
  time: string;
}
export interface AppointmentResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    token: number;
    patientName: string;
    age: number;
    mobileNumber: string;
    appointmentDate: string;
    time: string;
    status: string;
  };
}
export interface UpdateAppointmentStatusResponse {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    status: string;
  }
}

export const getAppointments = async (
  page = 1,
  limit = 10
): Promise<{
  data: Appointment[];
  pagination: Pagination;
}> => {
  const response = await API.get(
    `/appointment?page=${page}&limit=${limit}`
  );

  return response.data;
};

export const createAppointment = async (
  data: CreateAppointmentData
): Promise<Appointment> => {
  const response = await API.post(
    "/appointment",
    data
  );

  return response.data;
};

export const updateAppointmentStatus = async (
  appointmentId: string,
  status: "Pending" | "Booked" | "Completed" | "Cancelled"
): Promise<UpdateAppointmentStatusResponse> => {
  const response = await API.put(
    `/appointment/${appointmentId}/status`,
    {
      status,
    }
  );

  return response.data;
};


