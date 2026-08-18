import API from "./axios";

export interface Slot {
  slotId: string;
  startTime: string;
  endTime: string;
}

export interface DaySlots {
  date: string;
  day?: string;
  availableSlots: Slot[];
  bookedSlots: Slot[];
}

export interface DoctorInfo {
  id: string;
  name: string;
  title: string;
  specialization: string;
  qualifications: string;
  yearsOfExperience: number;

  consultationFees: {
    amount: number;
    currency: string;
    formatted: string;
  };

  bio: string;

  image: {
    url: string;
    altText: string;
  };

  contactInfo: {
    phone: string;
    email: string;
    clinicAddress?: string;

  call: {
    phone:string;
  };

    socialLinks?: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
    };
  };

  workingHours: {
    day: string;
    enabled: boolean;
    morningStart?: string;
    morningEnd?: string;
    eveningStart?: string;
    eveningEnd?: string;
  }[];
}

export interface LandingData {
  doctorInfo: DoctorInfo;

  appointments: {
    today: DaySlots;
    tomorrow: DaySlots;
    nextDay: DaySlots;
  };
}

export interface LandingResponse {
  success: boolean;
  data: LandingData;
}

export const getLandingPage =
  async (): Promise<LandingResponse> => {

    const response =
      await API.get("/public/landing");

    return response.data;
  };