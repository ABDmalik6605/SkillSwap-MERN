import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import Landing from './pages/Landing.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NotFound from './pages/NotFound.jsx';
import ContactPage from './pages/ContactPage.jsx';
import LoginPage from './features/auth/LoginPage.jsx';
import RegisterPage from './features/auth/RegisterPage.jsx';
import DiscoverPage from './features/discover/DiscoverPage.jsx';
import RequestsPage from './features/requests/RequestsPage.jsx';
import BookingPage from './features/bookings/BookingPage.jsx';
import ChatList from './features/chat/ChatList.jsx';
import ProfilePage from './features/users/ProfilePage.jsx';
import EditProfile from './features/users/EditProfile.jsx';
import BlogsPage from './features/blogs/BlogsPage.jsx';
import CreditsPage from './features/credits/CreditsPage.jsx';
import CertificatePage from './features/certificates/CertificatePage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import useAuth from './hooks/useAuth.js';
import { fetchCurrentUser } from './features/auth/authSlice.js';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  return isAuthenticated && user?.role === 'admin' ? children : <Navigate to="/dashboard" replace />;
};

const DashboardLayout = ({ children }) => (
  <div className="min-h-screen flex bg-slate-50">
    <Sidebar />
    <main className="flex-1 p-6 space-y-6">{children}</main>
  </div>
);

const App = () => {
  const dispatch = useDispatch();
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/blog" element={<BlogsPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Protected dashboard routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout><Dashboard /></DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <PrivateRoute>
                <DashboardLayout><RequestsPage /></DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <PrivateRoute>
                <DashboardLayout><BookingPage /></DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <DashboardLayout><ChatList /></DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <PrivateRoute>
                <DashboardLayout><ProfilePage /></DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/edit/me"
            element={
              <PrivateRoute>
                <DashboardLayout><EditProfile /></DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/credits"
            element={
              <PrivateRoute>
                <DashboardLayout><CreditsPage /></DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/certificates"
            element={
              <PrivateRoute>
                <DashboardLayout><CertificatePage /></DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <DashboardLayout><AdminDashboard /></DashboardLayout>
              </AdminRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;

