import React from "react";
import { Routes, Route } from "react-router-dom";
import { Home, About, Dashboard, Campaigns, CampaignBuilder } from "../pages";
import AdminLayout from "../layouts/AdminLayout";

// Placeholder components for routes that don't have pages yet
const UserGuide = () => (
  <div style={{ padding: "2rem", textAlign: "center", color: "#fff" }}>
    <h2>User Guide</h2>
    <p>User guide page coming soon...</p>
  </div>
);

const Pricing = () => (
  <div style={{ padding: "2rem", textAlign: "center", color: "#fff" }}>
    <h2>Pricing</h2>
    <p>Pricing page coming soon...</p>
  </div>
);

const Login = () => (
  <div style={{ padding: "2rem", textAlign: "center", color: "#fff" }}>
    <h2>Login</h2>
    <p>Login page coming soon...</p>
  </div>
);

const SignUp = () => (
  <div style={{ padding: "2rem", textAlign: "center", color: "#fff" }}>
    <h2>Sign Up</h2>
    <p>Sign up page coming soon...</p>
  </div>
);

const NotFound = () => (
  <div style={{ padding: "2rem", textAlign: "center", color: "#fff" }}>
    <h2>404 - Page Not Found</h2>
    <p>The page you're looking for doesn't exist.</p>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/guide" element={<UserGuide />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/security"
        element={
          <AdminLayout>
            <div style={{ padding: "2rem", color: "#fff" }}>
              <h2>Security</h2>
              <p>Security page coming soon...</p>
            </div>
          </AdminLayout>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <AdminLayout>
            <div style={{ padding: "2rem", color: "#fff" }}>
              <h2>Analytics</h2>
              <p>Analytics page coming soon...</p>
            </div>
          </AdminLayout>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminLayout>
            <div style={{ padding: "2rem", color: "#fff" }}>
              <h2>Users</h2>
              <p>Users page coming soon...</p>
            </div>
          </AdminLayout>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <AdminLayout>
            <div style={{ padding: "2rem", color: "#fff" }}>
              <h2>Reports</h2>
              <p>Reports page coming soon...</p>
            </div>
          </AdminLayout>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <AdminLayout>
            <div style={{ padding: "2rem", color: "#fff" }}>
              <h2>Settings</h2>
              <p>Settings page coming soon...</p>
            </div>
          </AdminLayout>
        }
      />
      <Route
        path="/admin/campaigns"
        element={
          <AdminLayout>
            <Campaigns />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/campaigns/create"
        element={
          <AdminLayout>
            <CampaignBuilder />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/campaigns/:id"
        element={
          <AdminLayout>
            <div style={{ padding: "2rem", color: "#fff" }}>
              <h2>Campaign Details</h2>
              <p>Campaign details page coming soon...</p>
            </div>
          </AdminLayout>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
