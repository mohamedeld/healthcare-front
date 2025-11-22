import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import authService from "../services/authServices";
import { QUERY_KEYS, ROUTES, STALE_TIME } from "../config";
import { useCallback } from "react";

/**
 * Hook for user authentication
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.CURRENT_USER, data.user);
      toast.success("Login successful!");

      // Navigate based on user role
      switch (data.user.role) {
        case "patient":
          navigate(ROUTES.PATIENT_DASHBOARD);
          break;
        case "doctor":
          navigate(ROUTES.DOCTOR_DASHBOARD);
          break;
        case "finance":
          navigate(ROUTES.FINANCE_DASHBOARD);
          break;
        default:
          navigate(ROUTES.HOME);
      }
    },
    onError: (error) => {
      // Error already handled by interceptor
      console.error("Login error:", error);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.CURRENT_USER, data.user);
      toast.success("Registration successful!");

      // Navigate based on user role
      switch (data.user.role) {
        case "patient":
          navigate(ROUTES.PATIENT_DASHBOARD);
          break;
        case "doctor":
          navigate(ROUTES.DOCTOR_DASHBOARD);
          break;
        case "finance":
          navigate(ROUTES.FINANCE_DASHBOARD);
          break;
        default:
          navigate(ROUTES.HOME);
      }
    },
    onError: (error) => {
      console.error("Registration error:", error);
    },
  });

  const handleLogout = useCallback(() => {
    try {
      authService.logout(); // remove token
      queryClient.clear(); // clear react-query cache
      toast.success("Logged out successfully");

      window.location.href = ROUTES.LOGIN;
    } catch (error) {
      console.error("Logout failed", error);
    }
  }, [queryClient]);

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: handleLogout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
};

/**
 * Hook to get current user
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CURRENT_USER,
    queryFn: authService.getCurrentUser,
    staleTime: STALE_TIME.LONG,
    retry: 1,
    initialData: () => authService.getStoredUser(),
  });
};

/**
 * Hook to get all doctors
 */
export const useDoctors = () => {
  return useQuery({
    queryKey: QUERY_KEYS.DOCTORS,
    queryFn: authService.getDoctors,
    staleTime: STALE_TIME.MEDIUM,
  });
};

/**
 * Hook to update profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.CURRENT_USER, data.user);
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      console.error("Profile update error:", error);
    },
  });
};

/**
 * Hook to change password
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: authService.changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error) => {
      console.error("Change password error:", error);
    },
  });
};
