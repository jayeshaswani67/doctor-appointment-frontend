import API from "./axios";

export interface DoctorProfile {
  name: string;
  specialization: string;
  email: string;
  mobile: string;
  qualification: string;
  experience: string;
  clinic: string;
  address: string;
  workingTime: string;
}

export const getProfile = () => {
  return API.get("/profile");
};

export const updateProfile = (data: DoctorProfile) => {
  return API.put("/profile", data);
};
export const uploadDoctorImage = (file: File) => {
  const formData = new FormData();

  formData.append("image", file);

  return API.post(
    "/profile/image",
    formData
  );
}