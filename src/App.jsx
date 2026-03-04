import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import api from "./services/api";

// Pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import LandingPage from "./pages/landing/LandingPage";
import Signup from "./pages/auth/Signup";
import PricingPage from "./pages/landing/PricingPage";

// Components
import MarketingNavbar from "./components/MarketingNavbar";
import ErrorBoundary from "./components/ErrorBoundary";

import ProductsPage from "./pages/landing/ProductsPage";
import SolutionsPage from "./pages/landing/SolutionsPage";
import ResourcesPage from "./pages/landing/ResourcesPage";

import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";

// Layout wrapper for marketing pages to include Navbar
function MarketingLayout({ children }) {
  return (
    <>
      <MarketingNavbar />
      {children}
    </>
  );
}

// Redirect logged in users away from auth pages
function PublicRoute({ children }) {
    const { user, loading } = useAuth();

    if (!loading && user) {
        return <Navigate to="/app" replace />;
    }
    
    return children;
}

export default function App() {
  // 🧪 STEP 1.4 — Sanity Test (Backend Connection)
  useEffect(() => {
    api.get("/health")
      .then((res) => {
        console.log("✅ Backend Connected:", res.data);
      })
      .catch((err) => {
        console.error("❌ Backend Connection Failed:", err.message);
      });
  }, []);

  return (
    <BrowserRouter>
      {/* AuthProvider is actually wrapped in main.jsx */}
      <RoutesWrapper />
    </BrowserRouter>
  );
}

function RoutesWrapper() {
    return (
        <Routes>
            {/* Public Marketing Routes */}
            <Route path="/" element={
                <MarketingLayout>
                    <LandingPage />
                </MarketingLayout>
            } />
            
            <Route path="/products" element={
                <MarketingLayout>
                    <ProductsPage />
                </MarketingLayout>
            } />

            <Route path="/solutions" element={
                <MarketingLayout>
                    <SolutionsPage />
                </MarketingLayout>
            } />

            <Route path="/pricing" element={
                <MarketingLayout>
                    <PricingPage />
                </MarketingLayout>
            } />
            
            <Route path="/resources" element={
                <MarketingLayout>
                    <ResourcesPage />
                </MarketingLayout>
            } />

            {/* Auth Routes */}
            <Route path="/login" element={
                <PublicRoute>
                     <MarketingNavbar />
                    <Login />
                </PublicRoute>
            } />
            <Route path="/signup" element={
                <PublicRoute>
                     <MarketingNavbar />
                    <Signup />
                </PublicRoute>
            } />
            <Route path="/forgot-password" element={
                <PublicRoute>
                     <MarketingNavbar />
                    <ForgotPassword />
                </PublicRoute>
            } />
            <Route path="/reset-password" element={
                <PublicRoute>
                     <MarketingNavbar />
                    <ResetPassword />
                </PublicRoute>
            } />

            {/* Protected App Routes */}
            <Route path="/app/*" element={
                <ProtectedRoute>
                    <ErrorBoundary>
                        <Dashboard />
                    </ErrorBoundary>
                </ProtectedRoute>
            } />

            {/* Catch all - 404 to Home or App */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
