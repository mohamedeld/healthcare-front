/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./api";

const financeService = {
  /**
   * Search visits with filters
   */
  searchVisits: async (filters = {} as any) => {
    const params = new URLSearchParams();

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });

    const response = await api.get(`/finance/visits?${params.toString()}`);
    return response.data;
  },

  /**
   * Get visit details
   */
  getVisitDetails: async (visitId: string) => {
    const response = await api.get(`/finance/visits/${visitId}`);
    return response.data.visit;
  },

  /**
   * Update payment status
   */
  updatePaymentStatus: async (visitId: string, paymentStatus: string) => {
    const response = await api.put(`/finance/visits/${visitId}/payment`, {
      paymentStatus,
    });
    return response.data;
  },

  /**
   * Get dashboard statistics
   */
  getDashboardStats: async () => {
    const response = await api.get("/finance/dashboard");
    return response.data.dashboard;
  },

  /**
   * Export visits data
   */
  exportVisits: async (filters = {} as any) => {
    const params = new URLSearchParams();

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });

    const response = await api.get(`/finance/export?${params.toString()}`);
    return response.data.data;
  },
};

export default financeService;
