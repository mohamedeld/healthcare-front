import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useCurrentUser } from "./hooks";
import { LoadingSpinner, PatientDashboard, ProtectedRoute } from "./components";
import DoctorDashboard from "./components/Doctor/DoctorDashboard";
import FinanceDashboard from "./components/FinanceDashboard";
const LoginPage = lazy(() => import("./Pages/LoginPage"));
const RegisterPage = lazy(() => import("./Pages/RegisterPage"));

function App() {
  const { data: user, isLoading } = useCurrentUser();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="large" />
        </div>
      }
    >
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={user ? <Navigate to={`/${user.role}`} /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to={`/${user.role}`} /> : <RegisterPage />}
        />

        {/* Protected routes */}
        <Route
          path="/patient/*"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/*"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance/*"
          element={
            <ProtectedRoute allowedRoles={["finance"]}>
              <FinanceDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route
          path="/"
          element={
            user ? <Navigate to={`/${user.role}`} /> : <Navigate to="/login" />
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-gray-600 mb-4">Page not found</p>
                <a href="/" className="btn btn-primary">
                  Go Home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
