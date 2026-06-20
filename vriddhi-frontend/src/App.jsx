import React, { useState, useContext } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import Tests from './pages/Tests';
import Packages from './pages/Packages';
import Book from './pages/Book';
import BookingSuccess from './pages/BookingSuccess';
import About from './pages/About';
import Contact from './pages/Contact';

// Admin Pages
import AdminDashboard from './admin/AdminDashboard';
import TestManager from './admin/TestManager';
import PackageManager from './admin/PackageManager';
import BookingManager from './admin/BookingManager';
import OfferManager from './admin/OfferManager';

// User & Auth Pages
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';

// Context & Loading Spinner
import { AuthContext } from './context/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';

// Admin only protection
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);
  
  if (loading) return <LoadingSpinner fullPage />;
  if (!isAuthenticated || user?.role !== 'admin') return <Navigate to="/login" replace />;
  
  return children;
};

// Patient only protection
const UserRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);
  
  if (loading) return <LoadingSpinner fullPage />;
  if (!isAuthenticated || user?.role !== 'user') return <Navigate to="/login" replace />;
  
  return children;
};

export default function App() {
  const navigate = useNavigate();
  const [selectedTests, setSelectedTests] = useState([]);

  // Add or remove items from selections list
  const handleToggleSelect = (item) => {
    setSelectedTests(prev => {
      const exists = prev.some(t => t._id === item._id);
      if (exists) {
        return prev.filter(t => t._id !== item._id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleAddTest = (item) => {
    setSelectedTests(prev => {
      const exists = prev.some(t => t._id === item._id);
      if (exists) return prev;
      return [...prev, item];
    });
  };

  const handleRemoveTest = (item) => {
    setSelectedTests(prev => prev.filter(t => t._id !== item._id));
  };

  const handleBookNow = (item) => {
    setSelectedTests(prev => {
      const exists = prev.some(t => t._id === item._id);
      if (exists) return prev;
      return [...prev, item];
    });
    navigate('/book');
  };

  const handleClearTests = () => {
    setSelectedTests([]);
  };

  return (
    <div className="app-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Sticky Navigation Bar */}
      <Navbar selectedCount={selectedTests.length} />

      {/* Main Page Area */}
      <main style={{ flexGrow: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
              <Home 
                selectedTests={selectedTests} 
                onToggleSelect={handleToggleSelect} 
                onBookNow={handleBookNow} 
              />
            } 
          />
          <Route 
            path="/tests" 
            element={
              <Tests 
                selectedTests={selectedTests} 
                onToggleSelect={handleToggleSelect} 
                onBookNow={handleBookNow} 
              />
            } 
          />
          <Route 
            path="/packages" 
            element={
              <Packages 
                selectedTests={selectedTests} 
                onToggleSelect={handleToggleSelect} 
                onBookNow={handleBookNow} 
              />
            } 
          />
          <Route 
            path="/book" 
            element={
              <Book 
                selectedTests={selectedTests} 
                onRemoveTest={handleRemoveTest} 
                onAddTest={handleAddTest} 
                onClearTests={handleClearTests} 
              />
            } 
          />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth & User Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<Navigate to="/login" replace />} />
          
          <Route 
            path="/dashboard" 
            element={
              <UserRoute>
                <UserDashboard />
              </UserRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/bookings" 
            element={
              <AdminRoute>
                <BookingManager />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/tests" 
            element={
              <AdminRoute>
                <TestManager />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/packages" 
            element={
              <AdminRoute>
                <PackageManager />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/offers" 
            element={
              <AdminRoute>
                <OfferManager />
              </AdminRoute>
            } 
          />

          {/* Fallback Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer Details */}
      <Footer />
    </div>
  );
}
