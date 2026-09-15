// Configured for local development or production
export const API_BASE_URL = window.location.hostname === "localhost" 
  ? "http://localhost:8000/api" 
  : "/api";

export const getHeaders = () => {
  return {
    "Accept": "application/json",
  };
};
