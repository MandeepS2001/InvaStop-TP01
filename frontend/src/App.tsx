import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import EducationPage from './pages/EducationPage';
import SpeciesDetailPage from './pages/SpeciesDetailPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="education" element={<EducationPage />} />
          <Route path="species/:speciesId" element={<SpeciesDetailPage />} />
          
          {/* Placeholder routes for future pages */}
          <Route path="login" element={<div className="p-8 text-center">Login Page - Coming Soon</div>} />
          <Route path="register" element={<div className="p-8 text-center">Register Page - Coming Soon</div>} />
          <Route path="dashboard" element={<div className="p-8 text-center">Dashboard Page - Coming Soon</div>} />
          <Route path="species" element={<div className="p-8 text-center">Species Page - Coming Soon</div>} />
          <Route path="reports" element={<div className="p-8 text-center">Reports Page - Coming Soon</div>} />
          <Route path="analytics" element={<div className="p-8 text-center">Analytics Page - Coming Soon</div>} />
          <Route path="profile" element={<div className="p-8 text-center">Profile Page - Coming Soon</div>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
