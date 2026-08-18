import API from "./axios";

export interface Doctor {
  id?: string;
  name: string;
  title: string;
  specialization: string;
  yearsOfExperience: number;
  consultationFees: {
    amount: number;
    currency: string;
    formatted?: string;
  };
  bio: string;
  image: {
    url: string;
    altText: string;
  };
}

export interface WorkingDay {
  day: string;
  enabled: boolean;
  morningStart: string;
  morningEnd: string;
  eveningStart: string;
  eveningEnd: string;
}

export interface AppointmentConfig {
  slotDurationMinutes: number;
  maxAdvanceBookingDays: number;
  instantBookingEnabled: boolean;
}

export interface ContactInfo {
  phone: string;
  email: string;
  clinicAddress: string;
}

export interface Settings {
  doctor: Doctor;
  workingHours: WorkingDay[];
  contact: ContactInfo;
  appointmentConfig: AppointmentConfig;
}

export const getSettings = async (): Promise<Settings> => {
  const response = await API.get("/settings");

  return response.data.data;
};

export const saveSettings = async (
  data: Settings
) => {
  const response = await API.put(
    "/settings",
    data
  );

  return response.data;
};