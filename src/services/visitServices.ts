import type { CreateVisitDTO, TreatmentDTO, UpdateVisitDTO } from "../types";
import api from "./api";

const visitService = {
  /**
   * Create a new visit (Patient)
   */
  createVisit: async (visitData: CreateVisitDTO) => {
    const response = await api.post("/visits", visitData);
    return response.data;
  },

  /**
   * Get current user's visits
   */
  getMyVisits: async () => {
    const response = await api.get("/visits/my-visits");
    return response.data.visits;
  },

  /**
   * Get visit by ID
   */
  getVisitById: async (visitId: string) => {
    const response = await api.get(`/visits/${visitId}`);
    return response.data.visit;
  },

  /**
   * Start a visit (Doctor)
   */
  startVisit: async (visitId: string) => {
    const response = await api.post(`/visits/${visitId}/start`);
    return response.data;
  },

  /**
   * Update visit details (Doctor)
   */
  updateVisit: async (visitId: string, data: UpdateVisitDTO) => {
    const response = await api.put(`/visits/${visitId}`, data);
    return response.data;
  },

  /**
   * Add treatment to visit (Doctor)
   */
  addTreatment: async (visitId: string, treatmentData: TreatmentDTO) => {
    const response = await api.post(
      `/visits/${visitId}/treatments`,
      treatmentData
    );
    return response.data;
  },

  /**
   * Update treatment (Doctor)
   */
  updateTreatment: async (
    visitId: string,
    treatmentId: string,
    data: TreatmentDTO
  ) => {
    const response = await api.put(
      `/visits/${visitId}/treatments/${treatmentId}`,
      data
    );
    return response.data;
  },

  /**
   * Delete treatment (Doctor)
   */
  deleteTreatment: async (visitId: string, treatmentId: string) => {
    const response = await api.delete(
      `/visits/${visitId}/treatments/${treatmentId}`
    );
    return response.data;
  },

  /**
   * Complete visit (Doctor)
   */
  completeVisit: async (visitId: string) => {
    const response = await api.post(`/visits/${visitId}/complete`);
    return response.data;
  },

  /**
   * Cancel visit (Patient/Doctor)
   */
  cancelVisit: async (visitId: string) => {
    const response = await api.post(`/visits/${visitId}/cancel`);
    return response.data;
  },
};

export default visitService;
