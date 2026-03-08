import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Login from "../pages/Login";
import ProtectedRoute from "../components/ProtectedRoute";

import Dashboard from "../pages/Dashboard";
import Attendance from "../pages/Attendance";
import AiAssistant from "../pages/AiAssistant";
import Requests from "../pages/Requests";
import Expenses from "../pages/Expenses";
import Profile from "../pages/Profile";
import Leave from "../pages/Leave";
import Payroll from "../pages/Payroll";
import Notifications from "../pages/Notifications";
import Documents from "../pages/Documents";
import Holidays from "../pages/Holidays";
import Support from "../pages/Support";
import Settings from "../pages/Settings";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "attendance", element: <Attendance /> },
      { path: "ai-assistant", element: <AiAssistant /> },
      { path: "requests", element: <Requests /> },
      { path: "profile", element: <Profile /> },
      { path: "leave", element: <Leave /> },
      { path: "payroll", element: <Payroll /> },
      { path: "notifications", element: <Notifications /> },
      { path: "documents", element: <Documents /> },
      { path: "holidays", element: <Holidays /> },
      { path: "expenses", element: <Expenses /> },
      { path: "support", element: <Support /> },
      { path: "settings", element: <Settings /> },
    ],
  },
  { path: "*", element: <Navigate to="/login" replace /> },
]);
