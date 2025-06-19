import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import './assets/styles/global.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import { AuthProvider } from './context/AuthContext';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import HealthDeclaration from './pages/HealthDeclaration';
import HealthCheckManagement from './pages/HealthCheckManagement';
import VaccinationManagement from './pages/VaccinationManagement';
import SendMedicine from './pages/SendMedicine';
import RecordProcess from './pages/RecordProcess';
import DocumentsBlog from './pages/DocumentsBlog';

function App() {  const location = useLocation();
  // Define routes where Sidebar should be shown
  const sidebarRoutes = [
    '/dashboard',
    '/health-declaration',
    '/health-check-management',
    '/vaccination-management',
    '/send-medicine',
    '/record-process',
    '/documents-blog'
  ];
  
  // Define routes where Navbar and Footer should be hidden
  // All routes with sidebar plus login/register should hide navbar
  const noNavbarRoutes = ['/login', '/register', ...sidebarRoutes];
  
  const showNavbar = !noNavbarRoutes.includes(location.pathname);
  const showSidebar = sidebarRoutes.includes(location.pathname);
  
  return (
    <AuthProvider>      <div className="App">
        {showNavbar && <Navbar />}
        <div className={`app-container ${showSidebar ? 'with-sidebar' : ''}`}>
          {showSidebar && <Sidebar />}
          <main className={`content-container ${!showNavbar ? 'full-height' : ''} ${showSidebar ? 'content-with-sidebar' : ''}`}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* Các route không sử dụng ProtectedRoute */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/health-declaration" element={<HealthDeclaration />} />
              <Route path="/health-check-management" element={<HealthCheckManagement />} />
              <Route path="/vaccination-management" element={<VaccinationManagement />} />
              <Route path="/send-medicine" element={<SendMedicine />} />
              <Route path="/record-process" element={<RecordProcess />} />
              <Route path="/documents-blog" element={<DocumentsBlog />} />
            </Routes>
          </main>
        </div>
        {showNavbar && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;
