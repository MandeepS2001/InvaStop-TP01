import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  // Use the same authentication method as AuthGate
  const isAuthenticated = typeof window !== 'undefined' && sessionStorage.getItem('tp01_auth') === 'true';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {isAuthenticated && <Sidebar />}
        <main className={`flex-1 ${isAuthenticated ? 'ml-64' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
