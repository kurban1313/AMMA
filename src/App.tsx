// AMMA Healthcare Platform - Main App Component

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '@/store';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from '@/components/ScrollToTop';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import DashboardLayout from '@/layouts/DashboardLayout';

// Public Pages
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import FeaturesPage from '@/pages/FeaturesPage';

// Patient Portal
import PatientDashboard from '@/pages/patient/Dashboard';
import FamilyMembers from '@/pages/patient/FamilyMembers';
import MedicalRecords from '@/pages/patient/MedicalRecords';
import Appointments from '@/pages/patient/Appointments';
import HealthPredictions from '@/pages/patient/HealthPredictions';
import TrustedDoctors from '@/pages/patient/TrustedDoctors';

// Doctor Portal
import DoctorDashboard from '@/pages/doctor/Dashboard';
import DoctorPatients from '@/pages/doctor/Patients';
import DoctorAppointments from '@/pages/doctor/Appointments';
import DoctorRecords from '@/pages/doctor/Records';
import DoctorProfile from '@/pages/doctor/Profile';

// Researcher Portal
import ResearcherDashboard from '@/pages/researcher/Dashboard';
import ResearchChatbot from '@/pages/researcher/Chatbot';
import ResearchQueries from '@/pages/researcher/Queries';
import ResearchExports from '@/pages/researcher/Exports';

// Admin
import AdminDashboard from '@/pages/admin/Dashboard';

// Components
import ProtectedRoute from '@/components/ProtectedRoute';
import RoleRoute from '@/components/RoleRoute';

function App() {
  const { isAuthenticated } = useAuthStore();

  // Initialize mock data on app load
  useEffect(() => {
    // Pre-load any necessary data
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-background font-sans antialiased">
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />}
            />
            <Route
              path="/register"
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />}
            />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              {/* Patient Routes */}
              <Route element={<RoleRoute allowedRoles={['patient']} />}>
                <Route path="/dashboard" element={<PatientDashboard />} />
                <Route path="/patient/family" element={<FamilyMembers />} />
                <Route path="/patient/records" element={<MedicalRecords />} />
                <Route path="/patient/appointments" element={<Appointments />} />
                <Route path="/patient/predictions" element={<HealthPredictions />} />
                <Route path="/patient/doctors" element={<TrustedDoctors />} />
              </Route>

              {/* Doctor Routes */}
              <Route element={<RoleRoute allowedRoles={['doctor']} />}>
                <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
                <Route path="/doctor/patients" element={<DoctorPatients />} />
                <Route path="/doctor/appointments" element={<DoctorAppointments />} />
                <Route path="/doctor/records" element={<DoctorRecords />} />
                <Route path="/doctor/profile" element={<DoctorProfile />} />
              </Route>

              {/* Researcher Routes */}
              <Route element={<RoleRoute allowedRoles={['researcher']} />}>
                <Route path="/researcher/dashboard" element={<ResearcherDashboard />} />
                <Route path="/researcher/chatbot" element={<ResearchChatbot />} />
                <Route path="/researcher/queries" element={<ResearchQueries />} />
                <Route path="/researcher/exports" element={<ResearchExports />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<RoleRoute allowedRoles={['admin']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </div>
    </Router>
  );
}

export default App;
