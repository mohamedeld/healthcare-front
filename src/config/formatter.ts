// ==================== formatters.js ====================
import { format, formatDistance, parseISO } from "date-fns";

/**
 * Format currency
 */
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

/**
 * Format date
 */
export const formatDate = (date: Date | string, formatStr = "MMM dd, yyyy") => {
  if (!date) return "";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

/**
 * Format date and time
 */
export const formatDateTime = (date: Date | string) => {
  return formatDate(date, "MMM dd, yyyy hh:mm a");
};

/**
 * Format relative time
 */
export const formatRelativeTime = (date: Date | string) => {
  if (!date) return "";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return formatDistance(dateObj, new Date(), { addSuffix: true });
};

/**
 * Format status badge
 */
export const formatStatus = (
  status: "scheduled" | "in_progress" | "completed" | "cancelled"
) => {
  const statusMap = {
    scheduled: { label: "Scheduled", className: "bg-blue-100 text-blue-800" },
    in_progress: {
      label: "In Progress",
      className: "bg-yellow-100 text-yellow-800",
    },
    completed: { label: "Completed", className: "bg-green-100 text-green-800" },
    cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800" },
  };
  return (
    statusMap[status] || {
      label: status,
      className: "bg-gray-100 text-gray-800",
    }
  );
};

/**
 * Format payment status badge
 */
export const formatPaymentStatus = (status: "pending" | "partial" | "paid") => {
  const statusMap = {
    pending: { label: "Pending", className: "bg-orange-100 text-orange-800" },
    partial: { label: "Partial", className: "bg-yellow-100 text-yellow-800" },
    paid: { label: "Paid", className: "bg-green-100 text-green-800" },
  };
  return (
    statusMap[status] || {
      label: status,
      className: "bg-gray-100 text-gray-800",
    }
  );
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string) => {
  if (!phone) return "";
  const cleaned = ("" + phone).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "+" + match[1] + " (" + match[2] + ") " + match[3] + "-" + match[4];
  }
  return phone;
};

/**
 * Truncate text
 */
export const truncateText = (text: string, maxLength = 100) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (value: number, total: number) => {
  if (total === 0) return 0;
  return ((value / total) * 100).toFixed(1);
};

// ==================== constants.js ====================

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  TIMEOUT: 30000,
};

/**
 * User Roles
 */
export const USER_ROLES = {
  PATIENT: "patient",
  DOCTOR: "doctor",
  FINANCE: "finance",
};

/**
 * Visit Status
 */
export const VISIT_STATUS = {
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

/**
 * Payment Status
 */
export const PAYMENT_STATUS = {
  PENDING: "pending",
  PARTIAL: "partial",
  PAID: "paid",
};

/**
 * Treatment Categories
 */
export const TREATMENT_CATEGORIES = [
  { value: "consultation", label: "Consultation" },
  { value: "medication", label: "Medication" },
  { value: "procedure", label: "Procedure" },
  { value: "lab_test", label: "Lab Test" },
  { value: "imaging", label: "Imaging" },
  { value: "other", label: "Other" },
];

/**
 * Query Keys for React Query
 */
export const QUERY_KEYS = {
  // Auth
  CURRENT_USER: ["currentUser"],
  DOCTORS: ["doctors"],

  // Visits
  MY_VISITS: ["myVisits"],
  VISIT_DETAIL: (id: string) => ["visit", id],

  // Finance
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  FINANCE_VISITS: (filters: any) => ["financeVisits", filters],
  FINANCE_DASHBOARD: ["financeDashboard"],
  VISIT_DETAIL_FINANCE: (id: string) => ["financeVisit", id],
};

/**
 * Cache Time Configuration (in milliseconds)
 */
export const CACHE_TIME = {
  SHORT: 1 * 60 * 1000, // 1 minute
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 15 * 60 * 1000, // 15 minutes
  VERY_LONG: 60 * 60 * 1000, // 1 hour
};

/**
 * Stale Time Configuration (in milliseconds)
 */
export const STALE_TIME = {
  SHORT: 30 * 1000, // 30 seconds
  MEDIUM: 2 * 60 * 1000, // 2 minutes
  LONG: 5 * 60 * 1000, // 5 minutes
  VERY_LONG: 30 * 60 * 1000, // 30 minutes
};

/**
 * Pagination
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  LIMITS: [10, 20, 50, 100],
};

/**
 * Date Formats
 */
export const DATE_FORMATS = {
  DISPLAY: "MMM dd, yyyy",
  DATETIME: "MMM dd, yyyy hh:mm a",
  INPUT: "yyyy-MM-dd",
  API: "yyyy-MM-dd'T'HH:mm:ss'Z'",
};

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  THEME: "theme",
  LANGUAGE: "language",
};

/**
 * Routes
 */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  PATIENT_DASHBOARD: "/patient",
  DOCTOR_DASHBOARD: "/doctor",
  FINANCE_DASHBOARD: "/finance",
};
