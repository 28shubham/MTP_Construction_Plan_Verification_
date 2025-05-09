import React, { useState, useEffect, useCallback } from "react";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  BrowserRouter,
} from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRegistration from "./pages/AdminRegistration";
import RefreshHandler from "./RefreshHandler";
import VerificationForm from "./pages/VerificationForm";
import VerificationImage from "./pages/VerificationImage";
import { isAuthenticated } from "./services/auth";
import { isAdminAuthenticated } from "./services/adminService";
import { setAuthErrorHandler } from "./services/api";
import AdminListPage from "./pages/AdminListPage";
import ConstructionRules from "./pages/ConstructionRules";
import BuildingPlanForm from "./pages/BuildingPlanForm";
import BuildingPlanList from "./pages/BuildingPlanList";
import BuildingPlanDashboard from "./pages/BuildingPlanDashboard";
import BuildingPlanDetail from "./pages/BuildingPlanDetail";
import AdminSettings from "./pages/AdminSettings";
import AdminVerifications from "./pages/AdminVerifications";
import EnhancedVerificationImage from "./pages/EnhancedVerificationImage";
import VerificationHistoryPage from "./pages/VerificationHistory";
import MakePdf from "./pages/MakePdf";
import BuildingRules from "./pages/BuildingRules";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function App() {
  const [isAuthState, setIsAuthState] = useState(isAuthenticated());
  const [isAdminAuthState, setIsAdminAuthState] = useState(
    isAdminAuthenticated()
  );
  const navigate = useNavigate();

  // Move checkAuth to useCallback to prevent recreation on each render
  const checkAuth = useCallback(() => {
    const currentAuthState = isAuthenticated();
    const currentAdminAuthState = isAdminAuthenticated();

    // Check user auth state
    if (currentAuthState !== isAuthState) {
      setIsAuthState(currentAuthState);
      if (
        !currentAuthState &&
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/signup" &&
        window.location.pathname !== "/" &&
        !window.location.pathname.startsWith("/admin")
      ) {
        navigate("/login");
      }
    }

    // Check admin auth state
    if (currentAdminAuthState !== isAdminAuthState) {
      setIsAdminAuthState(currentAdminAuthState);
      if (
        !currentAdminAuthState &&
        window.location.pathname.startsWith("/admin") &&
        window.location.pathname !== "/admin/login"
      ) {
        navigate("/admin/login");
      }
    }
  }, [isAuthState, isAdminAuthState, navigate]);

  useEffect(() => {
    checkAuth();
    window.addEventListener("storage", checkAuth);
    const authCheckInterval = setInterval(checkAuth, 3000);

    return () => {
      window.removeEventListener("storage", checkAuth);
      clearInterval(authCheckInterval);
    };
  }, [checkAuth]);

  useEffect(() => {
    setAuthErrorHandler(() => navigate("/login"));
  }, [navigate]);

  const PrivateRoute = ({ element }) => {
    return isAuthState ? element : <Navigate to="/login" />;
  };

  const AdminRoute = ({ element }) => {
    return isAdminAuthState ? element : <Navigate to="/admin/login" />;
  };

  const ProtectedRoute = ({ element }) => {
    const isLoggedIn = localStorage.getItem("token") !== null;

    if (!isLoggedIn) {
      // Redirect to login page if not logged in
      return <Navigate to="/login" />;
    }

    return element;
  };

  return (
    <div className="App">
      <RefreshHandler setIsAuthenticated={setIsAuthState} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        {/* User Routes */}
        <Route
          path="/login"
          element={
            isAuthState ? (
              <Navigate to="/home" />
            ) : (
              <Login setIsAuthenticated={setIsAuthState} />
            )
          }
        />
        <Route
          path="/signup"
          element={isAuthState ? <Navigate to="/home" /> : <Signup />}
        />
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route
          path="/VerificationForm"
          element={<PrivateRoute element={<VerificationForm />} />}
        />
        <Route
          path="/VerificationImage"
          element={<PrivateRoute element={<VerificationImage />} />}
        />
        <Route
          path="/building-plans"
          element={<PrivateRoute element={<BuildingPlanDashboard />} />}
        />
        <Route
          path="/building-plans/new"
          element={<PrivateRoute element={<BuildingPlanForm />} />}
        />
        <Route
          path="/building-plans/:id"
          element={<PrivateRoute element={<BuildingPlanDetail />} />}
        />
        <Route
          path="/building-rules"
          element={<PrivateRoute element={<BuildingRules />} />}
        />

        {/* Admin Routes */}
        <Route
          path="/admin/login"
          element={
            isAdminAuthState ? (
              <Navigate to="/admin/dashboard" />
            ) : (
              <AdminLogin />
            )
          }
        />
        <Route
          path="/admin/dashboard"
          element={<AdminRoute element={<AdminDashboard />} />}
        />
        <Route
          path="/admin/register-admin"
          element={<AdminRoute element={<AdminRegistration />} />}
        />
        <Route
          path="/admin/lists"
          element={<AdminRoute element={<AdminListPage />} />}
        />
        <Route
          path="/admin/construction-rules"
          element={<AdminRoute element={<ConstructionRules />} />}
        />
        <Route
          path="/admin/building-plans"
          element={<AdminRoute element={<BuildingPlanDashboard />} />}
        />
        <Route
          path="/admin/building-plans/new"
          element={<AdminRoute element={<BuildingPlanForm />} />}
        />
        <Route
          path="/admin/building-plans/:id"
          element={<AdminRoute element={<BuildingPlanDetail />} />}
        />
        <Route
          path="/admin/settings"
          element={<AdminRoute element={<AdminSettings />} />}
        />
        <Route
          path="/admin/verifications"
          element={<AdminRoute element={<AdminVerifications />} />}
        />
        <Route
          path="/verificationImage"
          element={<EnhancedVerificationImage />}
        />
        <Route
          path="/verification-history"
          element={<ProtectedRoute element={<VerificationHistoryPage />} />}
        />
        <Route
          path="/make-pdf"
          element={<PrivateRoute element={<MakePdf />} />}
        />
      </Routes>
    </div>
  );
}

export default App;
