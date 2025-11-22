import type {
  IChangePassword,
  ILoginCredentials,
  IRegisterCredentials,
  IUser,
} from "../types";
import api from "./api";

const authService = {
  /**
   * Login user
   */
  login: async (credentials: ILoginCredentials) => {
    const response = await api.post("/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * Register new user
   */
  register: async (userData: IRegisterCredentials) => {
    const response = await api.post("/auth/register", userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  /**
   * Get current user
   */
  getCurrentUser: async (): Promise<IUser> => {
    const response = await api.get("/auth/me");
    localStorage.setItem("user", JSON.stringify(response.data.user));
    return response.data.user;
  },

  /**
   * Get all doctors
   */
  getDoctors: async () => {
    const response = await api.get("/auth/doctors");
    return response.data.doctors;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: IUser) => {
    const response = await api.put("/auth/profile", data);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (data: IChangePassword) => {
    const response = await api.put("/auth/change-password", data);
    return response.data;
  },

  /**
   * Get stored user from localStorage
   */
  getStoredUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};

export default authService;
