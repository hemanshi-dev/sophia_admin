import axios from "axios";
import { getCookie } from "./cookieManager";

const API_BASE_URL = "https://shuchiai.com/companion";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor for adding auth headers
apiClient.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("authorization") || getCookie("authToken");
    
    if (token) {
      // Clean the token
      token = typeof token === "string" ? token.replace(/^["'](.+)["']$/, "$1").trim() : token;
      
      // Ensure Bearer prefix
      if (typeof token === "string" && !token.toLowerCase().startsWith("bearer ")) {
        token = `Bearer ${token}`;
      }
      
      config.headers.Authorization = token;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper to handle loading and error reporting consistently
export const handleRequest = async (request, setLoading) => {
  if (setLoading) setLoading(true);
  try {
    const response = await request;
    if (setLoading) setLoading(false);
    return response.data;
  } catch (error) {
    if (setLoading) setLoading(false);
    console.error("API Error:", error);
    throw error;
  }
};

export default apiClient;
