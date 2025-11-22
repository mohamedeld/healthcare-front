import type { IDoctor, IUser } from "./auth";

export interface Visit {
  id: string;
  patient: IUser;
  doctor: IDoctor;
  date: string; // ISO date string
  reason: string;
  chiefComplaint: string;
  notes?: string;
  treatments?: Treatment[];
  scheduledDate: string; // ISO date string
  totalAmount: string;
  _id: string;
  diagnosis: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  paymentStatus: "pending" | "partial" | "paid";
}
export interface CreateVisitDTO {
  doctorId: string;
  scheduledDate: string; // ISO date string
  chiefComplaint?: string;
}
export interface UpdateVisitDTO {
  diagnosis?: string;
  notes?: string;
  chiefComplaint?: string;
}

export interface VisitResponse {
  visit: Visit;
}
export interface VisitsListResponse {
  visits: Visit[];
}
export interface Treatment {
  id: string;
  _id: string;
  visitId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  description: string;
  medication?: string;
  dosage?: string;
  category?:
    | "consultation"
    | "medication"
    | "procedure"
    | "lab_test"
    | "imaging"
    | "other";
  totalPrice: number;
}
export interface TreatmentDTO {
  description?: string;
  medication?: string;
  dosage?: string;
  unitPrice: number;
  quantity: number;
  category?:
    | "consultation"
    | "medication"
    | "procedure"
    | "lab_test"
    | "imaging"
    | "other";
}
export interface TreatmentResponse {
  treatment: Treatment;
}
export interface TreatmentsListResponse {
  treatments: Treatment[];
}
export interface CompleteVisitResponse {
  message: string;
}
export interface CancelVisitResponse {
  message: string;
}
