// App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/navbar.jsx";
import Footer from "./components/Footer.jsx";
import Aboutus from "./pages/Aboutus.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import FitJourneyDashboard from "./pages/FitJourneyDashboard.jsx";
import WorkoutForm from "./pages/WorkoutForm.jsx";
import SetGoals from "./pages/SetGoals.jsx";
import Profile from "./pages/Profile.jsx";
import AuthProvider from "./components/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthCallbackPage from "./pages/AuthCallbackPage.jsx";
import Progress from "./pages/Progress.jsx";
import AdminUserManagement from "./Admin/AdminUserManagement.jsx";
import AdminDashboard from "./Admin/AdminDashboard.jsx";
import AdminPanel from "./Admin/AdminPanel.jsx";
import DietPlanManagement from "./Admin/DietPlanManagement.jsx";
import WorkoutManagement from "./Admin/WorkoutManagement.jsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import BlogManagement from "./Admin/BlogManagement.jsx";
import BlogView from "./pages/BlogView.jsx";
import BlogList from "./pages/BlogList.jsx";
import DietPlanDetail from "./Admin/DietPlanDetail.jsx";
import "./styles/global.css";

const FooterHandler = () => {
  const location = useLocation();
  const noFooterPaths = [
    "/AdminPanel",
    "/AdminDashboard",
    "/WorkoutManagement",
    "/AdminUserManagement",
    "/DietPlanManagement",
    "/BlogManagement",
  ];

  return (
    !noFooterPaths.some((path) => location.pathname.startsWith(path)) && (
      <Footer />
    )
  );
};

const NavbarHandler = () => {
  const location = useLocation();
  const noNavbarPaths = [
    "/AdminPanel",
    "/AdminDashboard",
    "/WorkoutManagement",
    "/AdminUserManagement",
    "/DietPlanManagement",
    "/BlogManagement",
  ];

  return (
    !noNavbarPaths.some((path) => location.pathname.startsWith(path)) && (
      <Navbar />
    )
  );
};

function App() {
  // Fix: Use import.meta.env instead of import.meta.env.REACT_APP_*
  // Vite uses import.meta.env.VITE_* for environment variables
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <div className="app">
            <NavbarHandler />
            <main>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Aboutus />} />
                <Route path="/SignupPage" element={<SignupPage />} />
                <Route path="/LoginPage" element={<LoginPage />} />
                <Route path="/auth/callback" element={<AuthCallbackPage />} />
                <Route path="/blog" element={<BlogList />} />
                <Route path="/blog/:id" element={<BlogView />} />

                {/* Protected routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <FitJourneyDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/FitJourneyDashboard"
                  element={
                    <ProtectedRoute>
                      <FitJourneyDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/WorkoutForm"
                  element={
                    <ProtectedRoute>
                      <WorkoutForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/SetGoals"
                  element={
                    <ProtectedRoute>
                      <SetGoals />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/Profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/progress"
                  element={
                    <ProtectedRoute>
                      <Progress />
                    </ProtectedRoute>
                  }
                />

                {/* Admin routes */}
                <Route
                  path="/AdminPanel"
                  element={
                    <AdminProtectedRoute>
                      <AdminPanel />
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="/AdminDashboard"
                  element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="/AdminUserManagement"
                  element={
                    <AdminProtectedRoute>
                      <AdminUserManagement />
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="/WorkoutManagement"
                  element={
                    <AdminProtectedRoute>
                      <WorkoutManagement />
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="/DietPlanManagement"
                  element={
                    <AdminProtectedRoute>
                      <DietPlanManagement />
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="/BlogManagement"
                  element={
                    <AdminProtectedRoute>
                      <BlogManagement />
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="/diet-plans/:id"
                  element={
                    <AdminProtectedRoute>
                      <DietPlanDetail />
                    </AdminProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
            <FooterHandler />
          </div>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
