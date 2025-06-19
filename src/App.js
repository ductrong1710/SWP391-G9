import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import './assets/styles/global.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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

function App() {
  const location = useLocation();
  
  // Define routes where Navbar and Footer should be hidden
  const noNavbarRoutes = ['/login', '/register'];
  const showNavbar = !noNavbarRoutes.includes(location.pathname);
  
  return (
    <AuthProvider>
      <div className="App">
        {showNavbar && <Navbar />}
        <main className={`content-container ${!showNavbar ? 'full-height' : ''}`}>
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
        {showNavbar && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;
