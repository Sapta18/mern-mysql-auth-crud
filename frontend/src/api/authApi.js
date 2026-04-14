import API from "./axios";

export const forgotPassword = (data) =>
  API.post("/auth/forgot-password", data);