// src/utils/api.ts
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://13.205.54.221";

// Helper to get auth headers
const getHeaders = () => {
  const token = localStorage.getItem("kisan_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth & OTP
  sendOtp: async (phone: string) => {
    const res = await fetch(`${BACKEND_URL}/api/auth/send-otp`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ phone }),
    });
    return res.json();
  },
  
  verifyOtp: async (phone: string, otp: string) => {
    const res = await fetch(`${BACKEND_URL}/api/auth/verify-otp`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ phone, otp }),
    });
    return res.json();
  },

  registerOtp: async (userData: any) => {
    const res = await fetch(`${BACKEND_URL}/api/auth/register-otp`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    return res.json();
  },

  getMe: async () => {
    const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
      headers: getHeaders(),
    });
    return res.json();
  }
};
