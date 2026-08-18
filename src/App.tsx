import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";
import AdminLayout from "./components/Admin/AdminLayout";
import ProtectedRoute from "./components/Admin/ProtectedRoute";

import Home from "./pages/Home";

import Login from "./pages/Admin/Login";
import ForgotPassword from "./pages/Admin/ForgotPassword";
import ResetPassword from "./pages/Admin/ResetPassword";

import Dashboard from "./pages/Admin/Dashboard";
import Appointment from "./pages/Admin/Appointment";
import Patients from "./pages/Admin/Patients";
import Contact from "./pages/Admin/Contact";
import Slots from "./pages/Admin/Slots";
import Settings from "./pages/Admin/Settings";
import Profile from "./pages/Admin/Profile";

function App() {
  return (
    <Routes>
      {/* Website */}
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />
      <Route
        path="/reset-password/:userId/:token"
        element={<ResetPassword />}
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="dashboard"
          element={<Dashboard />}
        />

        <Route
          path="appointment"
          element={<Appointment />}
        />

        <Route
          path="patients"
          element={<Patients />}
        />

        <Route
          path="contact"
          element={<Contact />}
        />

        <Route
          path="slots"
          element={<Slots />}
        />
        <Route
          path="settings"
          element={<Settings />}
        />

        <Route
          path="profile"
          element={<Profile />}
        />

        {/* /admin -> /admin/dashboard */}
        <Route
          index
          element={<Navigate to="/admin/dashboard" replace />}
        />
      </Route>

      {/* Unknown Routes */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;