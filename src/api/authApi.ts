import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

export const loginDoctor = (data: {
  email: string;
  password: string;
}) =>
  API.post("/login", data);

export const forgotPassword = (email: string) =>
  API.post("/forgot-password", {
    email,
  });

export const resetPassword = (
  userId: string,
  token: string,
  password: string,
  confirmPassword: string
) => {
  return API.post(
    `/reset-password/${userId}/${token}`,
    {
      password,
      confirmPassword,
    }
  );
};

export default API;